import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

// 🔐 SECURE CONFIGURATION LOCKER
const BOT_TOKEN = "8911554064:AAH4QUzD2aWDn3dHBjeaf3pLCAJnND-Csnw";
const ADMIN_CHAT_ID = "5593004632"; // Only Afruz can access
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Telegram Response Sender
async function sendTelegram(method: string, payload: any) {
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Telegram API Error:", err);
  }
}

// 🤖 FIXES GENERATION ERROR & IMPLEMENTS STRICT JSON STRUCTURE
async function askGeminiToParse(userPrompt: string, dbSummary: string) {
  if (!GEMINI_API_KEY) {
    return { action: "UNKNOWN", reply: "❌ Vercel Config Error: GEMINI_API_KEY environment variable missing!" };
  }

  const systemInstruction = `You are Afruz Core Web Server Control AI. Analyze the user's request for a Next.js store database.
Current Live Database Products Summary: ${dbSummary}

You must respond with a clean JSON object based on the requested action. Do not add markdown or extra text.
For Creating: { "action": "ADD", "title": "...", "subtitle": "...", "price": "...", "instructor": "...", "imageUrl": "..." }
For Updating: { "action": "UPDATE", "id": 12, "title": "...", "subtitle": "...", "price": "...", "instructor": "...", "imageUrl": "..." }
For Deleting: { "action": "DELETE", "id": 12 }
If vague: { "action": "UNKNOWN", "reply": "Mujhe sahi database command nahi mila, Afruz bhai." }`;

  try {
    // 🔗 Updated Endpoint Structure explicitly using v1beta models path correctly
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `User Command: "${userPrompt}"` }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: {
          responseMimeType: "application/json" // ✨ Forces Gemini to return pure JSON without formatting bugs!
        }
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      return { action: "UNKNOWN", reply: `❌ GOOGLE ERROR: ${data.error.message}` };
    }
    
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      return { action: "UNKNOWN", reply: "❌ Pipeline Timeout: Gemini unexpected response format structure." };
    }

    const jsonText = data.candidates[0].content.parts[0].text.trim();
    return JSON.parse(jsonText);
  } catch (err: any) {
    return { action: "UNKNOWN", reply: `❌ System Parsing Error: ${err.message}` };
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Telegram Button Handlers
    if (body.callback_query) {
      const callback = body.callback_query;
      if (String(callback.from.id) !== ADMIN_CHAT_ID) return Response.json({ success: true });
      await sendTelegram("answerCallbackQuery", { callback_query_id: callback.id });
      return Response.json({ success: true });
    }

    // 2. Main Chat Processor
    if (body.message) {
      const msg = body.message;
      const chatId = String(msg.chat.id);
      const text = msg.text || "";

      // Security block
      if (chatId !== ADMIN_CHAT_ID) return Response.json({ success: true });

      if (text === "/start" || text === "/list") {
        await sendTelegram("sendMessage", {
          chat_id: chatId,
          text: "🤖 *NEW AI REGISTRY CORE V5.0 ACTIVE*\n\nAfruz bhai, ab aaram se plain language me bolo, jaise:\n• *'ek naya course add karo free fire scripting price 199'*\n• *'ID 5 wale course ka price 299 kar do'*\n• *'ID 3 ko delete karo'*"
        });
        return Response.json({ success: true });
      }

      // Fetch dynamic products to give AI real-time context
      const allProducts = await db.select().from(products).orderBy(desc(products.id));
      const dbSummary = allProducts.map(p => `[ID: ${p.id}, Title: ${p.title}, Price: ${p.price}, Instructor: ${p.instructor}]`).join("; ");

      await sendTelegram("sendChatAction", { chat_id: chatId, action: "typing" });
      
      // Process input directly with Gemini
      const aiResult = await askGeminiToParse(text, dbSummary);

      if (aiResult.action === "ADD") {
        const slug = (aiResult.title || "course").toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
        const newProduct: any = {
          slug, title: aiResult.title || "Untitled Course",
          subtitle: aiResult.subtitle || "Premium AI Asset Node",
          description: "Deployed smoothly via Telegram Admin Node Interface.",
          categorySlug: "courses", level: "Expert",
          price: String(aiResult.price || "99"), compareAtPrice: String(Number(aiResult.price || 99) * 2),
          durationHours: "12", lessons: 30, rating: "5.0", reviewCount: 5,
          instructor: aiResult.instructor || "Afruz", instructorTitle: "Lead Engineer",
          accent: aiResult.imageUrl || "#cyan", glyph: "terminal",
          highlights: JSON.stringify(["Fully Automated"]),
          curriculum: JSON.stringify([{ title: "Module 1", lessons: ["Core Operations"] }]),
          outcomes: JSON.stringify(["Database Managed"]), featured: true
        };

        await (db.insert(products).values([newProduct]) as any);
        await sendTelegram("sendMessage", { chat_id: chatId, text: `🎉 *AI Dynamic Add Success!*\n\n*Course:* ${aiResult.title}\n*Price:* ₹${aiResult.price}\n*Instructor:* ${aiResult.instructor}` });
      } 
      
      else if (aiResult.action === "UPDATE") {
        if (!aiResult.id) {
          await sendTelegram("sendMessage", { chat_id: chatId, text: "❌ Update failed: AI details me target Course ID trace nahi kar paya." });
          return Response.json({ success: true });
        }

        // Fetch current values to handle partial updates cleanly
        const existing = allProducts.find(p => p.id === Number(aiResult.id));
        
        await db.update(products)
          .set({
            title: aiResult.title || existing?.title,
            subtitle: aiResult.subtitle || existing?.subtitle,
            price: aiResult.price ? String(aiResult.price) : existing?.price,
            instructor: aiResult.instructor || existing?.instructor,
            accent: aiResult.imageUrl || existing?.accent
          })
          .where(eq(products.id, Number(aiResult.id)));

        await sendTelegram("sendMessage", { chat_id: chatId, text: `✅ *AI Dynamic Update Success!* Registry ID ${aiResult.id} updated.` });
      } 
      
      else if (aiResult.action === "DELETE") {
        if (!aiResult.id) {
          await sendTelegram("sendMessage", { chat_id: chatId, text: "❌ Delete failed: AI command me product ID specify nahi mila." });
          return Response.json({ success: true });
        }
        await db.delete(products).where(eq(products.id, Number(aiResult.id)));
        await sendTelegram("sendMessage", { chat_id: chatId, text: `🗑️ *AI Wiped Successfully!* Registry ID ${aiResult.id} removed from DB.` });
      } 
      
      else {
        await sendTelegram("sendMessage", { chat_id: chatId, text: aiResult.reply || "Kuch samajh nahi aaya bhai, please specifications clear likho." });
      }
    }

    return Response.json({ success: true });
  } catch (error: any) {
    console.error("Fatal Operational Loop Error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
