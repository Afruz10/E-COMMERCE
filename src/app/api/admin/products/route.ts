import { db } from "@/db";
import { products } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, subtitle, description, price, compareAtPrice, instructor } = body;

    // Strict fields checking
    if (!title || !price || !instructor) {
      return Response.json({ success: false, error: "Title, Price, aur Instructor mandatory hain! ❌" }, { status: 400 });
    }

    // 🔗 Automatic clean URL slug handler with timestamp to prevent identical collision entries
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

    // Dynamic database insertion directly pointing to Drizzle context schema structure
    const [newProduct] = await db.insert(products).values({
      slug,
      title,
      subtitle: subtitle || "Learn like a Pro in 2026",
      description: description || "Complete course guidelines and expert instructions.",
      categorySlug: "courses",
      level: "Beginner to Pro",
      price: String(price),
      compareAtPrice: String(compareAtPrice || Number(price) * 2),
      durationHours: "12.5",
      lessons: 30,
      rating: "5.0",
      reviewCount: 1,
      instructor,
      instructorTitle: "AI Specialist",
      accent: "#cyan",
      glyph: "cpu",
      highlights: JSON.stringify(["100% Practical Content", "Lifetime Server Access", "Priority Dedicated Chat Access"]),
      curriculum: JSON.stringify([
        { title: "Module 1: Fundamental Concepts", lessons: ["Welcome Overview", "Standard Toolkit Deployments"] },
        { title: "Module 2: Advanced Core Implementations", lessons: ["Automated Operational Routines", "Industry Deployments"] }
      ]),
      outcomes: JSON.stringify(["Build comprehensive custom production frameworks", "Deploy systems instantly to active clouds"]),
      featured: true,
    }).returning();

    // 🤖 INSTANT BACKEND LOG TO TELEGRAM BOT
    try {
      const botToken = "8911554064:AAH4QUzD2aWDn3dHBjeaf3pLCAJnND-Csnw";
      const chatId = "5593004632";
      const telegramMessage = `🚀 *Afruz Bhai! Website Par Naya Course Live Ho Gaya!* 🎉\n\n` +
        `📚 *Title:* ${title}\n` +
        `💰 *Price:* ₹${price}\n` +
        `👤 *Instructor:* ${instructor}\n` +
        `🔗 *Active Database URL Slug:* \`${slug}\``;

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: telegramMessage, parse_mode: "Markdown" }),
      });
    } catch (e) {
      console.error("Telegram dynamic trigger error:", e);
    }

    return Response.json({ success: true, product: newProduct });
  } catch (error: any) {
    console.error("Server execution exception logic error:", error);
    return Response.json({ success: false, error: error.message || "Internal database execution error." }, { status: 500 });
  }
}
