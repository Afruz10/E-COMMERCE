import { db } from "@/db";
import { products } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Latest products ko sabse upar laane ke liye desc() use kiya hai
    const allProducts = await db.select().from(products).orderBy(desc(products.id));
    
    return Response.json({ success: true, products: allProducts });
  } catch (error: any) {
    console.error("Fetch failed:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
