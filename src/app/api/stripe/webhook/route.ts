import { NextResponse } from "next/server";
import Stripe from "stripe";
import { base44Fetch, base44List } from "@/lib/base44-api";

export const runtime = "nodejs";

function stripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
  return new Stripe(key);
}

async function updateOrder(session: Stripe.Checkout.Session, status: "paid" | "failed") {
  const orderId = session.metadata?.order_id;
  const order =
    orderId ||
    (await base44List<{ id: string }>("Order", { q: { stripe_session_id: session.id }, limit: 1 })).records[0]?.id;
  if (!order) return;

  await base44Fetch(`/entities/Order/${order}`, {
    method: "PUT",
    body: JSON.stringify({
      status: status === "paid" ? "paid" : "pending",
      payment_status: status,
      stripe_session_id: session.id,
      stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : "",
      ...(status === "paid" ? { paid_at: new Date().toISOString() } : {}),
    }),
  });
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });

  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature) return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });

    const event = stripe().webhooks.constructEvent(await req.text(), signature, secret);

    if (event.type === "checkout.session.completed") {
      await updateOrder(event.data.object as Stripe.Checkout.Session, "paid");
    }

    if (event.type === "checkout.session.async_payment_failed") {
      await updateOrder(event.data.object as Stripe.Checkout.Session, "failed");
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Webhook error" }, { status: 400 });
  }
}
