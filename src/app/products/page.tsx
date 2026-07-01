import { ProductBrowser } from "@/components/product-browser";
import { getAllProducts, getCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ]);

  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <div>
      <section className="border-b border-ink/8 bg-cream/60">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet">
            {activeCategory ? activeCategory.tagline : "The full library"}
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            {activeCategory ? activeCategory.name : "All AI courses"}
          </h1>
          <p className="mt-3 max-w-2xl text-ink/60">
            {activeCategory
              ? activeCategory.description
              : "Premium, practical courses for using Claude affordably, ethically, and profitably. Filter and sort to find your perfect fit."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <ProductBrowser
          products={products}
          categories={categories}
          initialCategory={category}
        />
      </section>
    </div>
  );
}
