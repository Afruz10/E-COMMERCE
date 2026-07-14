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
      {/* 🌌 Premium Dark Announcement Bar */}
      <div className="bg-[#050506] text-slate-400 border-b border-white/5">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-[0.72rem] font-medium tracking-widest uppercase">
          <span aria-hidden className="text-red-500 animate-pulse">✦</span>
          <span>
            New year, lower bills — use code{" "}
            <span className="font-bold text-white bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">AICLAUDE</span> for 15% off
            every course
          </span>
        </div>
      </div>

      {/* 💎 Transparent Glass Capsule Floating Header (Inspired by Image 2) */}
      <header
        className={`sticky top-3 z-50 mx-auto w-[95%] max-w-5xl rounded-full border transition-all duration-500 ${
          scrolled
            ? "bg-black/60 border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            : "bg-black/20 border-white/5 backdrop-blur-md"
        }`}
      >
        <div className="flex items-center justify-between gap-4 px-6 py-3">
          
          {/* Logo Section */}
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-display text-sm font-bold text-black transition-transform duration-300 group-hover:-rotate-6">
              A
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-white">
              Afruz<span className="text-red-500 transition-colors group-hover:text-violet-400">Store</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 transition-all duration-300 hover:bg-white/5 hover:text-white"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Action Interface Area */}
          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="hidden rounded-full bg-white px-5 py-2 text-xs font-bold uppercase tracking-wider text-black transition-transform hover:scale-[1.05] sm:inline-flex"
            >
              Browse
            </Link>
            
            {/* Glossy Cart Trigger Button */}
            <button
              onClick={openCart}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-300 hover:bg-white/10"
              aria-label="Open cart"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 7h12l-1 12a2 2 0 01-2 2H9a2 2 0 01-2-2L6 7z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 7a3 3 0 016 0"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              {hydrated && count > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[0.6rem] font-extrabold text-white animate-bounce">
                  {count}
                </span>
              ) : null}
            </button>

            {/* Mobile Menu Trigger Icon */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white lg:hidden"
              aria-label="Menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d={menuOpen ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"}
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Glossy Mobile Menu Overlay */}
        {menuOpen ? (
          <div className="absolute top-14 left-0 w-full rounded-3xl border border-white/10 bg-black/90 p-4 backdrop-blur-2xl lg:hidden shadow-2xl animate-fade-in">
            <nav className="flex flex-col gap-1">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
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
