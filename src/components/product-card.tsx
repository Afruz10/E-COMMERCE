"use client";

import Link from "next/link";
import { CourseCover } from "@/components/course-cover";
import { Stars } from "@/components/stars";
import { useCart } from "@/components/cart-context";
import { formatPrice, formatNumber } from "@/lib/format";
import type { ProductDTO } from "@/lib/types";

export function ProductCard({ product }: { product: ProductDTO }) {
  const { addItem } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      slug: product.slug,
      title: product.title,
      price: product.price,
      accent: product.accent,
      glyph: product.glyph,
      level: product.level,
    });
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="card-hover group flex flex-col overflow-hidden rounded-3xl border border-ink/8 bg-white shadow-soft"
    >
      <div className="relative">
        <CourseCover
          accent={product.accent}
          glyph={product.glyph}
          title={product.title}
          level={product.level}
          className="aspect-[4/3] w-full"
        />
        {product.badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-ink shadow-sm">
            {product.badge}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-ink/55">
          <span>{product.lessons} lessons</span>
          <span aria-hidden>·</span>
          <span>{product.durationHours}h</span>
        </div>
        <h3 className="mt-2 font-display text-lg font-semibold leading-snug transition-colors group-hover:text-violet">
          {product.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink/60">
          {product.subtitle}
        </p>

        <div className="mt-3 flex items-center gap-2">
          <Stars rating={product.rating} size={14} />
          <span className="text-xs font-medium text-ink/60">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-xs text-ink/40">
            ({formatNumber(product.reviewCount)})
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-ink/8 pt-4">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-bold">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice ? (
              <span className="text-sm text-ink/40 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            ) : null}
          </div>
          <button
            onClick={handleAdd}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-cream transition-transform hover:scale-110 active:scale-95"
            aria-label={`Add ${product.title} to cart`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
}
