import { db } from "@/db";
import { products } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, subtitle, description, price, instructor } = body;

    if (!title || !price || !instructor) {
      return Response.json(
        { success: false, error: "Title, Price, aur Instructor fields zaroori hain! ❌" }, 
        { status: 400 }
      );
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

    // ✅ FIX: Object ko array [ ] me wrap kiya taaki Drizzle Overload strict validation pass ho jaye!
    const [newProduct] = await db.insert(products).values([
      {
        slug,
        title,
        subtitle: subtitle || "Learn like a Pro in 2026",
        description: description || "Complete course guidelines and expert instructions.",
        categorySlug: "courses",
        level: "Beginner to Pro",
        price: String(price),
        compareAtPrice: String(Number(price) * 2),
        durationHours: "10",
        lessons: 25,
        rating: "5.0",
        reviewCount: 1,
        instructor,
        instructorTitle: "AI Specialist",
        accent: "#cyan",
        glyph: "cpu",
        highlights: JSON.stringify(["100% Practical Content", "Lifetime Server Access"]),
        curriculum: JSON.stringify([
          { title: "Module 1: Introduction", lessons: ["Welcome Overview"] }
        ]),
        outcomes: JSON.stringify(["Build production systems"]),
        featured: true,
      }
    ]).returning();

    // 🤖 TELEGRAM LOGS PIPELINE
    try {
      const botToken = "8911554064:AAH4QUzD2aWDn3dHBjeaf3pLCAJnND-Csnw";
      const chatId = "5593004632";
      const telegramMessage = `🚀 *Afruz Bhai! Website Par Naya Course Live Ho Gaya!* 🎉\n\n` +
        `📚 *Title:* ${title}\n` +
        `💰 *Price:* ₹${price}\n` +
        `👤 *Instructor:* ${instructor}\n` +
        `🔗 *Slug ID:* \`${slug}\``;

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: telegramMessage, parse_mode: "Markdown" }),
      });
    } catch (telegramErr) {
      console.error("Telegram dynamic log failed:", telegramErr);
    }

    return Response.json({ success: true, product: newProduct });
  } catch (error: any) {
    console.error("Critical server pipeline failure:", error);
    return Response.json(
      { success: false, error: error.message || "Internal database error." }, 
      { status: 500 }
    );
  }
}
