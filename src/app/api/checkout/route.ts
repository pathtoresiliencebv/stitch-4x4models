import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { items, customer } = await req.json();
    const appId = process.env.NEXT_PUBLIC_BASE44_APP_ID;
    const baseUrl = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL;

    if (!appId) {
      return NextResponse.json({ error: "Missing Base44 app id." }, { status: 500 });
    }

    if (!baseUrl) {
      return NextResponse.json({ error: "Missing site URL." }, { status: 500 });
    }

    const res = await fetch(`https://app.base44.com/api/apps/${appId}/functions/createCheckoutSession`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        webshop_id: process.env.NEXT_PUBLIC_WEBSHOP_ID,
        items,
        customer,
        success_url: `${baseUrl}/bedankt`,
        cancel_url: `${baseUrl}/winkelwagen`,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json({ error: data.error || "Checkout failed" }, { status: 400 });
    }

    return NextResponse.json({ checkoutUrl: data.checkoutUrl, order_id: data.order_id });
  } catch {
    return NextResponse.json({ error: "Invalid checkout request." }, { status: 400 });
  }
}
