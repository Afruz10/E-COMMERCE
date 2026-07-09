import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

// 🔐 SECURE CREDENTIALS LOCKER
const BOT_TOKEN = "8911554064:AAH4QUzD2aWDn3dHBjeaf3pLCAJnND-Csnw";
const ADMIN_CHAT_ID = "5593004632"; // Only Afruz Account

// Helper: Telegram Message Driver
async function sendTelegram(method: string, payload: any) {
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Telegram Transmission Error:", err);
  }
}

// 📊 Render Function: Wiping old messages to prevent double chart spamming
async function renderProductChart(chatId: string, messageId?: number) {
  const allProducts = await db.select().from(products).orderBy(desc(products.id));

  if (allProducts.length === 0) {
    const text = "📭 *AFRUZ STORE MATRIX*\n\nDatabase registry khali hai. Koi active courses nahi mile.";
    if (messageId) {
      await sendTelegram("editMessageText", { chat_id: chatId, message_id: messageId, text, parse_mode: "Markdown" });
    } else {
      await sendTelegram("sendMessage", { chat_id: chatId, text, parse_mode: "Markdown" });
    }
    return;
  }

  // Create clean rows of clickable buttons dynamically
  const inlineKeyboard = allProducts.map((p) => [
    { text: `📁 ${p.title} (₹${p.price})`, callback_data: `select_${p.id}` }
  ]);

  const text = "⚙️ *AFRUZ CORE CMS REGISTRY CHART*\n\nNiche aapke database ke live courses hain. Kisi par bhi click karke manage ya delete karein:";
  const replyMarkup = { inline_keyboard: inlineKeyboard };

  if (messageId) {
    // Overwrites existing message text so NO DOUBLE MESSAGES appear!
    await sendTelegram("editMessageText", { chat_id: chatId, message_id: messageId, text, parse_mode: "Markdown", reply_markup: replyMarkup });
  } else {
    await sendTelegram("sendMessage", { chat_id: chatId, text, parse_mode: "Markdown", reply_markup: replyMarkup });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. HANDLE BUTTON CLICKS (CALLBACK QUERIES)
    if (body.callback_query) {
      const callback = body.callback_query;
      const fromId = String(callback.from.id);
      const data = callback.data;
      const messageId = callback.message.message_id;

      if (fromId !== ADMIN_CHAT_ID) return Response.json({ success: true });

      // Stop loading clock spinner on button
      await sendTelegram("answerCallbackQuery", { callback_query_id: callback.id });

      // Action: Main List display/refresh trigger
      if (data === "refresh_list") {
        await renderProductChart(ADMIN_CHAT_ID, messageId);
      } 
      // Action: Course selected from list
      else if (data.startsWith("select_")) {
        const productId = parseInt(data.split("_")[1]);
        const [product] = await db.select().from(products).where(eq(products.id, productId));
        
        if (!product) {
          await sendTelegram("editMessageText", { chat_id: ADMIN_CHAT_ID, message_id: messageId, text: "❌ Asset node not found." });
        } else {
          const optsKeyboard = {
            inline_keyboard: [
              [
                { text: "🗑️ Confirm Delete", callback_data: `confirm_del_${product.id}` },
                { text: "🔙 Back to List", callback_data: "refresh_list" }
              ]
            ]
          };
          await sendTelegram("editMessageText", {
            chat_id: ADMIN_CHAT_ID,
            message_id: messageId,
            text: `📊 *COURSE PROFILE:*\n\n• *ID:* \`${product.id}\`\n• *Title:* ${product.title}\n• *Price:* ₹${product.price}\n• *Instructor:* ${product.instructor}\n\n⚠️ Kya is asset ko database se permanent wipe karna hai?`,
            parse_mode: "Markdown",
            reply_markup: optsKeyboard
          });
        }
      } 
      // Action: Absolute destruction of row execution
      else if (data.startsWith("confirm_del_")) {
        const productId = parseInt(data.split("_")[2]);
        await db.delete(products).where(eq(products.id, productId));
        
        // Notify and take back to updated chart automatically
        await renderProductChart(ADMIN_CHAT_ID, messageId);
      }

      return Response.json({ success: true });
    }

    // 2. HANDLE ROOT COMMANDS IN CHAT (/list)
    if (body.message) {
      const message = body.message;
      const chatId = String(message.chat.id);
      const text = message.text || "";

      if (chatId !== ADMIN_CHAT_ID) return Response.json({ success: true });

      if (text === "/list" || text === "/start") {
        await renderProductChart(chatId);
      }
    }

    return Response.json({ success: true });
  } catch (error: any) {
    console.error("Critical webhook exception:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
