import { db } from "@/db";
import { orders } from "@/db/schema";

export const dynamic = "force-dynamic";

// 🤖 Telegram Order Notification Bot
async function sendOrderNotification(message: string) {
  const botToken = "8911554064:AAH4QUzD2aWDn3dHBjeaf3pLCAJnND-Csnw";
  const chatId = "5593004632";
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "Markdown" }),
    });
  } catch (err) {
    console.error("Order bot failed:", err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, items, total, reference } = body;

    if (!email || !name || !items || !total || !reference) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    // Database me order save ho raha hai
    const [inserted] = await db.insert(orders).values({
      reference,
      email,
      name,
      items: typeof items === 'string' ? JSON.parse(items) : items,
      subtotal: String(total),
      total: String(total),
      status: "paid",
    }).returning();

    // 🔥 INSTANT TELEGRAM ALERT FOR ORDER!
    const orderMessage = `🎉 *Afruz Bhai! Naya Order Aaya Hai!* 💰\n\n` +
      `👤 *Name:* ${name}\n` +
      `📧 *Email:* ${email}\n` +
      `💵 *Amount Paid:* ₹${total}\n` +
      `🆔 *Ref ID:* \`${reference}\``;

    await sendOrderNotification(orderMessage);

    return Response.json({ success: true, order: inserted });
  } catch (error) {
    return Response.json({ error: "Checkout payment failed" }, { status: 500 });
  }
}
