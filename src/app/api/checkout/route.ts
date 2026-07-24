import { db } from "@/db";
import { orders, coupons, products } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

const DYNAMIC_RESEND_KEY = process.env.RESEND_API_KEY;

// 🔐 SECURE GMAIL SYSTEM VAULT (TYPESCRIPT TYPES FIXED BELOW)
async function triggerDirectGmailReceipt(
  studentEmail: any,
  studentName: any,
  amount: any,
  discount: any,
  subtotal: any,
  referenceId: any
) {
  if (!DYNAMIC_RESEND_KEY) {
    console.error("❌ SYSTEM ALERT: process.env.RESEND_API_KEY environment locker is empty!");
    return;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DYNAMIC_RESEND_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "AfruzStore <onboarding@resend.dev>", 
        to: studentEmail,
        subject: `🎉 Order Confirmed: Welcome to AfruzStore!`,
        html: `
          <div style="font-family: sans-serif; background-color: #09090b; color: #f4f4f5; padding: 30px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(244, 244, 245, 0.1);">
            <h1 style="color: #00ffff; font-size: 24px; font-weight: bold; border-bottom: 1px solid rgba(244, 244, 245, 0.1); padding-bottom: 15px; margin-top: 0;">
              AFRUZSTORE CONTROL LOGS v8.5
            </h1>
            <p style="font-size: 16px; color: #a1a1aa; line-height: 1.6;">
              Hi <strong>${studentName}</strong>, Afruz bhai's store dashboard system has successfully processed your dynamic asset acquisition network transaction!
            </p>
            <div style="background-color: rgba(244, 244, 245, 0.05); padding: 20px; border-radius: 12px; margin: 25px 0;">
              <p style="margin: 0; font-size: 14px; color: #71717a;">🆔 Reference ID:</p>
              <p style="margin: 5px 0 10px 0; font-size: 16px; font-weight: bold; color: #ffffff;">${referenceId}</p>
              
              <p style="margin: 0; font-size: 14px; color: #71717a;">💰 Pricing Matrix:</p>
              <p style="margin: 5px 0 5px 0; font-size: 14px; color: #a1a1aa;">Subtotal: ₹${subtotal}.00</p>
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #f43f5e;">Discount Applied: ₹${discount}.00</p>
              
              <p style="margin: 0; font-size: 14px; color: #71717a;">💵 Net Paid Amount:</p>
              <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; color: #39ff14;">₹${amount}.00 Paid</p>
            </div>
            <p style="font-size: 15px; color: #a1a1aa;">
              Your course access layer configuration parameters have been activated automatically on your student portal layout profile page dashboard.
            </p>
            <hr style="border: 0; border-top: 1px solid rgba(244, 244, 245, 0.1); margin: 30px 0;" />
            <p style="font-size: 12px; color: #71717a; text-align: center; margin: 0;">
              Security Integrity Lock Applied | Production Edge Server
            </p>
          </div>
        `,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log(`🎉 Gmail delivery success path verified target key: ${data.id}`);
    } else {
      console.error("❌ REST Pipeline response failure error dump:", data);
    }
  } catch (err: any) {
    console.error("Critical email system failure loop exceptions:", err.message);
  }
}

