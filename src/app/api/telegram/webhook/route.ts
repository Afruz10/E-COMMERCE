import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

const BOT_TOKEN = "8911554064:AAH4QUzD2aWDn3dHBjeaf3pLCAJnND-Csnw";
const ADMIN_CHAT_ID = "5593004632"; 

async function sendTelegram(method: string, payload: any) {
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Telegram API failure:", err);
  }
}

async function askGeminiToParse(userPrompt: string, existingProductsSummary: string) {
  // 🔍 DIAGNOSTIC CHECK 1: Key load ho rahi hai ya nahi?
  const currentKey = process.env.GEMINI_API_KEY;
  if (!currentKey || currentKey.trim() === "") {
    return { action: "UNKNOWN", reply: "❌ SYSTEM DIAGNOSTICS: process.env.GEMINI_API_KEY khali hai! Vercel me Environment Variable sahi se save nahi hua ya variable ka naam galat hai." };
  }

  const systemInstruction = `You are Afruz Core Web Server Control AI. Analyze the user's request for Next.js store.
Current Live Database: ${existingProductsSummary}
Output ONLY strict JSON:
For Creating: { "action": "ADD", "title": "...", "subtitle": "...", "price": "...", "instructor": "...", "imageUrl": "..." }
For Modifying: { "action": "UPDATE", "id": 12, "title": "...", "subtitle": "...", "price": "...", "instructor": "...", "imageUrl": "..." }
For Deleting: { "action": "DELETE", "id": 12 }
If vague: { "action": "UNKNOWN", "reply": "Clear commands nahi mile." }`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${currentKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] }
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const data = await response.json();
    
    // 🔍 DIAGNOSTIC CHECK 2: Google ne response me kya error bheja?
    if (data.error) {
      return { action: "UNKNOWN", reply: `❌ GOOGLE API ERROR: ${data.error.message || "Unknown root error"}. Code: ${data.error.code}` };
    }
    
    if (!data.candidates || data.candidates.length === 0) {
      return { action: "UNKNOWN", reply: "❌ Gemini API response candidates list zero." };
    }

    let jsonText = data.candidates[0].content.parts[0].text.trim();
    if (jsonText.startsWith("```json")) jsonText = jsonText.replace("```json", "");
    if (jsonText.startsWith("```")) jsonText = jsonText.replace("```", "");
    if (jsonText.endsWith("```")) jsonText = jsonText.slice(0, -3);
    
    return JSON.parse(jsonText.trim());
  } catch (err: any) {
    return { action: "UNKNOWN", reply: `❌ Network Catch Exception: ${err.message || "Timeout"}` };
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.callback_query) {
      const callback = body.callback_query;
      if (String(callback.from.id) !== ADMIN_CHAT_ID) return Response.json({ success: true });
      await sendTelegram("answerCallbackQuery", { callback_query_id: callback.id });
      return Response.json({ success: true });
    }

    if (body.message) {
      const msg = body.message;
      const chatId = String(msg.chat.id);
      const text = msg.text || "";

      if (chatId !== ADMIN_CHAT_ID) return Response.json({ success: true });

      if (text === "/start" || text === "/list") {
        await sendTelegram("sendMessage", {
          chat_id: chatId,
          text: "🤖 *DIAGNOSTICS CHANNELS ACTIVE:* Afruz bhai, koi bhi text likho, ab hum log internal leak point pakad lenge!"
        });
        return Response.json({ success: true });
      }

      const allProducts = await db.select().from(products).orderBy(desc(products.id));
      const dbSummary = allProducts.map(p => `[ID: ${p.id}, Title: ${p.title}, Price: ${p.price}]`).join("; ");

      await sendTelegram("sendChatAction", { chat_id: chatId, action: "typing" });
      const aiDecision = await askGeminiToParse(text, dbSummary);

      if (aiDecision.action === "ADD") {
        const slug = aiDecision.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
        const insertData: any = {
          slug, title: aiDecision.title,
          subtitle: aiDecision.subtitle || "AI Course",
          description: "Telegram Bot Managed Backend Integration.",
          categorySlug: "courses", level: "Expert",
          price: String(aiDecision.price || "99"), compareAtPrice: String(Number(aiDecision.price || 99) * 2),
          durationHours: "10", lessons: 20, rating: "5.0", reviewCount: 2,
          instructor: aiDecision.instructor || "Afruz", instructorTitle: "Engineer",
          accent: aiDecision.imageUrl || "#cyan", glyph: "brain",
          highlights: JSON.stringify(["Automated"]),
          curriculum: JSON.stringify([{ title: "M1", lessons: ["Intro"] }]),
          outcomes: JSON.stringify(["Complete"]), featured: true
        };
        await (db.insert(products).values([insertData]) as any);
        await sendTelegram("sendMessage", { chat_id: chatId, text: `🎉 *AI Added:* ${aiDecision.title}` });
      } 
      else if (aiDecision.action === "UPDATE") {
        await db.update(products)
          .set({ title: aiDecision.title, price: String(aiDecision.price), instructor: aiDecision.instructor })
          .where(eq(products.id, aiDecision.id));
        await sendTelegram("sendMessage", { chat_id: chatId, text: `✅ *AI Updated ID:* ${aiDecision.id}` });
      } 
      else if (aiDecision.action === "DELETE") {
        await db.delete(products).where(eq(products.id, aiDecision.id));
        await sendTelegram("sendMessage", { chat_id: chatId, text: `🗑️ *AI Deleted ID:* ${aiDecision.id}` });
      } 
      else {
        await sendTelegram("sendMessage", { chat_id: chatId, text: aiDecision.reply || "No clear action." });
      }
    }
    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
