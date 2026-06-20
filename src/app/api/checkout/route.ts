import { NextResponse } from "next/server";
import Stripe from "stripe";
import { base44Fetch } from "@/lib/base44-api";
import type { Product } from "@/types/product";

export const runtime = "nodejs";

type CheckoutItem = {
  productId?: string;
  product_id?: string;
  title?: string;
  quantity?: number;
  customization?: Record<string, string>;
};

type Customer = {
  email?: string;
  name?: string;
  phone?: string;
  shipping_address?: Record<string, string>;
};

const currency = "eur";

function stripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
  return new Stripe(key);
}

function appUrl(req: Request) {
  return process.env.NEXT_PUBLIC_SITE_URL || req.headers.get("origin") || "http://localhost:3217";
}

async function createOrderItems(orderId: string, items: Array<CheckoutItem & { product: Product; unitAmount: number }>) {
  await Promise.all(
    items.map((item) =>
      base44Fetch("/entities/OrderItem", {
        method: "POST",
        body: JSON.stringify({
          order_id: orderId,
          product_id: item.product.id,
          title: item.product.title || item.title || "Product",
          image_url: item.product.featured_image_url || "",
          sku: item.product.sku || "",
          price: item.unitAmount / 100,
          quantity: item.quantity,
          line_total: (item.unitAmount / 100) * (item.quantity || 1),
          customization: item.customization || {},
        }),
      })
    )
  );
}

export async function POST(req: Request) {
  try {
    const { items = [], customer = {}, lang = "en" } = (await req.json()) as {
      items?: CheckoutItem[];
      customer?: Customer;
      lang?: string;
    };

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    const normalized = await Promise.all(
      items.map(async (item) => {
        const productId = item.productId || item.product_id;
        if (!productId) throw new Error("Missing product id.");
        const product = await base44Fetch<Product>(`/entities/BlogPost/${productId}`);
        if (!product?.is_product || !["active", "published"].includes(product.status || "")) {
          throw new Error("Product is not available.");
        }
        const quantity = Math.max(1, Math.min(99, Number(item.quantity || 1)));
        const price = product.sale_price ?? product.price;
        if (!price || price <= 0) throw new Error("Product price is missing.");
        return { ...item, product, quantity, unitAmount: Math.round(price * 100) };
      })
    );

    const subtotal = normalized.reduce((sum, item) => sum + (item.unitAmount / 100) * item.quantity, 0);
    const shipping = subtotal > 500 ? 0 : 45;
    const tax = subtotal * 0.21;
    const total = subtotal + shipping + tax;
    const order = await base44Fetch<{ id: string; order_number?: string }>("/entities/Order", {
      method: "POST",
      body: JSON.stringify({
        webshop_id: process.env.NEXT_PUBLIC_WEBSHOP_ID || "4x4models",
        order_number: `4X4-${Date.now().toString(36).toUpperCase()}`,
        status: "pending",
        payment_status: "pending",
        checkout_locale: lang,
        customer_email: customer.email,
        customer_name: customer.name,
        customer_phone: customer.phone,
        shipping_address: customer.shipping_address || {},
        subtotal,
        shipping_cost: shipping,
        tax,
        total,
        currency,
      }),
    });
    await createOrderItems(order.id, normalized);

    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      customer_email: customer.email,
      metadata: { order_id: order.id },
      line_items: [
        ...normalized.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency,
            unit_amount: item.unitAmount,
            product_data: {
              name: item.product.title || item.title || "Product",
              images: item.product.featured_image_url ? [item.product.featured_image_url] : undefined,
            },
          },
        })),
        ...(shipping > 0
          ? [{
              quantity: 1,
              price_data: {
                currency,
                unit_amount: Math.round(shipping * 100),
                product_data: { name: "Shipping" },
              },
            }]
          : []),
        ...(tax > 0
          ? [{
              quantity: 1,
              price_data: {
                currency,
                unit_amount: Math.round(tax * 100),
                product_data: { name: "Tax" },
              },
            }]
          : []),
      ],
      success_url: `${appUrl(req)}/${lang}/shop/order-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl(req)}/${lang}/shop/cart`,
    });

    await base44Fetch(`/entities/Order/${order.id}`, {
      method: "PUT",
      body: JSON.stringify({ stripe_session_id: session.id }),
    });

    return NextResponse.json({ checkoutUrl: session.url, order_id: order.id });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid checkout request." }, { status: 400 });
  }
}
