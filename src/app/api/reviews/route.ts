import { db } from "@/db";
import { reviews } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) {
    return Response.json({ error: "slug required" }, { status: 400 });
  }
  const rows = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productSlug, slug));
  return Response.json({ reviews: rows });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productSlug, author, role, rating, title, body: text } = body;

    if (!productSlug || !author?.trim() || !title?.trim() || !text?.trim()) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }
    const r = Math.min(5, Math.max(1, Number(rating) || 5));

    const [inserted] = await db
      .insert(reviews)
      .values({
        productSlug,
        author: String(author).slice(0, 80),
        role: String(role ?? "").slice(0, 80),
        rating: r,
        title: String(title).slice(0, 120),
        body: String(text).slice(0, 1000),
      })
      .returning();

    return Response.json({
      review: { ...inserted, createdAt: inserted.createdAt.toISOString() },
    });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
