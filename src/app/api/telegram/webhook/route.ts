import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

// 🔐 FULL AUTONOMOUS MASTER VAULT
const BOT_TOKEN = "8911554064:AAH4QUzD2aWDn3dHBjeaf3pLCAJnND-Csnw";
const ADMIN_CHAT_ID = "5593004632"; // Strictly Bound to Afruz Profile

// Simulated App States (In production, link these to a 'settings' table)
let isMaintenanceActive = false;
let globalHexTheme = "#00FFFF (Neon Cyan)";
let telemetryViews = 2450;
let telemetryClicks = 480;

// Dynamic In-Memory Storage for Coupons (Simulated Layer)
let dynamicCoupons = [
  { code: "AFRUZ10", discount: "10%" },
  { code: "FREEFIRE20", discount: "20%" }
];

// Helper: Telegram API POST Router
async function sendTelegram(method: string, payload: any) {
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Core Terminal Link Exception:", err);
  }
}

// 🎛️ CENTRAL OPERATIONAL HUB INTERFACE
async function renderMasterDashboard(chatId: string, messageId?: number) {
  const allProducts = await db.select().from(products);
  const totalCourses = allProducts.length;
  const grossCapital = allProducts.reduce((sum, p) => sum + (parseInt(p.price) || 0), 0);

  const text = `⚙️ *AFRUZ ULTIMATE WEB CONTROL CENTER v8.0*

*🌐 GLOBAL FRONTEND GATEWAY:*
• Server State: ${isMaintenanceActive ? "🛑 `MAINTENANCE ACTIVE`" : "🟢 `LIVE / OPERATIONAL`"}
• App UI Theme : \`${globalHexTheme}\`
• Active Rows : \`${totalCourses} Products Live\` | \`₹${grossCapital} Capital\`
• Coupon Count: \`${dynamicCoupons.length} Syncing Nodes\`

*✍️ DIRECT TEXT SHORTCUT COMMANDS:*
• Add Course : Send \`/add_course Title | Price | Instructor\`
• Update Price: Send \`/edit_price CourseID | NewPrice\`
• Add Coupon : Send \`/add_coupon CODE | Discount%\`

Select administrative action protocol matrix below:`;

  const controlMatrixKeyboard = {
    inline_keyboard: [
      [{ text: "📁 Database Course Manager", callback_data: "matrix_view_chart" }],
      [{ text: "🎫 Coupon Manager (Add/Delete)", callback_data: "matrix_coupons" }],
      [
        { text: "🎨 CSS Color Palette", callback_data: "matrix_theme_hex" },
        { text: isMaintenanceActive ? "🟢 Switch Web LIVE" : "🛑 Trigger Maintenance", callback_data: "matrix_toggle_maint" }
      ],
      [{ text: "⚡ Server Ping Latency", callback_data: "matrix_ping_lat" }]
    ]
  };

  if (messageId) {
    await sendTelegram("editMessageText", { chat_id: chatId, message_id: messageId, text, parse_mode: "Markdown", reply_markup: controlMatrixKeyboard });
  } else {
    await sendTelegram("sendMessage", { chat_id: chatId, text, parse_mode: "Markdown", reply_markup: controlMatrixKeyboard });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. INLINE INTERFACE BUTTONS ROUTING TRACK
    if (body.callback_query) {
      const callback = body.callback_query;
      const fromId = String(callback.from.id);
      const data = callback.data;
      const messageId = callback.message.message_id;

      if (fromId !== ADMIN_CHAT_ID) return Response.json({ success: true });
      await sendTelegram("answerCallbackQuery", { callback_query_id: callback.id });

      const backHomeMarkup = [[{ text: "🔙 Central Command Dashboard", callback_data: "route_dashboard_hub" }]];

      if (data === "route_dashboard_hub") {
        await renderMasterDashboard(ADMIN_CHAT_ID, messageId);
      }
      
      // FEATURE: Dynamic Coupon Manager Dashboard Screen
      else if (data === "matrix_coupons") {
        const couponLines = dynamicCoupons.map((c, i) => `• *${c.code}* (${c.discount} OFF) ➡️ Delete: \`/del_coupon ${c.code}\``).join("\n");
        await sendTelegram("editMessageText", {
          chat_id: ADMIN_CHAT_ID, message_id: messageId,
          text: `🎫 *PROMO COUPON MANAGER GRID:*\n\n${couponLines || "No coupons live."}\n\n➕ *Naya Coupon Add karne ke liye chat me likhein:*\n\`/add_coupon CODE | DISCOUNT\` (e.g. \`/add_coupon NEW50 | 50%\`)`,
          parse_mode: "Markdown", reply_markup: { inline_keyboard: backHomeMarkup }
        });
      }
      
      // FEATURE: CSS Palette Selector Switch
      else if (data === "matrix_theme_hex") {
        const themeKeyboard = [
          [{ text: "🩵 Neon Cyan Theme", callback_data: "set_theme_cyan" }, { text: "💜 Cyber Violet Theme", callback_data: "set_theme_purple" }],
          [{ text: "🔙 Main Menu", callback_data: "route_dashboard_hub" }]
        ];
        await sendTelegram("editMessageText", {
          chat_id: ADMIN_CHAT_ID, message_id: messageId,
          text: `🎨 *FRONTEND COLOR CONTROLLER:*\nCurrent Var: \`${globalHexTheme}\``,
          parse_mode: "Markdown", reply_markup: { inline_keyboard: themeKeyboard }
        });
      }
      else if (data.startsWith("set_theme_")) {
        const color = data.split("_")[2];
        globalHexTheme = color === "cyan" ? "#00FFFF (Neon Cyan)" : "#8B00FF (Cyber Violet)";
        await renderMasterDashboard(ADMIN_CHAT_ID, messageId);
      }
      
      // FEATURE: Maintenance Switcher
      else if (data === "matrix_toggle_maint") {
        isMaintenanceActive = !isMaintenanceActive;
        await renderMasterDashboard(ADMIN_CHAT_ID, messageId);
      }
      
      // FEATURE: Latency Monitor Tester
      else if (data === "matrix_ping_lat") {
        const start = Date.now();
        await db.select().from(products).limit(1);
        const ms = Date.now() - start;
        await sendTelegram("editMessageText", { chat_id: ADMIN_CHAT_ID, message_id: messageId, text: `⚡ *Drizzle Database Velocity:* \`${ms} ms\`\n• Status: \`HTTP 200 OK\``, parse_mode: "Markdown", reply_markup: { inline_keyboard: backHomeMarkup } });
      }
      
      // FEATURE: Course Manager List Tree
      else if (data === "matrix_view_chart") {
        const allProducts = await db.select().from(products).orderBy(desc(products.id));
        if (allProducts.length === 0) {
          await sendTelegram("editMessageText", { chat_id: ADMIN_CHAT_ID, message_id: messageId, text: "📭 Database layers contain empty rows.", parse_mode: "Markdown", reply_markup: { inline_keyboard: backHomeMarkup } });
          return Response.json({ success: true });
        }
        const inlineKeyboard = allProducts.map((p) => [{ text: `📁 ID: ${p.id} - ${p.title} (₹${p.price})`, callback_data: `matrix_wipe_req_${p.id}` }]);
        inlineKeyboard.push([{ text: "🔙 Central Command", callback_data: "route_dashboard_hub" }]);
        await sendTelegram("editMessageText", { chat_id: ADMIN_CHAT_ID, message_id: messageId, text: "🔍 *COURSE TRANSACTION REGISTRY MAP:*\n\nKisi bhi product code element par click karke use permanent database se delete karein:", parse_mode: "Markdown", reply_markup: { inline_keyboard: inlineKeyboard } });
      }
      
      // CONFIRM DELETE INTERCEPT LOOP
      else if (data.startsWith("matrix_wipe_req_")) {
        const pId = parseInt(data.split("_")[3]);
        const [p] = await db.select().from(products).where(eq(products.id, pId));
        if (!p) return Response.json({ success: true });

        const wipeKeyboard = [[{ text: "🗑️ Yes, Wipe out Row", callback_data: `matrix_do_wipe_${p.id}` }, { text: "🔙 Abort", callback_data: "matrix_view_chart" }]];
        await sendTelegram("editMessageText", { chat_id: ADMIN_CHAT_ID, message_id: messageId, text: `⚠️ *DELETION PROTOCOL ALERT:*\n\nTarget Element: \`${p.title}\` (ID: ${p.id})\n\nKya aap such me is course record ko wipeout karna chahte hain?`, parse_mode: "Markdown", reply_markup: { inline_keyboard: wipeKeyboard } });
      }
      else if (data.startsWith("matrix_do_wipe_")) {
        const pId = parseInt(data.split("_")[3]);
        await db.delete(products).where(eq(products.id, pId));
        await renderMasterDashboard(ADMIN_CHAT_ID, messageId);
      }
    }

    // 2. TEXT MESSAGE PROCESSING LOOP (ADD/EDIT VIA PARSING LOGIC)
    if (body.message) {
      const msg = body.message;
      const chatId = String(msg.chat.id);
      const text = msg.text || "";

      if (chatId !== ADMIN_CHAT_ID) return Response.json({ success: true });

      if (text === "/start" || text === "/list" || text === "dashboard" || text === "menu") {
        await renderMasterDashboard(ADMIN_CHAT_ID);
        return Response.json({ success: true });
      }

      // EXECUTING COMMAND: /add_course Title | Price | Instructor
      if (text.startsWith("/add_course")) {
        const params = text.replace("/add_course", "").trim().split("|");
        if (params.length < 2) {
          await sendTelegram("sendMessage", { chat_id: chatId, text: "❌ *Format Error!* Use: \`/add_course Title | Price | Instructor\`" });
          return Response.json({ success: true });
        }
        const title = params[0].trim();
        const price = params[1].trim();
        const instructor = params[2] ? params[2].trim() : "Afruz";
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-3);

        const insertData: any = {
          slug, title, subtitle: "Premium Scripting Course Module", description: "Remote Entry Deployed.",
          categorySlug: "courses", level: "Expert", price, compareAtPrice: String(Number(price) * 2),
          durationHours: "10", lessons: 25, rating: "5.0", reviewCount: 1, instructor, instructorTitle: "Lead Pro",
          accent: "#cyan", glyph: "terminal", highlights: JSON.stringify(["Automated"]), curriculum: JSON.stringify([]), outcomes: JSON.stringify([]), featured: true
        };

        await (db.insert(products).values([insertData]) as any);
        await sendTelegram("sendMessage", { chat_id: chatId, text: `🎉 *Success:* \`${title}\` added to database active matrix!` });
        await renderMasterDashboard(ADMIN_CHAT_ID);
      }

      // EXECUTING COMMAND: /edit_price CourseID | NewPrice
      else if (text.startsWith("/edit_price")) {
        const params = text.replace("/edit_price", "").trim().split("|");
        if (params.length < 2) {
          await sendTelegram("sendMessage", { chat_id: chatId, text: "❌ *Format Error!* Use: \`/edit_price ID | NewPrice\`" });
          return Response.json({ success: true });
        }
        const id = parseInt(params[0].trim());
        const newPrice = params[1].trim();

        await db.update(products).set({ price: newPrice }).where(eq(products.id, id));
        await sendTelegram("sendMessage", { chat_id: chatId, text: `✅ *Success:* Course ID \`${id}\` price updated to ₹${newPrice}!` });
        await renderMasterDashboard(ADMIN_CHAT_ID);
      }

      // EXECUTING COMMAND: /add_coupon CODE | Discount%
      else if (text.startsWith("/add_coupon")) {
        const params = text.replace("/add_coupon", "").trim().split("|");
        const code = params[0].trim().toUpperCase();
        const discount = params[1] ? params[1].trim() : "10%";

        dynamicCoupons.push({ code, discount });
        await sendTelegram("sendMessage", { chat_id: chatId, text: `🎫 *Success:* Coupon Code \`${code}\` (${discount} OFF) added to storage synchronization pipeline!` });
      }

      // EXECUTING COMMAND: /del_coupon CODE
      else if (text.startsWith("/del_coupon")) {
        const targetCode = text.replace("/del_coupon", "").trim().toUpperCase();
        dynamicCoupons = dynamicCoupons.filter(c => c.code !== targetCode);
        await sendTelegram("sendMessage", { chat_id: chatId, text: `🗑️ *Success:* Coupon Code \`${targetCode}\` deleted from storage context!` });
      }
    }

    return Response.json({ success: true });
  } catch (error: any) {
    console.error("Master Control Matrix Exception:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
