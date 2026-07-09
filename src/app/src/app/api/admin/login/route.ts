export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    // 🔒 Tumhara permanent User ID aur Password (Ise badal sakte ho)
    const ADMIN_USERNAME = "afruz_admin";
    const ADMIN_PASSWORD = "AfruzStore@2026";

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      return Response.json({ 
        success: true, 
        message: "Welcome back, Afruz Bhai! 😎" 
      });
    } else {
      return Response.json({ 
        success: false, 
        error: "Galat Password ya ID hai! ❌" 
      }, { status: 401 });
    }
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
