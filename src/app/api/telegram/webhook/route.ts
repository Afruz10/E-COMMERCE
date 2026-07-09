import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, desc, like } from "drizzle-orm";
import { GoogleGenAI } from "@google/generative-ai"; // Install via npm if needed, or use fetch pipeline below

export const dynamic = "force-dynamic";

const BOT_TOKEN = "8911554064:AAH4QUzD2aWDn3dHBjeaf3pLCAJnND-Csnw";
const ADMIN_CHAT_ID = "5593004632";
// Yahan apni direct Google Studio key string variables me inject karo
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBLsm0M_vQsLVp4vketFBX_TPn6hl9ddew"; 

async function sendTelegram(method: string, payload: any) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// 🤖 CORE AI INTELLIGENCE INTERCEPTOR ENGINE (Gemini API Native Fetch Loop)
async function askGeminiToParse(userPrompt: string, existingProductsSummary: string) {
  const systemInstruction = `
    You are Afruz Core Web Server Control AI. Analyze the user's natural language request regarding a Next.js course store database database management system.
    Current Live Database Rows summary: ${existingProductsSummary}
    
    You must output ONLY a valid JSON object matching one of these strict architectural action formats, nothing else, no markdown formatting blocks:
    
    For Creating/Adding:
    { "action": "ADD", "title": "...", "subtitle": "...", "price": "...", "instructor": "...", "imageUrl": "..." }
    
    For Modifying/Updating (Identify matching ID from rows summary):
    { "action": "UPDATE", "id": 12, "title": "...", "subtitle": "...", "price": "...", "instructor": "...", "imageUrl": "..." }
    
    For Erasing/Deleting (Identify matching ID from rows summary):
    { "action": "DELETE", "id": 12 }
    
    If the user text is just greeting or vague, output:
    { "action": "UNKNOWN", "reply": "Mujhe database modification commands clear nahi mile, Afruz bhai." }
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: { responseMimeType: "application/json" }
      })
    });
    
    const data = await response.json();
    const jsonText = data.candidates[0].content.parts[0].text;
    return JSON.parse(jsonText);
  } catch (err) {
    console.error("Gemini runtime parsing error:", err);
    return { action: "UNKNOWN", reply: "Gemini server parsing error pipeline timeout." };
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Inline Buttons clicks dashboard navigation
    if (body.callback_query) {
      const callback = body.callback_query;
      const messageId = callback.message.message_id;
      if (String(callback.from.id) !== ADMIN_CHAT_ID) return Response.json({ success: true });
      await sendTelegram("answerCallbackQuery", { callback_query_id: callback.id });

      if (callback.data === "menu_main") {
        await sendTelegram("editMessageText", {
          chat_id: ADMIN_CHAT_ID,
          message_id: messageId,
          text: "🤖 *AFRUZ CORE OPERATIONAL SYSTEM BOT v4.0 (AI ACTIVE)*\n\nAb aap kisi bhi simple language ya simple commands me message bhej sakte hain, Gemini AI automatic database sync handle karega!",
          parse_mode: "Markdown"
        });
      }
      return Response.json({ success: true });
    }

    // 🧠 REAL-TIME NATURAL LANGUAGE INTERACTION HANDLING
    if (body.message) {
      const msg = body.message;
      const chatId = String(msg.chat.id);
      const text = msg.text || "";

      if (chatId !== ADMIN_CHAT_ID) return Response.json({ success: true });

      if (text === "/start" || text === "/list") {
        await sendTelegram("sendMessage", {
          chat_id: chatId,
          text: "🤖 *SYSTEM ACTIVE:* Afruz bhai, koi bhi instructions normal hinglish ya english me likhein (e.g., *'ek naya course add karo...'* ya *'course id 5 delete kar do'*)."
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
