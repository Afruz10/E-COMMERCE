import { db } from "@/db";
import { products, coupons } from "@/db/schema";
import { eq } from "drizzle-orm";

const BOT_TOKEN = "8911554064:AAH4QUzD2aWDn3dHBjeaf3pLCAJnND-Csnw";
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Utility function to send direct Telegram messages with custom inline keyboards
async function sendTelegramKeyboard(chatId, text, replyMarkup) {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "Markdown",
      reply_markup: replyMarkup
    }),
  });
}

// Main Telegram Webhook Handler
export async function POST(req) {
  try {
    const update = await req.json();

    // 1. Handle Command Messages (e.g. /admin)
    if (update.message && update.message.text === "/admin") {
      const chatId = update.message.chat.id;
      
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

    // 2. Handle Button Clicks (Callback Queries)
    if (update.callback_query) {
      const callbackQuery = update.callback_query;
      const chatId = callbackQuery.message.chat.id;
      const data = callbackQuery.data;

      // BOX 1: Manage Courses Clicked
      if (data === "manage_courses") {
        const allProducts = await db.select().from(products);
        
        const inline_keyboard = [];
        
        // Dynamic List Layout with [Delete] and [Edit Name Click] logic
        allProducts.forEach((product) => {
          inline_keyboard.push([
            { text: `✏️ ${product.title} (₹${product.price})`, callback_data: `edit_course_${product.id}` },
            { text: "❌ Delete", callback_data: `delete_course_${product.id}` }
          ]);
        });

        // Add Course button at the bottom
        inline_keyboard.push([{ text: "➕ Add Course", callback_data: "add_course_flow" }]);
        // Back button
        inline_keyboard.push([{ text: "← Back to Master Vault", callback_data: "back_to_main" }]);

        await sendTelegramKeyboard(
          chatId,
          "📂 *Active Box: Course Management*\n\nClick on any course title to *Edit/Change* details or click delete:",
          { inline_keyboard }
        );
      }

      // BOX 2: Manage Coupons Clicked
      if (data === "manage_coupons") {
        const allCoupons = await db.select().from(coupons);
        
        const inline_keyboard = [];

        allCoupons.forEach((coupon) => {
          inline_keyboard.push([
            { text: `✏️ ${coupon.code} (${coupon.discountPercent}% OFF)`, callback_data: `edit_coupon_${coupon.id}` },
            { text: "❌ Delete", callback_data: `delete_coupon_${coupon.id}` }
          ]);
        });

        // Add Coupon button
        inline_keyboard.push([{ text: "➕ Add Coupon", callback_data: "add_coupon_flow" }]);
        inline_keyboard.push([{ text: "← Back to Master Vault", callback_data: "back_to_main" }]);

        await sendTelegramKeyboard(
          chatId,
          "📂 *Active Box: Coupon Management*\n\nClick on any coupon code to *Edit/Change* properties or click delete:",
          { inline_keyboard }
        );
      }

      // Action: BACK TO MAIN VAULT
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

      // Action: DELETE COURSE TRIGGER
      if (data.startsWith("delete_course_")) {
        const courseId = parseInt(data.replace("delete_course_", ""));
        await db.delete(products).where(eq(products.id, courseId));

        await sendTelegramKeyboard(
          chatId,
          "✅ Course has been permanently deleted from the database!",
          { inline_keyboard: [[{ text: "← Back to Courses", callback_data: "manage_courses" }]] }
        );
      }

      // Action: DELETE COUPON TRIGGER
      if (data.startsWith("delete_coupon_")) {
        const couponId = parseInt(data.replace("delete_coupon_", ""));
        await db.delete(coupons).where(eq(coupons.id, couponId));

        await sendTelegramKeyboard(
          chatId,
          "✅ Coupon has been permanently deactivated and deleted!",
          { inline_keyboard: [[{ text: "← Back to Coupons", callback_data: "manage_coupons" }]] }
        );
      }

      // 🔄 Action triggers for adding/editing flows (Instructing User)
      if (data === "add_course_flow") {
        await sendTelegramKeyboard(
          chatId,
          "📝 *Add Course Instruction:*\nTo add a course, send the details in this format:\n\n`addcourse [title] | [price] | [slug]`\n\n*Example:* `addcourse NextJS Pro | 299 | nextjs-pro`"
        );
      }

      if (data === "add_coupon_flow") {
        await sendTelegramKeyboard(
          chatId,
          "📝 *Add Coupon Instruction:*\nTo add a coupon, send details in this format:\n\n`addcoupon [code] | [discount%] | [optional_course_id]`\n\n*Example:* `addcoupon ZARA30 | 30` or `addcoupon ZARA30 | 30 | 1`"
        );
      }

      if (data.startsWith("edit_course_")) {
        const courseId = data.replace("edit_course_", "");
        await sendTelegramKeyboard(
          chatId,
          `📝 *Edit Course Instruction:*\nTo change details for Course ID: *${courseId}*, send text like this:\n\n\`editcourse ${courseId} | [new_title] | [new_price]\``
        );
      }

      if (data.startsWith("edit_coupon_")) {
        const couponId = data.replace("edit_coupon_", "");
        await sendTelegramKeyboard(
          chatId,
          `📝 *Edit Coupon Instruction:*\nTo change details for Coupon ID: *${couponId}*, send text like this:\n\n\`editcoupon ${couponId} | [new_code] | [new_discount%]\``
        );
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Telegram bot error:", error);
    return Response.json({ error: "Pipeline failed" }, { status: 500 });
  }
}
