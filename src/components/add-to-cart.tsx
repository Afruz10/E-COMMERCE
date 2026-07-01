"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-context";
import type { ProductDTO } from "@/lib/types";

export function AddToCart({ product }: { product: ProductDTO }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      slug: product.slug,
      title: product.title,
      price: product.price,
      accent: product.accent,
      glyph: product.glyph,
      level: product.level,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <button
      onClick={handleAdd}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-violet px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet/25 transition-all hover:scale-[1.02] hover:bg-violet-deep active:scale-[0.99] sm:w-auto"
    >
      {added ? (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Added to cart
        </>
      ) : (
        <>
          Add to cart
          <span aria-hidden>→</span>
        </>
      )}
    </button>
  );
}
