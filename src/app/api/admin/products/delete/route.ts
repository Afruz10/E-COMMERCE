import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return Response.json({ success: false, error: "Product ID missing" }, { status: 400 });

    // Database se product record complete wipe block execute karein
    await db.delete(products).where(eq(products.id, id));

    return Response.json({ success: true, message: "Asset deleted from registry." });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
