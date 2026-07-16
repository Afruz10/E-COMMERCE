import { db } from "@/db";
import { products, coupons } from "@/db/schema";
import { eq } from "drizzle-orm";

const BOT_TOKEN = "8911554064:AAH4QUzD2aWDn3dHBjeaf3pLCAJnND-Csnw";
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Utility function to fire direct Telegram messages with custom inline markups
async function sendTelegramKeyboard(chatId, text, replyMarkup = null) {
  const payload = {
    chat_id: chatId,
    text: text,
    parse_mode: "Markdown",
  };
  if (replyMarkup) {
    payload.reply_markup = replyMarkup;
  }
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function POST(req) {
  try {
    const update = await req.json();

    // 📡 LAYER 1: PROCESSING REGULAR INCOMING CHAT TEXT MESSAGES
    if (update.message && update.message.text) {
      const chatId = update.message.chat.id;
      const userText = update.message.text.trim();

      // Command handler for /admin root control entry point
      if (userText === "/admin") {
        const adminKeyboard = {
          inline_keyboard: [
            [
              { text: "📚 Course", callback_data: "manage_courses" },
              { text: "🎟️ Coupon", callback_data: "manage_coupons" }
            ]
          ]
        };
        await sendTelegramKeyboard(
          chatId,
          "⚡ *Welcome to AfruzStore Master Vault* ⚡\n\nClick any section box below to access active database management controls directly:",
          adminKeyboard
        );
        return Response.json({ success: true });
      }

      // ➕ TEXT PARSER FOR CREATING A NEW COURSE Node
      // Format: addcourse Title | Price | Badge
      if (userText.toLowerCase().startsWith("addcourse")) {
        const dataString = userText.substring(9).trim();
        const parts = dataString.split("|").map(p => p.trim());
        
        if (parts.length < 2) {
          await sendTelegramKeyboard(chatId, "❌ *Format Error!* Please use:\n`addcourse Title | Price | Optional Badge`\n\n*Example:* `addcourse Node JS Mastery | 299 | Hot`");
          return Response.json({ success: true });
        }

        const title = parts[0];
        const price = parts[1];
        const badge = parts[2] || null;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

        // Basic engineering defaults injected automatically
        await db.insert(products).values({
          slug,
          title,
          subtitle: "Premium course unlocked via control terminal.",
          description: "Full master content loaded dynamically.",
          categorySlug: "token-mastery",
          level: "Beginner",
          price: String(price),
          durationHours: "12.5",
          lessons: 24,
          rating: "4.80",
          reviewCount: 15,
          badge: badge,
          instructor: "Afruz Bhai",
          instructorTitle: "Senior Architect",
          accent: "#8B5CF6",
          glyph: "🚀",
          highlights: [],
          curriculum: [],
          outcomes: []
        });

        await sendTelegramKeyboard(chatId, `✅ *Success!* Course \ "${title}\" has been added to the web matrix.\nPrice: ₹${price}`, {
          inline_keyboard: [[{ text: "← Back to Courses", callback_data: "manage_courses" }]]
        });
        return Response.json({ success: true });
      }

      // ➕ TEXT PARSER FOR CREATING A NEW COUPON Code Node
      // Format: addcoupon CODE | DISCOUNT% | TARGET_COURSE_ID
      if (userText.toLowerCase().startsWith("addcoupon")) {
        const dataString = userText.substring(9).trim();
        const parts = dataString.split("|").map(p => p.trim());

        if (parts.length < 2) {
          await sendTelegramKeyboard(chatId, "❌ *Format Error!* Please use:\n`addcoupon CODE | Discount% | Optional Course ID`\n\n*Example:* `addcoupon AIFRUZ50 | 50` or `addcoupon COMP20 | 20 | 4`");
          return Response.json({ success: true });
        }

        const code = parts[0].toUpperCase();
        const discountPercent = parseInt(parts[1]);
        const targetCourseId = parts[2] ? parseInt(parts[2]) : null;

        await db.insert(coupons).values({
          code,
          discountPercent,
          targetProductId: targetCourseId,
          isActive: true
        });

        await sendTelegramKeyboard(chatId, `✅ *Success!* Coupon code \`${code}\` (${discountPercent}% OFF) deployed actively.`, {
          inline_keyboard: [[{ text: "← Back to Coupons", callback_data: "manage_coupons" }]]
        });
        return Response.json({ success: true });
      }

      // ⚙️ TEXT PARSER FOR EDITING EXISTING COURSE DETAILS
      // Format: editcourse ID | New Title | New Price
      if (userText.toLowerCase().startsWith("editcourse")) {
        const dataString = userText.substring(10).trim();
        const parts = dataString.split("|").map(p => p.trim());

        if (parts.length < 3) {
          await sendTelegramKeyboard(chatId, "❌ *Format Error!* Please use:\n`editcourse ID | New Title | New Price`\n\n*Example:* `editcourse 2 | AI Mastery Pro | 349`");
          return Response.json({ success: true });
        }

        const id = parseInt(parts[0]);
        const newTitle = parts[1];
        const newPrice = parts[2];

        await db.update(products)
          .set({ title: newTitle, price: String(newPrice) })
          .where(eq(products.id, id));

        await sendTelegramKeyboard(chatId, `⚙️ *Success!* Course ID *${id}* configuration updated correctly.`, {
          inline_keyboard: [[{ text: "← Back to Courses", callback_data: "manage_courses" }]]
        });
        return Response.json({ success: true });
      }

      // ⚙️ TEXT PARSER FOR EDITING EXISTING COUPONS
      // Format: editcoupon ID | New Code | New Discount
      if (userText.toLowerCase().startsWith("editcoupon")) {
        const dataString = userText.substring(10).trim();
        const parts = dataString.split("|").map(p => p.trim());

        if (parts.length < 3) {
          await sendTelegramKeyboard(chatId, "❌ *Format Error!* Please use:\n`editcoupon ID | New Code | New Discount%`\n\n*Example:* `editcoupon 1 | ZARAFIT25 | 25`");
          return Response.json({ success: true });
        }

        const id = parseInt(parts[0]);
        const newCode = parts[1].toUpperCase();
        const newDiscount = parseInt(parts[2]);

        await db.update(coupons)
          .set({ code: newCode, discountPercent: newDiscount })
          .where(eq(coupons.id, id));

        await sendTelegramKeyboard(chatId, `⚙️ *Success!* Coupon ID *${id}* has been updated successfully.`, {
          inline_keyboard: [[{ text: "← Back to Coupons", callback_data: "manage_coupons" }]]
        });
        return Response.json({ success: true });
      }
    }

    // 📡 LAYER 2: INTERACTIVE BUTTON CALLBACK QUERY EVENTS
    if (update.callback_query) {
      const callbackQuery = update.callback_query;
      const chatId = callbackQuery.message.chat.id;
      const data = callbackQuery.data;

      // BOX 1 TRIGGER: Manage Course Selection Open
      if (data === "manage_courses") {
        const allProducts = await db.select().from(products);
        const inline_keyboard = [];

        allProducts.forEach((product) => {
          inline_keyboard.push([
            { text: `✏️ ${product.title} (₹${product.price})`, callback_data: `edit_course_${product.id}` },
            { text: "❌ Delete", callback_data: `delete_course_${product.id}` }
          ]);
        });

        inline_keyboard.push([{ text: "➕ Add Course Menu", callback_data: "add_course_flow" }]);
        inline_keyboard.push([{ text: "← Back to Master Vault", callback_data: "back_to_main" }]);

        await sendTelegramKeyboard(
          chatId,
          "📂 *Active Box: Course Management*\n\nClick on any course title text element below to display its *Edit/Change* command setup, or hit delete directly:",
          { inline_keyboard }
        );
      }

      // BOX 2 TRIGGER: Manage Coupon Selection Open
      if (data === "manage_coupons") {
        const allCoupons = await db.select().from(coupons);
        const inline_keyboard = [];

        allCoupons.forEach((coupon) => {
          inline_keyboard.push([
            { text: `✏️ ${coupon.code} (${coupon.discountPercent}% OFF)`, callback_data: `edit_coupon_${coupon.id}` },
            { text: "❌ Delete", callback_data: `delete_coupon_${coupon.id}` }
          ]);
        });

        inline_keyboard.push([{ text: "➕ Add Coupon Menu", callback_data: "add_coupon_flow" }]);
        inline_keyboard.push([{ text: "← Back to Master Vault", callback_data: "back_to_main" }]);

        await sendTelegramKeyboard(
          chatId,
          "📂 *Active Box: Coupon Management*\n\nClick on any active item to view its *Edit/Change* parameters or delete it instantly:",
          { inline_keyboard }
        );
      }

      // Action: NAVIGATION ROUTER BACK TO HOME BASE ROOT BOXES
      if (data === "back_to_main") {
        const adminKeyboard = {
          inline_keyboard: [
            [
              { text: "📚 Course", callback_data: "manage_courses" },
              { text: "🎟️ Coupon", callback_data: "manage_coupons" }
            ]
          ]
        };
        await sendTelegramKeyboard(
          chatId,
          "⚡ *Welcome to AfruzStore Master Vault* ⚡\n\nClick any section box below to access active database management controls directly:",
          adminKeyboard
        );
      }

      // Action: SYSTEM DELETE EXECUTION FOR COURSE ENTITY
      if (data.startsWith("delete_course_")) {
        const courseId = parseInt(data.replace("delete_course_", ""));
        await db.delete(products).where(eq(products.id, courseId));

        await sendTelegramKeyboard(
          chatId,
          "🗑️ *Deleted!* Course dropped out of storage blocks.",
          { inline_keyboard: [[{ text: "← Back to Courses", callback_data: "manage_courses" }]] }
        );
      }

      // Action: SYSTEM DELETE EXECUTION FOR COUPON DATA NODE
      if (data.startsWith("delete_coupon_")) {
        const couponId = parseInt(data.replace("delete_coupon_", ""));
        await db.delete(coupons).where(eq(coupons.id, couponId));

        await sendTelegramKeyboard(
          chatId,
          "🗑️ *Deleted!* Promo coupon entity terminated safely.",
          { inline_keyboard: [[{ text: "← Back to Coupons", callback_data: "manage_coupons" }]] }
        );
      }

      // Instructions Output triggers for Adding Operations
      if (data === "add_course_flow") {
        await sendTelegramKeyboard(
          chatId,
          "📝 *Instruction to Add Course:*\nCopy the text below, fill in your details, and send it here in this exact format:\n\n`addcourse Complete AI Course | 499 | New`"
        );
      }

      if (data === "add_coupon_flow") {
        await sendTelegramKeyboard(
          chatId,
          "📝 *Instruction to Add Coupon:*\nCopy the text below, change values, and send it here in this format:\n\n`addcoupon NEWFRUZ50 | 50` \n\n_(To restrict it to a specific course, add its ID at the end: `addcoupon NEWFRUZ50 | 50 | 2` )_"
        );
      }

      if (data.startsWith("edit_course_")) {
        const courseId = data.replace("edit_course_", "");
        await sendTelegramKeyboard(
          chatId,
          `📝 *Instruction to Edit Course (ID: ${courseId}):*\nCopy the line below, alter the values, and send it back to modify details:\n\n\`editcourse ${courseId} | Upgraded Course Title | 399\``
        );
      }

      if (data.startsWith("edit_coupon_")) {
        const couponId = data.replace("edit_coupon_", "");
        await sendTelegramKeyboard(
          chatId,
          `📝 *Instruction to Edit Coupon (ID: ${couponId}):*\nCopy the line below, update variables, and reply to make changes:\n\n\`editcoupon ${couponId} | AIFRUZ80 | 80\``
        );
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Telegram endpoint processing crash:", error);
    return Response.json({ error: "Pipeline exception caught" }, { status: 500 });
  }
}
