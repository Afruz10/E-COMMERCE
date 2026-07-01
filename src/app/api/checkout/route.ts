import { db } from "@/db";
import { reviews } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

// 🤖 Telegram Bot Notification Function with your direct keys
async function sendTelegramNotification(message: string) {
  // Aapke tokens direct code me add kar diye hain
  const botToken = "8911554064:AAH4QUzD2aWDn3dHBjeaf3pLCAJnND-Csnw";
  const chatId = "5593004632";
  
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        chat_id: chatId, 
        text: message,
        parse_mode: "Markdown" // Isse bold aur formatting sahi dikhegi
      }),
    });
  } catch (err) {
    console.error("Telegram notification failed:", err);
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) {
    return Response.json({ error: "slug required" }, { status: 400 });
  }
  const rows = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productSlug, slug));
  return Response.json({ reviews: rows });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productSlug, author, role, rating, title, body: text } = body;

    if (!productSlug || !author?.trim() || !title?.trim() || !text?.trim()) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }
    const r = Math.min(5, Math.max(1, Number(rating) || 5));

    const [inserted] = await db
      .insert(reviews)
      .values({
        productSlug,
        author: String(author).slice(0, 80),
        role: String(role ?? "").slice(0, 80),
        rating: r,
        title: String(title).slice(0, 120),
        body: String(text).slice(0, 1000),
      })
      .returning();

    // 🔥 INSTANT TELEGRAM MESSAGE GENERATION
    const stars = "⭐".repeat(r);
    const telegramMessage = `📝 *Naya Review Aaya Hai Afruz Bhai!* \n\n` +
      `👤 *Author:* ${author}\n` +
      `🎯 *Role:* ${role ?? 'Student'}\n` +
      `📦 *Product:* ${productSlug}\n` +
      `⭐ *Rating:* ${stars} (${r}/5)\n` +
      `📌 *Title:* ${title}\n` +
      `💬 *Comment:* ${text}`;

    // Message ko Telegram par send karo
    await sendTelegramNotification(telegramMessage);

    return Response.json({
      review: { ...inserted, createdAt: inserted.createdAt.toISOString() },
    });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
