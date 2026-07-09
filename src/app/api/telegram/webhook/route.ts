import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

const BOT_TOKEN = "8911554064:AAH4QUzD2aWDn3dHBjeaf3pLCAJnND-Csnw";
const ADMIN_CHAT_ID = "5593004632"; // Strict Owner Auth

// Helper: Telegram message push controller
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

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. HANDLE INLINE BUTTON CLICKS (CALLBACK QUERIES)
    if (body.callback_query) {
      const callback = body.callback_query;
      const fromId = String(callback.from.id);
      const data = callback.data;
      const messageId = callback.message.message_id;

      if (fromId !== ADMIN_CHAT_ID) return Response.json({ success: false });

      // Telegram loading clock icon ko stop karne ke liye acknowledgement
      await sendTelegram("answerCallbackQuery", { callback_query_id: callback.id });

      // MAIN HUB NAVIGATION
      if (data === "menu_main") {
        const menuKeyboard = {
          inline_keyboard: [
            [{ text: "➕ Add Dynamic Product", callback_data: "menu_add" }],
            [{ text: "🔄 View & Edit Registry Chart", callback_data: "menu_chart" }],
            [{ text: "🗑️ Delete Asset Node", callback_data: "menu_delete_list" }]
          ]
        };
        await sendTelegram("editMessageText", {
          chat_id: ADMIN_CHAT_ID,
          message_id: messageId,
          text: "🤖 *AFRUZ CORE OPERATIONAL SYSTEM BOT v3.0*\n\nSelect corresponding action system execution protocol:",
          parse_mode: "Markdown",
          reply_markup: menuKeyboard
        });
      }
      // ADD COURSE GUIDE INSTRUCTIONS
      else if (data === "menu_add") {
        const backKeyboard = { inline_keyboard: [[{ text: "🔙 Main Menu", callback_data: "menu_main" }]] };
        await sendTelegram("editMessageText", {
          chat_id: ADMIN_CHAT_ID,
          message_id: messageId,
          text: "📝 *Database Direct Insertion Engine*\n\nNaya course add karne ke liye niche diye gaye format me ek single text message reply bhejein:\n\n`add: Title | Subtitle | Price | InstructorNode | ImageURL`",
          parse_mode: "Markdown",
          reply_markup: backKeyboard
        });
      }
      // RENDER EDIT CHART GRID
      else if (data === "menu_chart") {
        const allProducts = await db.select().from(products).orderBy(desc(products.id));
        const inlineKeyboard = allProducts.map((p) => [
          { text: `✏️ ${p.title} (₹${p.price})`, callback_data: `edit_select_${p.id}` }
        ]);
        inlineKeyboard.push([{ text: "🔙 Main Menu", callback_data: "menu_main" }]);

        await sendTelegram("editMessageText", {
          chat_id: ADMIN_CHAT_ID,
          message_id: messageId,
          text: "🔄 *Active Registry Schema Monitor*\n\nJis course ke values modify karne hain, uspar tap karein:",
          parse_mode: "Markdown",
          reply_markup: { inline_keyboard: inlineKeyboard }
        });
      }
      // RENDER DELETE CHART GRID
      else if (data === "menu_delete_list") {
        const allProducts = await db.select().from(products).orderBy(desc(products.id));
        const inlineKeyboard = allProducts.map((p) => [
          { text: `🗑️ Wipe: ${p.title}`, callback_data: `confirm_wipe_${p.id}` }
        ]);
        inlineKeyboard.push([{ text: "🔙 Main Menu", callback_data: "menu_main" }]);

        await sendTelegram("editMessageText", {
          chat_id: ADMIN_CHAT_ID,
          message_id: messageId,
          text: "🗑️ *Asset Registry Eraser Grid*\n\n⚠️ *Warning:* Kisi bhi product par tap karte hi database record instantly wipe out ho jayega:",
          parse_mode: "Markdown",
          reply_markup: { inline_keyboard: inlineKeyboard }
        });
      }
      // TARGET EDIT OPERATIONS SELECTOR
      else if (data.startsWith("edit_select_")) {
        const pId = parseInt(data.split("_")[2]);
        const [product] = await db.select().from(products).where(eq(products.id, pId));
        const backKeyboard = { inline_keyboard: [[{ text: "🔙 Back to Chart", callback_data: "menu_chart" }]] };

        if (!product) {
          await sendTelegram("sendMessage", { chat_id: ADMIN_CHAT_ID, text: "❌ Record not found." });
        } else {
          await sendTelegram("editMessageText", {
            chat_id: ADMIN_CHAT_ID,
            message_id: messageId,
            text: `📊 *Product Editing Sandbox*\n\n*Target ID:* \`${product.id}\`\n*Current Title:* ${product.title}\n\nIs course ke properties overwrite karne ke liye ye format text copy karke values update karke reply bhejein:\n\n\`update: ${product.id} | Title | Subtitle | Price | Instructor | ImageURL\``,
            parse_mode: "Markdown",
            reply_markup: backKeyboard
          });
        }
      }
      // EXECUTE WIPE ACTION DIRECTLY
      else if (data.startsWith("confirm_wipe_")) {
        const pId = parseInt(data.split("_")[2]);
        await db.delete(products).where(eq(products.id, pId));
        
        const backKeyboard = { inline_keyboard: [[{ text: "🔙 Main Menu", callback_data: "menu_main" }]] };
        await sendTelegram("editMessageText", {
          chat_id: ADMIN_CHAT_ID,
          message_id: messageId,
          text: "✅ Transaction Complete: Selected asset successfully removed from core database schema matrix.",
          parse_mode: "Markdown",
          reply_markup: backKeyboard
        });
      }

      return Response.json({ success: true });
    }

    // 2. HANDLE REAL-TIME INCOMING TEXT COMMANDS & REPLIES
    if (body.message) {
      const msg = body.message;
      const chatId = String(msg.chat.id);
      const text = msg.text || "";

      if (chatId !== ADMIN_CHAT_ID) return Response.json({ success: true });

      // INITIAL MASTER ROOT CALL
      if (text === "/start" || text === "/list" || text === "menu") {
        const menuKeyboard = {
          inline_keyboard: [
            [{ text: "➕ Add Dynamic Product", callback_data: "menu_add" }],
            [{ text: "🔄 View & Edit Registry Chart", callback_data: "menu_chart" }],
            [{ text: "🗑️ Delete Asset Node", callback_data: "menu_delete_list" }]
          ]
        };
        await sendTelegram("sendMessage", {
          chat_id: chatId,
          text: "🤖 *AFRUZ CORE OPERATIONAL SYSTEM BOT v3.0*\n\nSelect corresponding action system execution protocol:",
          parse_mode: "Markdown",
          reply_markup: menuKeyboard
        });
      }
      // PROCESS DIRECT TEXT COURSE INSERTION (Full Access)
      else if (text.startsWith("add:")) {
        const rawData = text.replace("add:", "").trim();
        const [title, subtitle, price, instructor, imageUrl] = rawData.split("|").map(s => s.trim());

        if (!title || !price || !instructor) {
          await sendTelegram("sendMessage", { chat_id: chatId, text: "❌ Parsing Error: Minimum metadata properties (Title, Price, Instructor) required." });
          return Response.json({ success: true });
        }

        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
        
        const insertData: any = {
          slug, title,
          subtitle: subtitle || "Premium Digital Course Assets",
          description: "Production configuration deployed via Telegram integration terminal hub.",
          categorySlug: "courses", level: "Pro",
          price: String(price), compareAtPrice: String(Number(price) * 2),
          durationHours: "12", lessons: 30, rating: "5.0", reviewCount: 5,
          instructor, instructorTitle: "System Engineer",
          accent: imageUrl || "#cyan", glyph: "terminal",
          highlights: JSON.stringify(["Full Automated Access"]),
          curriculum: JSON.stringify([{ title: "Module 1", lessons: ["Overview Terminal"] }]),
          outcomes: JSON.stringify(["Scale Infrastructure"]), featured: true
        };

        await (db.insert(products).values([insertData]) as any);
        
        const backKeyboard = { inline_keyboard: [[{ text: "🔙 Main Menu", callback_data: "menu_main" }]] };
        await sendTelegram("sendMessage", { chat_id: chatId, text: `🎉 *Core Registry Sync Success!*\n\n*Course:* ${title}\n*Price:* ₹${price}\nAsset live on blockchain network node structure.`, parse_mode: "Markdown", reply_markup: backKeyboard });
      }
      // PROCESS DIRECT TEXT COURSE UPDATE (Full Access)
      else if (text.startsWith("update:")) {
        const rawData = text.replace("update:", "").trim();
        const [idStr, title, subtitle, price, instructor, imageUrl] = rawData.split("|").map(s => s.trim());
        const pId = parseInt(idStr);

        if (!pId || !title || !price || !instructor) {
          await sendTelegram("sendMessage", { chat_id: chatId, text: "❌ Overwrite Block Interrupted: Parsing attributes failed." });
          return Response.json({ success: true });
        }

        await db.update(products)
          .set({ title, subtitle, price: String(price), instructor, accent: imageUrl || "#cyan" })
          .where(eq(products.id, pId));

        const backKeyboard = { inline_keyboard: [[{ text: "🔙 Main Menu", callback_data: "menu_main" }]] };
        await sendTelegram("sendMessage", { chat_id: chatId, text: `✅ *Asset Properties Modified!*\n\nTarget Schema row ID \`${pId}\` completely overwritten matching runtime state variables.`, parse_mode: "Markdown", reply_markup: backKeyboard });
      }
    }

    return Response.json({ success: true });
  } catch (error: any) {
    console.error("Critical webhook loop exception:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
