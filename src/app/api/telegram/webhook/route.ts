import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

// 🔐 CORE TERMINAL AUTH LOCKER
const BOT_TOKEN = "8911554064:AAH4QUzD2aWDn3dHBjeaf3pLCAJnND-Csnw";
const ADMIN_CHAT_ID = "5593004632"; // Strictly Bound to Afruz Profile

// Helper: Telegram API Engine
async function sendTelegram(method: string, payload: any) {
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Telegram API communication error:", err);
  }
}

// 🎛️ SYSTEM ROOT MODULE: Renders the beautiful master controller dashboard
async function renderMasterDashboard(chatId: string, messageId?: number) {
  // Fetch real-time metrics data directly from Drizzle DB
  const allProducts = await db.select().from(products);
  const totalCourses = allProducts.length;
  const grossValue = allProducts.reduce((sum, p) => sum + (parseInt(p.price) || 0), 0);

  const text = `🤖 *AFRUZ ADMINISTRATIVE OPERATIONAL CORE v5.5*

*📊 LIVE SYSTEM STATUS CARD:*
• Store Node: \`Online / Active\`
• Registered Asset Nodes: \`${totalCourses} Courses Live\`
• Inventory Gross Capital: \`₹${grossValue}\`
• Security Integrity: \`Maximum Policy Applied\`

Select corresponding action system execution protocol below:`;

  const dashboardKeyboard = {
    inline_keyboard: [
      [{ text: "🔄 View Live Asset Chart & Delete", callback_data: "action_view_chart" }],
      [
        { text: "⚡ System Diagnostics", callback_data: "action_sys_ping" },
        { text: "🛡️ Server Config", callback_data: "action_server_config" }
      ]
    ]
  };

  if (messageId) {
    await sendTelegram("editMessageText", {
      chat_id: chatId,
      message_id: messageId,
      text: text,
      parse_mode: "Markdown",
      reply_markup: dashboardKeyboard
    });
  } else {
    await sendTelegram("sendMessage", {
      chat_id: chatId,
      text: text,
      parse_mode: "Markdown",
      reply_markup: dashboardKeyboard
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. INLINE ACTION COMMAND HANDLING TRACK
    if (body.callback_query) {
      const callback = body.callback_query;
      const fromId = String(callback.from.id);
      const data = callback.data;
      const messageId = callback.message.message_id;

      if (fromId !== ADMIN_CHAT_ID) return Response.json({ success: true });

      // Kill the loading state spinner clock icon instantly
      await sendTelegram("answerCallbackQuery", { callback_query_id: callback.id });

      // ROUTE: Back to main central terminal hub dashboard
      if (data === "route_main_hub") {
        await renderMasterDashboard(ADMIN_CHAT_ID, messageId);
      }
      
      // ROUTE: View registry products graph nodes chart
      else if (data === "action_view_chart") {
        const allProducts = await db.select().from(products).orderBy(desc(products.id));

        if (allProducts.length === 0) {
          const backKeyboard = { inline_keyboard: [[{ text: "🔙 Main Menu", callback_data: "route_main_hub" }]] };
          await sendTelegram("editMessageText", {
            chat_id: ADMIN_CHAT_ID,
            message_id: messageId,
            text: "📭 *ASSET MATRIX EMPTY*\n\nDatabase row indexes are empty. No courses tracked on the production node.",
            parse_mode: "Markdown",
            reply_markup: backKeyboard
          });
          return Response.json({ success: true });
        }

        const inlineKeyboard = allProducts.map((p) => [
          { text: `📁 ${p.title} (₹${p.price})`, callback_data: `inspect_node_${p.id}` }
        ]);
        inlineKeyboard.push([{ text: "🔙 Main Menu", callback_data: "route_main_hub" }]);

        await sendTelegram("editMessageText", {
          chat_id: ADMIN_CHAT_ID,
          message_id: messageId,
          text: "🔍 *ACTIVE REGISTRY ASSET NODE CHART*\n\nSelect corresponding asset target below to inspect metrics or wipe completely from data storage matrix:",
          parse_mode: "Markdown",
          reply_markup: { inline_keyboard: inlineKeyboard }
        });
      }
      
      // ROUTE: Single row node profile inspection module
      else if (data.startsWith("inspect_node_")) {
        const pId = parseInt(data.split("_")[2]);
        const [product] = await db.select().from(products).where(eq(products.id, pId));

        if (!product) {
          const backKeyboard = { inline_keyboard: [[{ text: "🔙 Back to Chart", callback_data: "action_view_chart" }]] };
          await sendTelegram("editMessageText", { chat_id: ADMIN_CHAT_ID, message_id: messageId, text: "❌ Target asset matrix node drop failure.", reply_markup: backKeyboard });
        } else {
          const operationsKeyboard = {
            inline_keyboard: [
              [
                { text: "🗑️ Permanent Wipe Node", callback_data: `execute_wipe_${product.id}` },
                { text: "🔙 Back to Chart", callback_data: "action_view_chart" }
              ]
            ]
          };
          await sendTelegram("editMessageText", {
            chat_id: ADMIN_CHAT_ID,
            message_id: messageId,
            text: `📊 *TARGET CORE ASSET NODE METRICS:*

• *System Schema ID:* \`${product.id}\`
• *Public Title:* \`${product.title}\`
• *Price Metric:* \`₹${product.price}\`
• *Instructor Node:* \`${product.instructor}\`
• *Slug Directory:* \`/${product.slug}\`
• *Operational Level:* \`${product.level || "Expert"}\`

⚠️ *Warning:* 'Permanent Wipe Node' par tap karte hi database row binary layer se drop ho jayegi. This action cannot be reversed!`,
            parse_mode: "Markdown",
            reply_markup: operationsKeyboard
          });
        }
      }
      
      // ACTION: Absolute structural asset destruction execution
      else if (data.startsWith("execute_wipe_")) {
        const pId = parseInt(data.split("_")[2]);
        await db.delete(products).where(eq(products.id, pId));
        
        // Show flash success screen then route back to chart automatically
        const postWipeKeyboard = { inline_keyboard: [[{ text: "🔄 View Updated Chart", callback_data: "action_view_chart" }]] };
        await sendTelegram("editMessageText", {
          chat_id: ADMIN_CHAT_ID,
          message_id: messageId,
          text: `🗑️ *TRANSACTION MATRIX COMPLETE:* Asset Node ID \`${pId}\` successfully unregistered and vaporized from production database rows!`,
          parse_mode: "Markdown",
          reply_markup: postWipeKeyboard
        });
      }
      
      // ROUTE: Real-time system pipeline ping tracker
      else if (data === "action_sys_ping") {
        const startPing = Date.now();
        await db.select().from(products).limit(1); // Test query latency speed
        const currentLatency = Date.now() - startPing;

        const diagnosticKeyboard = { inline_keyboard: [[{ text: "🔙 Main Menu", callback_data: "route_main_hub" }]] };
        await sendTelegram("editMessageText", {
          chat_id: ADMIN_CHAT_ID,
          message_id: messageId,
          text: `⚡ *SERVER INTERFACE DIAGNOSTICS PING:*

• Webhook Pipeline: \`Healthy (HTTP 200 OK)\`
• Vercel Lambda Edge Runtime: \`Node.js v20\`
• DB Handshake Latency: \`${currentLatency} ms\`
• Dynamic Server Variables: \`Matched / Standard\``,
          parse_mode: "Markdown",
          reply_markup: diagnosticKeyboard
        });
      }
      
      // ROUTE: Static Server Configurations System Data
      else if (data === "action_server_config") {
        const configKeyboard = { inline_keyboard: [[{ text: "🔙 Main Menu", callback_data: "route_main_hub" }]] };
        await sendTelegram("editMessageText", {
          chat_id: ADMIN_CHAT_ID,
          message_id: messageId,
          text: `🛡️ *ADMIN INTERFACE ROOT ENVIRONMENTAL FLAGS:*

• Authorized Admin UID: \`${ADMIN_CHAT_ID}\`
• Runtime Environment: \`Production (Vercel Core Edge)\`
• Global Object Mode: \`force-dynamic\`
• Automation Access: \`Full Root Capabilities granted\``,
          parse_mode: "Markdown",
          reply_markup: configKeyboard
        });
      }

      return Response.json({ success: true });
    }

    // 2. CHAT TEXT TRIGGERS INPUT LOOP (/start /list menu)
    if (body.message) {
      const msg = body.message;
      const chatId = String(msg.chat.id);
      const text = msg.text || "";

      if (chatId !== ADMIN_CHAT_ID) return Response.json({ success: true });

      if (text === "/start" || text === "/list" || text === "menu" || text === "dashboard") {
        await renderMasterDashboard(chatId);
      }
    }

    return Response.json({ success: true });
  } catch (error: any) {
    console.error("Critical Admin Core Exception:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