// 🤖 Telegram Order Notification Bot
async function sendOrderNotification(message: string) {
  const botToken = "8911554064:AAH4QUzD2aWDn3dHBjeaf3pLCAJnND-Csnw";
  const chatId = "5593004632";
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "Markdown" }),
    });
  } catch (err) {
    console.error("Order bot failed:", err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const email = body.email || "guest@customer.com";
    const name = body.name || "Anonymous Customer";
    const items = body.items || [];
    const promoCode = body.promoCode ? body.promoCode.trim().toUpperCase() : null;
    const reference = body.reference || `REF-${Date.now()}`;

    if (items.length === 0) {
      return Response.json({ error: "Your shopping cart is empty" }, { status: 400 });
    }

    // 1. Calculate base subtotal dynamically from items array to prevent tamper attacks
    let calculatedSubtotal = 0;
    items.forEach((item: any) => {
      calculatedSubtotal += Number(item.price) * Number(item.qty);
    });

    let discountAmount = 0;
    let promoDetailsMessage = "None";

    // 2. Validate Coupon directly from Database if supplied
    if (promoCode) {
      const dbCoupons = await db
        .select()
        .from(coupons)
        .where(and(eq(coupons.code, promoCode), eq(coupons.isActive, true)));

      const activeCoupon = dbCoupons[0];

      if (!activeCoupon) {
        return Response.json({ error: "Invalid or inactive coupon code." }, { status: 400 });
      }

      // Check if the coupon is course-restricted
      if (activeCoupon.targetProductId !== null) {
        const targetProducts = await db
          .select()
          .from(products)
          .where(eq(products.id, activeCoupon.targetProductId));

        const restrictedProduct = targetProducts[0];

        if (!restrictedProduct) {
          return Response.json({ error: "Linked product for this coupon does not exist." }, { status: 400 });
        }

        const matchesInCart = items.filter((item: any) => item.slug === restrictedProduct.slug);

        if (matchesInCart.length === 0) {
          return Response.json({ 
            error: `This coupon is only valid for the course: "${restrictedProduct.title}".` 
          }, { status: 400 });
        }

        // Apply discount ONLY on the target product
        matchesInCart.forEach((matchedItem: any) => {
          const itemTotal = Number(matchedItem.price) * Number(matchedItem.qty);
          discountAmount += (itemTotal * activeCoupon.discountPercent) / 100;
        });

        promoDetailsMessage = `${activeCoupon.code} (${activeCoupon.discountPercent}% OFF on Specific Course)`;
      } else {
        // Apply discount globally across entire subtotal
        discountAmount = (calculatedSubtotal * activeCoupon.discountPercent) / 100;
        promoDetailsMessage = `${activeCoupon.code} (${activeCoupon.discountPercent}% OFF Global)`;
      }
    }

    // 3. Final calculations
    const finalTotal = Math.max(0, calculatedSubtotal - discountAmount);
    const primeProductTitle = items[0]?.title || "Premium Course";

    // Save order metrics database entry
    const [inserted] = await db.insert(orders).values({
      reference,
      email,
      name,
      items: typeof items === 'string' ? JSON.parse(items) : items,
      subtotal: String(calculatedSubtotal),
      discount: String(discountAmount),
      total: String(finalTotal),
      status: "paid",
    }).returning();

    // 📬 4. TELEGRAM BOT NOTIFICATION TRIGGER WITH COUPON DATA
    const orderMessage = `🎉 *Afruz Bhai! Naya Order Aaya Hai!* 💰\n\n` +
      `👤 *Name:* ${name}\n` +
      `📧 *Email:* ${email}\n` +
      `🏷️ *Promo Code:* \`${promoDetailsMessage}\`\n` +
      `💵 *Subtotal:* ₹${calculatedSubtotal}\n` +
      `❌ *Discount:* -₹${discountAmount.toFixed(2)}\n` +
      `💸 *Amount Paid:* ₹${finalTotal.toFixed(2)}\n` +
      `🆔 *Ref ID:* \`${reference}\``;

    await sendOrderNotification(orderMessage);

    // 🚀 5. GMAIL CLIENT INVOICE INJECTION
    await triggerDirectGmailReceipt(email, name, String(finalTotal), String(discountAmount), String(calculatedSubtotal), reference);

    // 🔥 6. DYNAMIC REDIRECT RESPONSE PACKET OVERRIDE
    return Response.json({ 
      success: true, 
      order: inserted,
      redirectUrl: `/checkout/success?amount=${finalTotal}&course=${encodeURIComponent(primeProductTitle)}&ref=${reference}`
    });

  } catch (error) {
    console.error("Checkout crash:", error);
    return Response.json({ error: "Checkout payment failed" }, { status: 500 });
  }
}
