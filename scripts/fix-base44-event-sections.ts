const write = Deno.env.get("BASE44_WRITE") === "true";

const eventRoutes = new Set([
  "amerikaans/events/overland-expo-west",
  "amerikaans/events/rednecks-with-paychecks",
  "amerikaans/events/sema-show",
  "amerikaans/events/ultimate-adventure",
]);

type EntityRecord = Record<string, unknown> & { id?: string };

const sections = await base44.entities.WebsiteSection.list(undefined, 5000) as EntityRecord[];
const cards = await base44.entities.WebsiteCard.list(undefined, 5000) as EntityRecord[];
let updated = 0;

for (const section of sections) {
  const pageSlug = String(section.page_slug || "");
  if (!eventRoutes.has(pageSlug)) continue;
  const hasCards = cards.some((card) => (
    card.page_slug === pageSlug &&
    (card.section_id === section.id || card.section_key === section.section_key) &&
    card.status !== "archived"
  ));
  const isGrid = [
    "card_grid",
    "brand_grid",
    "article_grid",
    "product_grid",
    "forum_grid",
  ].includes(String(section.section_type || ""));
  if (!isGrid || hasCards || !section.id) continue;

  updated += 1;
  if (write) {
    await base44.entities.WebsiteSection.update(section.id, {
      section_type: section.image_url ? "media" : "text",
      notes: "Eventdetail-inhoud zonder kaartcollectie; gecorrigeerd door de CRM-audit.",
    });
  }
}

console.log(JSON.stringify({ mode: write ? "write" : "dry-run", updated }, null, 2));
