const write = Deno.env.get("BASE44_WRITE") === "true";
const matonApiKey = Deno.env.get("MATON_API_KEY") || "";
const matonBaseUrl = Deno.env.get("MATON_API_URL") || "https://api.maton.ai";
const domain = "4x4models.com";
const webshopName = "4x4models";

type EntityRecord = Record<string, unknown> & { id?: string };

const stats: Record<string, number | string> = {
  write: write ? "true" : "false",
  MerchantCenterAccount: 0,
  MerchantCenterProduct: 0,
};

function entity(name: string) {
  return base44.entities[name];
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry<T>(operation: () => Promise<T>, label: string): Promise<T> {
  const delays = [1500, 3500, 8000, 16000, 30000];
  for (let attempt = 0; attempt <= delays.length; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      const maybe = error as { status?: number; message?: string };
      const isRateLimit = maybe?.status === 429 || /rate limit/i.test(maybe?.message || "");
      if (!isRateLimit || attempt === delays.length) throw error;
      console.warn(`${label} hit rate limit; retrying in ${delays[attempt]}ms`);
      await sleep(delays[attempt]);
    }
  }
  throw new Error(`${label} failed after retries`);
}

async function listAll(entityName: string) {
  return await withRetry(
    () => entity(entityName).list(undefined, 5000) as Promise<EntityRecord[]>,
    `${entityName}.list`,
  );
}

async function updateRecord(entityName: string, id: string, payload: EntityRecord) {
  if (!write) return;
  await withRetry(() => entity(entityName).update(id, payload), `${entityName}.update`);
}

async function createRecord(entityName: string, payload: EntityRecord) {
  if (!write) return payload;
  return await withRetry(() => entity(entityName).create(payload), `${entityName}.create`);
}

async function upsert(entityName: string, records: EntityRecord[], match: (record: EntityRecord) => boolean, payload: EntityRecord) {
  const existing = records.find(match);
  if (existing?.id) {
    await updateRecord(entityName, existing.id, payload);
    return existing;
  }
  const created = await createRecord(entityName, payload);
  records.push(created as EntityRecord);
  return created;
}

function matonHeaders() {
  return {
    Authorization: `Bearer ${matonApiKey}`,
    Accept: "application/json",
  };
}

async function matonFetch(path: string, init: RequestInit = {}) {
  if (!matonApiKey) throw new Error("MATON_API_KEY ontbreekt in deze sessie.");
  const response = await fetch(`${matonBaseUrl}${path}`, {
    ...init,
    headers: {
      ...matonHeaders(),
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Maton ${path} failed (${response.status}): ${text.slice(0, 400)}`);
  }
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

function dateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function period() {
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 2);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 27);
  return { startDate: dateOnly(start), endDate: dateOnly(end) };
}

function priceString(value: unknown) {
  if (!value || typeof value !== "object") return "";
  const price = value as { amountMicros?: string | number; currencyCode?: string };
  if (!price.amountMicros) return "";
  const amount = Number(price.amountMicros) / 1_000_000;
  return `${price.currencyCode || "EUR"} ${amount.toFixed(2)}`;
}

function firstImage(product: EntityRecord) {
  const images = product.images;
  if (Array.isArray(images) && images[0]?.link) return String(images[0].link);
  return String(product.imageLink || product.thumbnailLink || "");
}

async function main() {
  const [webshops, accountRecords, productRecords] = await Promise.all([
    listAll("Webshop"),
    listAll("MerchantCenterAccount"),
    listAll("MerchantCenterProduct"),
  ]);
  const webshop = webshops.find((record) => record.name === webshopName) || webshops[0];
  const webshopId = String(webshop?.id || "");
  const syncedAt = new Date().toISOString();
  const { startDate, endDate } = period();

  const accountsPayload = await matonFetch("/google-merchant/accounts/v1/accounts");
  const accounts = Array.isArray(accountsPayload.accounts) ? accountsPayload.accounts as EntityRecord[] : [];

  for (const account of accounts) {
    const accountResource = String(account.name || "");
    if (!accountResource) continue;

    const productsPayload = await matonFetch(`/google-merchant/products/v1/${accountResource}/products?pageSize=250`);
    const products = Array.isArray(productsPayload.products) ? productsPayload.products as EntityRecord[] : [];

    await upsert(
      "MerchantCenterAccount",
      accountRecords,
      (record) => record.account_resource === accountResource,
      {
        webshop_id: webshopId,
        account_resource: accountResource,
        account_name: account.accountName || accountResource,
        domain,
        language_code: account.languageCode || "",
        time_zone: typeof account.timeZone === "object" && account.timeZone ? String((account.timeZone as { id?: string }).id || "") : "",
        product_count: products.length,
        synced_at: syncedAt,
        status: "active",
      },
    );
    stats.MerchantCenterAccount = Number(stats.MerchantCenterAccount) + 1;

    let performanceByOffer = new Map<string, EntityRecord>();
    try {
      const query = [
        "SELECT offer_id,title,brand,clicks,impressions,click_through_rate",
        "FROM product_performance_view",
        `WHERE date BETWEEN '${startDate}' AND '${endDate}'`,
      ].join(" ");
      const reportPayload = await matonFetch(
        `/google-merchant/reports/v1/${accountResource}/reports:search`,
        { method: "POST", body: JSON.stringify({ query }) },
      );
      const rows = Array.isArray(reportPayload.results) ? reportPayload.results as EntityRecord[] : [];
      performanceByOffer = new Map(rows.map((row) => {
        const view = (row.productPerformanceView || row.product_performance_view || row) as EntityRecord;
        return [String(view.offerId || view.offer_id || ""), view];
      }));
    } catch (error) {
      console.warn(`Merchant performance report skipped: ${(error as Error).message}`);
    }

    for (const product of products) {
      const productResource = String(product.name || product.id || "");
      if (!productResource) continue;
      const offerId = String(product.offerId || product.offer_id || product.contentLanguage || productResource.split("/").at(-1) || "");
      const performance = performanceByOffer.get(offerId) || {};
      const clicks = Number(performance.clicks || 0);
      const impressions = Number(performance.impressions || 0);

      await upsert(
        "MerchantCenterProduct",
        productRecords,
        (record) => record.product_resource === productResource,
        {
          webshop_id: webshopId,
          account_resource: accountResource,
          product_resource: productResource,
          offer_id: offerId,
          title: product.title || performance.title || "Product",
          brand: product.brand || performance.brand || "4x4models",
          link: product.link || product.canonicalLink || "",
          image_url: firstImage(product),
          availability: product.availability || "",
          price: priceString(product.price),
          clicks,
          impressions,
          ctr: Number(performance.clickThroughRate || performance.click_through_rate || (impressions ? clicks / impressions : 0)),
          period_start: startDate,
          period_end: endDate,
          synced_at: syncedAt,
          status: "active",
        },
      );
      stats.MerchantCenterProduct = Number(stats.MerchantCenterProduct) + 1;
    }
  }

  console.log(JSON.stringify(stats, null, 2));
}

await main();
