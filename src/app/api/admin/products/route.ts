import { db } from "@/db";
import { products } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, subtitle, description, price, compareAtPrice, instructor } = body;

    if (!title || !price || !instructor) {
      return Response.json({ success: false, error: "Sabhi fields fill karein!" }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

    // Dynamic key safe mapping to avoid TS compilation crash
    const [newProduct] = await db.insert(products).values({
      slug,
      title,
      subtitle: subtitle || "New Course",
      description: description || "Details coming soon.",
      categorySlug: "courses",
      level: "Beginner to Pro",
      price: String(price),
      compareAtPrice: String(compareAtPrice || Number(price) * 2),
      durationHours: "10",
      lessons: 20,
      rating: "5.0",
      reviewCount: 1,
      instructor,
      featured: true,
    }).returning();

    // Telegram Bot Sync
    const botToken = "8911554064:AAH4QUzD2aWDn3dHBjeaf3pLCAJnND-Csnw";
    const chatId = "5593004632";
    const telegramMessage = `🚀 *Afruz Bhai! Course Live Ho Gaya!*\n\n📚 *Title:* ${title}\n💰 *Price:* ₹${price}`;
    
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: telegramMessage, parse_mode: "Markdown" }),
    }).catch(e => console.log(e));

    return Response.json({ success: true, product: newProduct });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
