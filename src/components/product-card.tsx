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
      className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent p-6 backdrop-blur-xl shadow-2xl hover:border-violet-500/40 hover:shadow-[0_0_50px_rgba(139,92,246,0.1)] transition-all duration-500"
    >
      {/* Glossy inner sheen border like the reference */}
      <div className="absolute inset-0 border border-white/5 rounded-[2rem] pointer-events-none transition-colors group-hover:border-white/10" />

      {/* Cover Image Wrapper with matching curved flow */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5">
        <CourseCover
          accent={product.accent}
          glyph={product.glyph}
          title={product.title}
          level={product.level}
          className="aspect-[4/3] w-full transform object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge ? (
          <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-slate-200 backdrop-blur-md">
            {product.badge}
          </span>
        ) : null}
      </div>

      {/* Content Details Block tailored to the dark aesthetic */}
      <div className="relative mt-5 flex flex-1 flex-col">
        <div className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-wider text-slate-500">
          <span>{product.lessons} lessons</span>
          <span aria-hidden className="text-violet-500">·</span>
          <span>{product.durationHours}h</span>
        </div>
        
        <h3 className="mt-2 font-display text-xl font-bold text-white leading-snug group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-pink-400 transition-all duration-300">
          {product.title}
        </h3>
        
        <p className="mt-2 line-clamp-2 text-sm text-slate-400 font-light leading-relaxed">
          {product.subtitle}
        </p>

        {/* Rating Metrics Display */}
        <div className="mt-4 flex items-center gap-2 border-b border-white/5 pb-4">
          <Stars rating={product.rating} size={12} />
          <span className="text-xs font-bold text-slate-300">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-xs text-slate-500 font-mono">
            ({formatNumber(product.reviewCount)})
          </span>
        </div>

        {/* Action Tray & Asset Valuation Area */}
        <div className="mt-4 flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-extrabold text-white">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice ? (
              <span className="text-xs text-slate-500 line-through font-mono">
                {formatPrice(product.compareAtPrice)}
              </span>
            ) : null}
          </div>
          
          <button
            onClick={handleAdd}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white text-black transition-all duration-300 hover:scale-110 hover:bg-violet-500 hover:text-white hover:border-violet-400 active:scale-95 shadow-[0_4px_12px_rgba(255,255,255,0.1)] group-hover:shadow-[0_4px_15px_rgba(139,92,246,0.3)]"
            aria-label={`Add ${product.title} to cart`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
}
