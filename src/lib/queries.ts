import { db } from "@/db";
import { categories, products, reviews } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import type { CategoryDTO, ProductDTO, ReviewDTO } from "@/lib/types";

type ProductRow = typeof products.$inferSelect;
type CategoryRow = typeof categories.$inferSelect;
type ReviewRow = typeof reviews.$inferSelect;

function toProduct(p: ProductRow): ProductDTO {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle,
    description: p.description,
    categorySlug: p.categorySlug,
    level: p.level,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice === null ? null : Number(p.compareAtPrice),
    durationHours: Number(p.durationHours),
    lessons: p.lessons,
    rating: Number(p.rating),
    reviewCount: p.reviewCount,
    badge: p.badge,
    instructor: p.instructor,
    instructorTitle: p.instructorTitle,
    accent: p.accent,
    glyph: p.glyph,
    highlights: p.highlights,
    curriculum: p.curriculum,
    outcomes: p.outcomes,
    featured: p.featured,
    enrolled: p.enrolled,
  };
}

function toCategory(c: CategoryRow): CategoryDTO {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    tagline: c.tagline,
    description: c.description,
    accent: c.accent,
    glyph: c.glyph,
  };
}

function toReview(r: ReviewRow): ReviewDTO {
  return {
    id: r.id,
    productSlug: r.productSlug,
    author: r.author,
    role: r.role,
    rating: r.rating,
    title: r.title,
    body: r.body,
    createdAt: r.createdAt.toISOString(),
  };
}

export async function getAllProducts(): Promise<ProductDTO[]> {
  const rows = await db.select().from(products).orderBy(desc(products.featured));
  return rows.map(toProduct);
}

export async function getFeaturedProducts(): Promise<ProductDTO[]> {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.featured, true));
  return rows.map(toProduct);
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductDTO | null> {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);
  return rows[0] ? toProduct(rows[0]) : null;
}

export async function getCategories(): Promise<CategoryDTO[]> {
  const rows = await db.select().from(categories).orderBy(categories.id);
  return rows.map(toCategory);
}

export async function getReviewsForProduct(
  slug: string,
): Promise<ReviewDTO[]> {
  const rows = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productSlug, slug))
    .orderBy(desc(reviews.createdAt));
  return rows.map(toReview);
}

export async function getRelatedProducts(
  categorySlug: string,
  excludeSlug: string,
): Promise<ProductDTO[]> {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.categorySlug, categorySlug));
  return rows
    .filter((r) => r.slug !== excludeSlug)
    .map(toProduct)
    .slice(0, 3);
}
