import { db } from "@/db";
import { orders } from "@/db/schema";

export const dynamic = "force-dynamic";

// 🔐 SECURE GMAIL SYSTEM VAULT (Bina kisi install ke dynamic REST Fetch API)
const DYNAMIC_RESEND_KEY = process.env.RESEND_API_KEY;

async function triggerDirectGmailReceipt(studentEmail: string, studentName: string, amount: string, referenceId: string) {
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
        from: "AfruzStore <onboarding@resend.dev>", // Custom domain domain verify hone ke baad change kar sakte ho
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
              <p style="margin: 5px 0 15px 0; font-size: 16px; font-weight: bold; color: #ffffff;">${referenceId}</p>
              
              <p style="margin: 0; font-size: 14px; color: #71717a;">💵 Transaction Asset Metric:</p>
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
    
    // 🛠️ Fallback/Default values agar front-end se data miss ho jaye
    const email = body.email || "guest@customer.com";
    const name = body.name || "Anonymous Customer";
    const items = body.items || [{ title: "AI Course", qty: 1 }];
    const total = body.total || "99";
    const reference = body.reference || `REF-${Date.now()}`; // Automatic unique ID generated

    // Database me order save ho raha hai
    const [inserted] = await db.insert(orders).values({
      reference,
      email,
      name,
      items: typeof items === 'string' ? JSON.parse(items) : items,
      subtotal: String(total),
      total: String(total),
      status: "paid",
    }).returning();

    // 🔥 1. INSTANT TELEGRAM ALERT FOR ORDER!
    const orderMessage = `🎉 *Afruz Bhai! Naya Order Aaya Hai!* 💰\n\n` +
      `👤 *Name:* ${name}\n` +
      `📧 *Email:* ${email}\n` +
      `💵 *Amount Paid:* ₹${total}\n` +
      `🆔 *Ref ID:* \`${reference}\``;

    await sendOrderNotification(orderMessage);

    // 🚀 2. AUTOMATED EMAIL DISPATCH TO CUSTOMER!
    // Database and Telegram confirmation ke turant baad user ko receipt chali jayegi
    await triggerDirectGmailReceipt(email, name, String(total), reference);

    return Response.json({ success: true, order: inserted });
  } catch (error) {
    console.error("Checkout crash:", error);
    return Response.json({ error: "Checkout payment failed" }, { status: 500 });
  }
}
