import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

// Bot Credentials Configuration
const BOT_TOKEN = "8911554064:AAH4QUzD2aWDn3dHBjeaf3pLCAJnND-Csnw";
const ADMIN_CHAT_ID = "5593004632"; // Strict ownership authorization check

async function sendTelegramMessage(chatId: string, text: string, replyMarkup?: any) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "Markdown",
      reply_markup: replyMarkup,
    }),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Handle Inline Button Clicks (Callback Queries)
    if (body.callback_query) {
      const callbackQuery = body.callback_query;
      const fromId = String(callbackQuery.from.id);
      const data = callbackQuery.data; // e.g., "action_del_12"

      if (fromId !== ADMIN_CHAT_ID) {
        return Response.json({ success: false, error: "Unauthorized" });
      }

      if (data === "refresh_list") {
        await renderProductChart(ADMIN_CHAT_ID);
      } 
      else if (data.startsWith("select_")) {
        const productId = parseInt(data.split("_")[1]);
        const [product] = await db.select().from(products).where(eq(products.id, productId));
        
        if (!product) {
          await sendTelegramMessage(ADMIN_CHAT_ID, "❌ Asset not found in registry.");
        } else {
          // Show options for the selected product
          const optsKeyboard = {
            inline_keyboard: [
              [
                { text: "🗑️ Confirm Delete", callback_data: `confirm_del_${product.id}` },
                { text: "🔙 Back to Chart", callback_data: "refresh_list" }
              ]
            ]
          };
          await sendTelegramMessage(ADMIN_CHAT_ID, `📊 *Selected Course:* ${product.title}\n💰 *Price:* ₹${product.price}\n👤 *Instructor:* ${product.instructor}\n\nKya action execute karna hai?`, optsKeyboard);
        }
      } 
      else if (data.startsWith("confirm_del_")) {
        const productId = parseInt(data.split("_")[2]);
        await db.delete(products).where(eq(products.id, productId));
        await sendTelegramMessage(ADMIN_CHAT_ID, "🗑️ Registry entry successfully wiped out from database!");
        await renderProductChart(ADMIN_CHAT_ID);
      }

      return Response.json({ success: true });
    }

    // 2. Handle Text Commands (/list)
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
    console.error("Webhook processing error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 📊 Function to generate clickable course chart grid
async function renderProductChart(chatId: string) {
  const allProducts = await db.select().from(products).orderBy(desc(products.id));

  if (allProducts.length === 0) {
    await sendTelegramMessage(chatId, "📭 Registry Matrix empty. No active courses found.");
    return;
  }

  // Build grid buttons dynamically from database records
  const inlineKeyboard = allProducts.map((p) => [
    { text: `${p.title} (₹${p.price})`, callback_data: `select_${p.id}` }
  ]);

  // Add a general refresh button at the bottom
  inlineKeyboard.push([{ text: "🔄 Refresh Grid Chart", callback_data: "refresh_list" }]);

  const replyMarkup = { inline_keyboard: inlineKeyboard };
  await sendTelegramMessage(chatId, "⚙️ *AFRUZ CORE CMS REGISTRY CHART*\n\nNiche active products ki list hai. Kisi bhi course par click karke use manage ya delete karo:", replyMarkup);
}
