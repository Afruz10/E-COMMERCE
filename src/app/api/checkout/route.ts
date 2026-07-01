import { db } from "@/db";
import { orders } from "@/db/schema";

export const dynamic = "force-dynamic";

type IncomingItem = { slug: string; title: string; price: number; qty: number };

const PROMO_CODE = "AICLAUDE";
const PROMO_RATE = 0.15;

function genRef() {
  const part = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `AFZ-${part()}-${part()}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, items, promoCode } = body as {
      email: string;
      name: string;
      items: IncomingItem[];
      promoCode?: string;
    };

    if (!email?.trim() || !name?.trim()) {
      return Response.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }
    if (!Array.isArray(items) || items.length === 0) {
      return Response.json({ error: "Cart is empty" }, { status: 400 });
    }

    const subtotal = items.reduce(
      (s, i) => s + Number(i.price) * Number(i.qty),
      0,
    );
    const promoValid =
      (promoCode ?? "").trim().toUpperCase() === PROMO_CODE;
    const discount = promoValid
      ? Math.round(subtotal * PROMO_RATE * 100) / 100
      : 0;
    const total = Math.max(0, subtotal - discount);
    const reference = genRef();

    const [order] = await db
      .insert(orders)
      .values({
        reference,
        email: String(email).slice(0, 160),
        name: String(name).slice(0, 120),
        items: items.map((i) => ({
          slug: i.slug,
          title: i.title,
          price: Number(i.price),
          qty: Number(i.qty),
        })),
        subtotal: subtotal.toFixed(2),
        discount: discount.toFixed(2),
        total: total.toFixed(2),
        status: "paid",
      })
      .returning();

    return Response.json({
      order: {
        reference: order.reference,
        email: order.email,
        name: order.name,
        subtotal,
        discount,
        total,
      },
    });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
