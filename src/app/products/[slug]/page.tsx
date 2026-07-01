import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductGallery } from "@/components/product-gallery";
import { ReviewsSection } from "@/components/reviews-section";
import { ProductCard } from "@/components/product-card";
import { AddToCart } from "@/components/add-to-cart";
import { BuyNow } from "@/components/buy-now";
import { Stars } from "@/components/stars";
import {
  getProductBySlug,
  getReviewsForProduct,
  getRelatedProducts,
} from "@/lib/queries";
import { formatPrice, formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Course not found · AfruzStore" };
  return {
    title: `${product.title} · AfruzStore`,
    description: product.subtitle,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [reviews, related] = await Promise.all([
    getReviewsForProduct(slug),
    getRelatedProducts(product.categorySlug, slug),
  ]);

  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100,
      )
    : 0;

  return (
    <div>
      {/* breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <nav className="flex items-center gap-2 text-sm text-ink/50">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-ink">
            Courses
          </Link>
          <span>/</span>
          <span className="text-ink/80">{product.title}</span>
        </nav>
      </div>

      {/* main */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductGallery product={product} />
          </div>

          <div>
            {product.badge ? (
              <span
                className="inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white"
                style={{ background: product.accent }}
              >
                {product.badge}
              </span>
            ) : null}
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              {product.title}
            </h1>
            <p className="mt-3 text-lg text-ink/65">{product.subtitle}</p>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex items-center gap-2">
                <Stars rating={product.rating} size={17} />
                <span className="text-sm font-semibold">
                  {product.rating.toFixed(1)}
                </span>
                <Link
                  href="#reviews"
                  className="text-sm text-violet hover:underline"
                >
                  ({formatNumber(product.reviewCount)} reviews)
                </Link>
              </div>
              <span className="text-sm text-ink/45">
                {formatNumber(product.enrolled)} students
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Spec label="Lessons" value={`${product.lessons}`} />
              <Spec label="Duration" value={`${product.durationHours}h`} />
              <Spec label="Level" value={product.level} />
              <Spec label="Access" value="Lifetime" />
            </div>

            <div className="mt-7 rounded-3xl border border-ink/8 bg-white p-6 shadow-soft">
              <div className="flex items-end gap-3">
                <span className="font-display text-4xl font-bold">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice ? (
                  <>
                    <span className="mb-1 text-lg text-ink/40 line-through">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                    <span className="mb-1.5 rounded-full bg-mint/15 px-2 py-0.5 text-xs font-bold text-mint">
                      Save {discount}%
                    </span>
                  </>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-ink/50">
                One-time payment · Lifetime access · 30-day guarantee
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <AddToCart product={product} />
                <BuyNow product={product} />
              </div>
              <p className="mt-4 flex items-center justify-center gap-2 text-xs text-ink/45">
                <span className="text-mint">✓</span> Use code{" "}
                <span className="font-semibold text-ink/70">AICLAUDE</span> for
                15% off at checkout
              </p>
            </div>

            <div className="mt-7">
              <p className="font-semibold">About this course</p>
              <p className="mt-2 leading-relaxed text-ink/70">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* highlights & curriculum */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              What you&apos;ll learn
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {product.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-3 rounded-2xl border border-ink/8 bg-white p-4 shadow-soft"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet/12 text-sm text-violet">
                    ✓
                  </span>
                  <span className="text-sm text-ink/75">{h}</span>
                </li>
              ))}
            </ul>

            <h2 className="mt-10 font-display text-2xl font-semibold tracking-tight">
              Outcomes
            </h2>
            <ul className="mt-5 flex flex-col gap-2">
              {product.outcomes.map((o) => (
                <li key={o} className="flex items-start gap-3 text-sm text-ink/75">
                  <span className="mt-1 text-gold">★</span>
                  {o}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Curriculum
            </h2>
            <p className="mt-1 text-sm text-ink/50">
              {product.curriculum.length} modules · {product.lessons} lessons
            </p>
            <div className="mt-5 flex flex-col gap-3">
              {product.curriculum.map((mod, i) => (
                <div
                  key={mod.title}
                  className="overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-soft"
                >
                  <div className="flex items-center gap-3 border-b border-ink/8 bg-cream/40 px-5 py-3.5">
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ background: product.accent }}
                    >
                      {i + 1}
                    </span>
                    <span className="font-display font-semibold">
                      {mod.title}
                    </span>
                  </div>
                  <ul className="divide-y divide-ink/6">
                    {mod.lessons.map((l) => (
                      <li
                        key={l}
                        className="flex items-center gap-3 px-5 py-3 text-sm text-ink/70"
                      >
                        <span className="text-ink/30">▷</span>
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* instructor */}
            <div className="mt-8 flex items-center gap-4 rounded-3xl border border-ink/8 bg-white p-6 shadow-soft">
              <span
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl font-display text-2xl font-semibold text-white"
                style={{ background: product.accent }}
              >
                {product.instructor[0]}
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-ink/45">
                  Your instructor
                </p>
                <p className="font-display text-lg font-semibold">
                  {product.instructor}
                </p>
                <p className="text-sm text-ink/55">{product.instructorTitle}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* reviews */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <ReviewsSection
          slug={product.slug}
          initialReviews={reviews}
          rating={product.rating}
          reviewCount={product.reviewCount}
        />
      </section>

      {/* related */}
      {related.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            You might also like
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-ink/8 bg-white px-4 py-2.5 text-center shadow-soft">
      <p className="font-display text-base font-bold">{value}</p>
      <p className="text-[0.65rem] uppercase tracking-wide text-ink/45">
        {label}
      </p>
    </div>
  );
}
