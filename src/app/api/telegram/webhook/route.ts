import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

// 🔐 TOKENS & ENVIRONMENT VARIABLES (SECURE SYSTEM LOCKER)
const BOT_TOKEN = "8911554064:AAH4QUzD2aWDn3dHBjeaf3pLCAJnND-Csnw";
const ADMIN_CHAT_ID = "5593004632"; // Strict Owner Auth
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 

// Helper: Telegram API transaction request router
async function sendTelegram(method: string, payload: any) {
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Telegram API communication failure:", err);
  }
}

// 🤖 UPGRADED FAIL-SAFE AI PARSER NODE
async function askGeminiToParse(userPrompt: string, existingProductsSummary: string) {
  if (!GEMINI_API_KEY) {
    return { action: "UNKNOWN", reply: "❌ Vercel Configuration Error: GEMINI_API_KEY Missing in Environment Locker." };
  }

  const systemInstruction = `You are Afruz Core Web Server Control AI. Analyze the user's natural language request regarding a Next.js course store database management system.
Current Live Database Rows summary: ${existingProductsSummary}

You must output ONLY a valid JSON object matching one of these strict architectural action formats, nothing else:
For Creating/Adding: { "action": "ADD", "title": "...", "subtitle": "...", "price": "...", "instructor": "...", "imageUrl": "..." }
For Modifying/Updating: { "action": "UPDATE", "id": 12, "title": "...", "subtitle": "...", "price": "...", "instructor": "...", "imageUrl": "..." }
For Erasing/Deleting: { "action": "DELETE", "id": 12 }
If vague: { "action": "UNKNOWN", "reply": "Mujhe database commands clear nahi mile, Afruz bhai." }`;

  try {
    // Timeout limits management logic
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds boundary limit

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
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
    
    if (!data.candidates || data.candidates.length === 0) {
      return { action: "UNKNOWN", reply: "❌ Gemini API layer rejected token access. Active variables matrix verify karein." };
    }

    let jsonText = data.candidates[0].content.parts[0].text.trim();
    
    // Removing string wrappers constraints patterns safely
    if (jsonText.startsWith("```json")) jsonText = jsonText.replace("```json", "");
    if (jsonText.startsWith("```")) jsonText = jsonText.replace("```", "");
    if (jsonText.endsWith("```")) jsonText = jsonText.slice(0, -3);
    
    return JSON.parse(jsonText.trim());
  } catch (err: any) {
    console.error("Gemini processing fault loop:", err);
    return { action: "UNKNOWN", reply: `❌ Request dropped. Token invalidation or latency issue. Nayi fresh API key set karke Vercel redeploy check karein.` };
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. HANDLE INLINE BUTTON CLICKS (CALLBACK QUERIES)
    if (body.callback_query) {
      const callback = body.callback_query;
      const messageId = callback.message.message_id;
      if (String(callback.from.id) !== ADMIN_CHAT_ID) return Response.json({ success: true });
      await sendTelegram("answerCallbackQuery", { callback_query_id: callback.id });

      if (callback.data === "menu_main") {
        await sendTelegram("editMessageText", {
          chat_id: ADMIN_CHAT_ID,
          message_id: messageId,
          text: "🤖 *AFRUZ CORE OPERATIONAL SYSTEM BOT v4.0 (AI SCRIPT SAFE)*\n\nAb aap kisi bhi simple language ya instructions me message bhej sakte hain, Gemini AI automatic secure parse karke database live update karega!",
          parse_mode: "Markdown"
        });
      }
      return Response.json({ success: true });
    }

    // 2. 🧠 REAL-TIME NATURAL LANGUAGE INTERACTION HANDLING
    if (body.message) {
      const msg = body.message;
      const chatId = String(msg.chat.id);
      const text = msg.text || "";

      if (chatId !== ADMIN_CHAT_ID) return Response.json({ success: true });

      if (text === "/start" || text === "/list") {
        await sendTelegram("sendMessage", {
          chat_id: chatId,
          text: "🤖 *SYSTEM ACTIVE:* Afruz bhai, koi bhi instructions normal hinglish ya english me likhein (e.g., *'ek naya course add karo...'* ya *'course id 5 delete kar do'*). Base layout pipeline fully safe hai."
        });
        return Response.json({ success: true });
      }

      // Fetch all currently active products mapping context matrix summary for Gemini context reference
      const allProducts = await db.select().from(products).orderBy(desc(products.id));
      const dbSummary = allProducts.map(p => `[ID: ${p.id}, Title: ${p.title}, Price: ${p.price}, Instructor: ${p.instructor}]`).join("; ");

      await sendTelegram("sendChatAction", { chat_id: chatId, action: "typing" });
      
      // Pass execution bounds query control to Gemini AI layer
      const aiDecision = await askGeminiToParse(text, dbSummary);

      if (aiDecision.action === "ADD") {
        const slug = aiDecision.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
        const insertData: any = {
          slug, title: aiDecision.title,
          subtitle: aiDecision.subtitle || "AI Managed Assets Module",
          description: "Database transaction pipe executed safely via Gemini Webhook Automation system context layer.",
          categorySlug: "courses", level: "Expert",
          price: String(aiDecision.price || "99"), compareAtPrice: String(Number(aiDecision.price || 99) * 2),
          durationHours: "15", lessons: 40, rating: "5.0", reviewCount: 10,
          instructor: aiDecision.instructor || "Afruz Node", instructorTitle: "AI Consultant",
          accent: aiDecision.imageUrl || "#cyan", glyph: "brain",
          highlights: JSON.stringify(["100% Automated"]),
          curriculum: JSON.stringify([{ title: "Module 1", lessons: ["Overview Core"] }]),
          outcomes: JSON.stringify(["Scale Processing Operations"]), featured: true
        };

        await (db.insert(products).values([insertData]) as any);
        await sendTelegram("sendMessage", { chat_id: chatId, text: `🎉 *AI Sync Complete: New Product Deployed!*\n\n*Title:* ${aiDecision.title}\n*Price:* ₹${aiDecision.price}\n*Instructor:* ${aiDecision.instructor}` });
      } 
      
      else if (aiDecision.action === "UPDATE") {
        await db.update(products)
          .set({
            title: aiDecision.title,
            subtitle: aiDecision.subtitle,
            price: String(aiDecision.price),
            instructor: aiDecision.instructor,
            accent: aiDecision.imageUrl
          })
          .where(eq(products.id, aiDecision.id));

        await sendTelegram("sendMessage", { chat_id: chatId, text: `✅ *AI Sync Complete: Target Registry ID ${aiDecision.id} Modified!*` });
      } 
      
      else if (aiDecision.action === "DELETE") {
        await db.delete(products).where(eq(products.id, aiDecision.id));
        await sendTelegram("sendMessage", { chat_id: chatId, text: `🗑️ *AI Sync Complete: Target Row Entity ID ${aiDecision.id} wiped out from schema database registry matrix!*` });
      } 
      
      else {
        await sendTelegram("sendMessage", { chat_id: chatId, text: aiDecision.reply || "Instructions clear nahi ho payi pipeline matrix parser parameters block me." });
      }
    }

    return Response.json({ success: true });
  } catch (error: any) {
    console.error("Critical AI webhook breakdown loop:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
