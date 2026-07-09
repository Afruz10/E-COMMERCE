import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, title, subtitle, description, price, instructor, imageUrl } = body;

    if (!id) return Response.json({ success: false, error: "Target registry ID missing" }, { status: 400 });

    // Modifying targeted record properties mapping dynamically
    await db.update(products)
      .set({
        title,
        subtitle,
        description,
        price: String(price),
        instructor,
        // Yahan image handler mapping text field column insert query support handle karega
        accent: imageUrl || "#cyan" 
      })
      .where(eq(products.id, id));

    return Response.json({ success: true, message: "Registry updated successfully." });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
