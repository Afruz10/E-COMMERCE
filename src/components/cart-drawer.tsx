"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/components/cart-context";
import { formatPrice } from "@/lib/format";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    setQty,
    removeItem,
    subtotal,
    discount,
    total,
    promoApplied,
    count,
  } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeCart]);

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-2xl transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <div>
            <h2 className="font-display text-xl font-semibold">Your cart</h2>
            <p className="text-xs text-ink/55">
              {count} {count === 1 ? "course" : "courses"}
            </p>
          </div>
          <button
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 bg-white text-ink hover:bg-ink/5"
            aria-label="Close cart"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ink/5 text-3xl">
              🛒
            </div>
            <div>
              <p className="font-display text-lg font-semibold">
                Your cart is empty
              </p>
              <p className="mt-1 text-sm text-ink/55">
                Add a course and start spending fewer tokens today.
              </p>
            </div>
            <Link
              href="/products"
              onClick={closeCart}
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream transition-transform hover:scale-[1.03]"
            >
              Browse courses
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li
                    key={item.slug}
                    className="flex gap-3 rounded-2xl border border-ink/8 bg-white p-3"
                  >
                    <div
                      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl font-display text-3xl text-white"
                      style={{ background: item.accent }}
                    >
                      {item.glyph}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeCart}
                          className="line-clamp-2 text-sm font-semibold leading-snug hover:text-violet"
                        >
                          {item.title}
                        </Link>
                        <button
                          onClick={() => removeItem(item.slug)}
                          className="shrink-0 text-ink/40 hover:text-rose"
                          aria-label="Remove"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M6 6l12 12M18 6L6 18"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>
                      <p className="text-[0.7rem] text-ink/50">{item.level}</p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-full border border-ink/12">
                          <button
                            onClick={() => setQty(item.slug, item.qty - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-ink/70 hover:bg-ink/5"
                            aria-label="Decrease"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm font-semibold">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => setQty(item.slug, item.qty + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-ink/70 hover:bg-ink/5"
                            aria-label="Increase"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-bold">
                          {formatPrice(item.price * item.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-ink/10 bg-white px-5 py-4">
              <div className="flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between text-ink/65">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {promoApplied ? (
                  <div className="flex justify-between text-mint">
                    <span>Promo (AICLAUDE)</span>
                    <span>−{formatPrice(discount)}</span>
                  </div>
                ) : null}
                <div className="mt-1 flex justify-between border-t border-ink/8 pt-2 text-base font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-violet px-5 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
              >
                Checkout
                <span aria-hidden>→</span>
              </Link>
              <button
                onClick={closeCart}
                className="mt-2 w-full rounded-full px-5 py-2 text-sm font-medium text-ink/60 hover:text-ink"
              >
                Continue browsing
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
