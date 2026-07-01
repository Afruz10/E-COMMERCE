"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart-context";

const nav = [
  { href: "/products", label: "All Courses" },
  { href: "/products?category=token-mastery", label: "Token Mastery" },
  { href: "/products?category=ai-for-money", label: "AI for Money" },
  { href: "/products?category=ai-for-good", label: "AI for Good" },
];

export function Header() {
  const { count, openCart, hydrated } = useCart();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="bg-ink text-cream">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-[0.72rem] font-medium tracking-wide">
          <span aria-hidden>✦</span>
          <span>
            New year, lower bills — use code{" "}
            <span className="font-semibold text-gold">AICLAUDE</span> for 15% off
            every course
          </span>
        </div>
      </div>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-paper/85 shadow-soft backdrop-blur-xl"
            : "bg-paper/40 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink font-display text-lg font-semibold text-cream transition-transform duration-300 group-hover:-rotate-6">
              A
            </span>
            <span className="font-display text-xl font-semibold tracking-tight">
              Afruz<span className="text-violet">Store</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/products"
              className="hidden rounded-full bg-ink px-4 py-2 text-sm font-semibold text-cream transition-transform hover:scale-[1.03] sm:inline-flex"
            >
              Browse
            </Link>
            <button
              onClick={openCart}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white text-ink transition-colors hover:bg-ink/5"
              aria-label="Open cart"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 7h12l-1 12a2 2 0 01-2 2H9a2 2 0 01-2-2L6 7z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 7a3 3 0 016 0"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              {hydrated && count > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-violet px-1 text-[0.65rem] font-bold text-white">
                  {count}
                </span>
              ) : null}
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white text-ink lg:hidden"
              aria-label="Menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d={menuOpen ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"}
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div className="border-t border-ink/10 bg-paper px-4 py-3 lg:hidden">
            <nav className="flex flex-col">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-ink/5"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        ) : null}
      </header>
    </>
  );
}
