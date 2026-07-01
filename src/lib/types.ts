export type ProductDTO = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  categorySlug: string;
  level: string;
  price: number;
  compareAtPrice: number | null;
  durationHours: number;
  lessons: number;
  rating: number;
  reviewCount: number;
  badge: string | null;
  instructor: string;
  instructorTitle: string;
  accent: string;
  glyph: string;
  highlights: string[];
  curriculum: { title: string; lessons: string[] }[];
  outcomes: string[];
  featured: boolean;
  enrolled: number;
};

export type CategoryDTO = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  accent: string;
  glyph: string;
};

export type ReviewDTO = {
  id: number;
  productSlug: string;
  author: string;
  role: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
};

export type CartItem = {
  slug: string;
  title: string;
  price: number;
  accent: string;
  glyph: string;
  level: string;
  qty: number;
};
