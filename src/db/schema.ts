import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  numeric,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  accent: text("accent").notNull(),
  glyph: text("glyph").notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  description: text("description").notNull(),
  categorySlug: text("category_slug").notNull(),
  level: text("level").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: numeric("compare_at_price", { precision: 10, scale: 2 }),
  durationHours: numeric("duration_hours", { precision: 5, scale: 1 }).notNull(),
  lessons: integer("lessons").notNull(),
  rating: numeric("rating", { precision: 3, scale: 2 }).notNull(),
  reviewCount: integer("review_count").notNull(),
  badge: text("badge"),
  instructor: text("instructor").notNull(),
  instructorTitle: text("instructor_title").notNull(),
  accent: text("accent").notNull(),
  glyph: text("glyph").notNull(),
  highlights: jsonb("highlights").$type<string[]>().notNull(),
  curriculum: jsonb("curriculum")
    .$type<{ title: string; lessons: string[] }[]>()
    .notNull(),
  outcomes: jsonb("outcomes").$type<string[]>().notNull(),
  featured: boolean("featured").notNull().default(false),
  enrolled: integer("enrolled").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productSlug: text("product_slug").notNull(),
  author: text("author").notNull(),
  role: text("role").notNull(),
  rating: integer("rating").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  items: jsonb("items")
    .$type<{ slug: string; title: string; price: number; qty: number }[]>()
    .notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  discount: numeric("discount", { precision: 10, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("paid"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Order = typeof orders.$inferSelect;
