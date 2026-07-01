"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-context";
import type { ProductDTO } from "@/lib/types";

export function BuyNow({ product }: { product: ProductDTO }) {
  const { addItem, closeCart } = useCart();
  const router = useRouter();

  const handle = () => {
    addItem({
      slug: product.slug,
      title: product.title,
      price: product.price,
      accent: product.accent,
      glyph: product.glyph,
      level: product.level,
    });
    closeCart();
    router.push("/checkout");
  };

  return (
    <button
      onClick={handle}
      className="flex w-full items-center justify-center gap-2 rounded-full border border-ink/15 bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-cream sm:w-auto"
    >
      Buy now
    </button>
  );
}
