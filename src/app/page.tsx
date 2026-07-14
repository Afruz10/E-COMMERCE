import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/product-card";
import { Stars } from "@/components/stars";
import InstagramIcon from "@/components/InstagramIcon";
import {
  getCategories,
  getFeaturedProducts,
  getAllProducts,
} from "@/lib/queries";
import { formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

const valueProps = [
  {
    glyph: "◇",
    title: "Spend fewer tokens",
    body: "Proven prompt and context techniques that cut your Claude costs by up to 70%.",
  },
  {
    glyph: "✦",
    title: "Build AI for good",
    body: "Responsible, privacy-first patterns to help people, communities, and the planet.",
  },
  {
    glyph: "❖",
    title: "Earn with AI",
    body: "Freelance, automate, and ship products that turn your skills into real income.",
  },
  {
    glyph: "▲",
    title: "Production-ready",
    body: "Real teardowns, templates, and code you can use the same day you learn it.",
  },
];

const testimonials = [
  {
    quote:
      "I cut my Claude bill from $340 to $150 a month with no quality loss. AfruzStore paid for itself in three days.",
    author: "Daniel K.",
    role: "Indie developer",
    rating: 5,
  },
  {
    quote:
      "The freelancer blueprint helped me land a $2k client in two weeks. The outreach scripts are pure gold.",
    author: "Chloe D.",
    role: "Freelance writer",
    rating: 5,
  },
  {
    quote:
      "Our nonprofit now drafts grant applications in a fraction of the time — responsibly. Genuinely life-changing.",
    author: "Grace W.",
    role: "Nonprofit director",
    rating: 5,
  },
];

const marquee = [
  "70% lower token costs",
  "12,000+ students",
  "Lifetime access",
  "Updated for 2026",
  "30-day guarantee",
  "Real-world templates",
];

export default async function HomePage() {
  const [featured, categories, all] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getAllProducts(),
  ]);

  const totalStudents = all.reduce((s, p) => s + p.enrolled, 0);
  const avgRating =
    all.reduce((s, p) => s + p.rating, 0) / Math.max(1, all.length);

  return (
    <div className="bg-[#030303] min-h-screen text-slate-100 overflow-x-hidden selection:bg-violet-500 selection:text-white">
      
      {/* 🔴 CINEMATIC HERO SECTION (Inspired by Image 1) */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#070708] pt-16 md:pt-0">
        
        {/* Abstract Background Fluid Layer */}
        <div className="absolute top-1/2 right-[-10%] -translate-y-1/2 w-[350px] h-[350px] md:w-[600px] md:h-[600px] rounded-full bg-gradient-to-tr from-red-600 to-violet-800 opacity-20 blur-[100px] pointer-events-none" />
        
        {/* Image 1 Graphic Circle Grid */}
        <div className="absolute top-1/2 right-[5%] md:right-[10%] -translate-y-1/2 w-[280px] h-[280px] md:w-[500px] md:h-[500px] rounded-full bg-gradient-to-br from-red-600/40 via-purple-600/10 to-transparent hidden md:flex items-center justify-center border border-red-500/20 shadow-[0_0_80px_rgba(239,68,68,0.15)] animate-pulse">
          <div className="w-[85%] h-[85%] rounded-full bg-[#050506] border border-red-500/10" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 w-full z-10 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/20 px-4 py-1.5 text-xs font-medium tracking-widest text-red-400 uppercase backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
              Master Claude — the smart, affordable way
            </span>
            
            <h1 className="mt-8 font-display text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl text-white leading-[0.95]">
              Use AI for good.
              <br />
              <span className="bg-gradient-to-r from-red-500 via-pink-500 to-violet-500 bg-clip-text text-transparent">
                Spend less. Build more.
              </span>
            </h1>
            
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-slate-400 font-light">
              AfruzStore is the premium course library for using Claude with
              fewer tokens, building AI that helps people, and turning your
              skills into real income.
            </p>
            
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-black transition-transform duration-300 hover:scale-[1.05]"
              >
                Explore courses
                <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
              </Link>
              <Link
                href="/products/claude-low-token-mastery"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20"
              >
                ◇ See the bestseller
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-4 sm:flex sm:flex-wrap sm:items-center sm:gap-x-12">
              <Stat value={`${formatNumber(Math.round(totalStudents / 100) * 100)}+`} label="Students" />
              <Stat value={avgRating.toFixed(1)} label="Avg rating" />
              <Stat value="70%" label="Lower token cost" />
              <Stat value={`${all.length}`} label="Courses" />
            </div>
          </div>
        </div>

        {/* Bottom design accent bar inspired by Image 1 slider look */}
        <div className="absolute bottom-10 left-4 md:left-8 flex items-center gap-4 text-[10px] tracking-widest text-slate-600 font-mono">
          <span>01</span>
          <div className="h-[1px] w-24 bg-gradient-to-r from-red-500 to-transparent" />
          <span>03</span>
        </div>
      </section>

      {/* 🔮 NEON BLENDED DIVIDER */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-red-500/20 via-violet-500/30 to-transparent" />

      {/* 🚀 SMOOTH SCROLL MARQUEE */}
      <div className="bg-[#050506] py-4 border-b border-white/5">
        <div className="relative flex overflow-hidden">
          <div className="animate-marquee flex shrink-0 items-center gap-10 pr-10">
            {[...marquee, ...marquee].map((m, i) => (
              <span key={i} className="flex items-center gap-3 whitespace-nowrap text-xs font-semibold uppercase tracking-widest text-slate-500">
                <span className="text-red-500">✦</span>
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 💎 PREMIUM GLASS-MORPHISM COLLECTIONS (Inspired by Image 2 Cards) */}
      <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
        
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-400">
              Featured collections
            </p>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Find your path
            </h2>
          </div>
          <Link href="/products" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors underline underline-offset-4">
            View all courses →
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => {
            const count = all.filter((p) => p.categorySlug === c.slug).length;
            return (
              <Link
                key={c.slug}
                href={`/products?category=${c.slug}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] p-8 border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-xl shadow-2xl hover:border-violet-500/40 hover:shadow-[0_0_50px_rgba(139,92,246,0.1)] transition-all duration-500"
                style={{ minHeight: 250 }}
              >
                {/* Glossy inner sheen border */}
                <div className="absolute inset-0 border border-white/5 rounded-[2rem] pointer-events-none transition-colors group-hover:border-white/10" />
                
                <div className="relative flex items-start justify-between">
                  <span className="font-display text-5xl leading-none text-slate-200 opacity-80 group-hover:scale-110 transition-transform duration-300">
                    {c.glyph}
                  </span>
                  <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[10px] font-medium tracking-wide text-slate-300 backdrop-blur-md">
                    {count} courses
                  </span>
                </div>
                
                <div className="relative mt-8">
                  <h3 className="font-display text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-pink-400 transition-all duration-300">
                    {c.name}
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">{c.tagline}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-violet-400 opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    Explore →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 🎯 PRODUCT GRID LABELS */}
      <section className="bg-[#050506] py-24 border-y border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/5 pb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-400">
                Trending now
              </p>
              <h2 className="mt-2 font-display text-4xl font-bold text-white">
                Student favorites
              </h2>
            </div>
            <Link href="/products" className="rounded-full bg-white px-6 py-2.5 text-xs font-bold text-black hover:scale-[1.03] transition-transform">
              Shop all
            </Link>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 6).map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 🛡️ RECTIFIED GLOSS CARD FEATURES (Image 2 Features block style) */}
      <section id="why" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-400">Why AfruzStore</p>
          <h2 className="mt-2 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">Smarter AI, without the waste</h2>
        </div>
        
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {valueProps.map((v) => (
            <div key={v.title} className="rounded-[1.75rem] border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent p-8 backdrop-blur-md hover:border-white/10 transition-all duration-300 shadow-xl">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 font-display text-2xl text-white border border-white/10 shadow-inner">
                {v.glyph}
              </span>
              <h3 className="mt-6 font-display text-lg font-bold text-white">{v.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400 font-light">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION GRID */}
      <section id="mission" className="bg-[#050506] py-24 border-t border-white/5">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 via-transparent to-transparent z-10" />
            <Image src="/images/mission.jpg" alt="People building AI for good together" fill className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-400">Our mission</p>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">AI should be affordable, ethical, and within reach.</h2>
            <p className="mt-6 leading-relaxed text-slate-400 font-light">
              We started AfruzStore because powerful AI shouldn&apos;t mean runaway bills or fuzzy ethics. Our courses help you do more with Claude using fewer tokens, build tools that genuinely help people, and create real income.
            </p>
            <ul className="mt-8 flex flex-col gap-4">
              {["Lifetime access & free updates", "Real templates, prompts, and code", "30-day money-back guarantee"].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm font-medium text-slate-300">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/10 text-[10px] text-red-400 border border-red-500/20">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* GLASS GLASS TESTIMONIALS */}
      <section id="testimonials" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-400">Loved by builders</p>
          <h2 className="mt-2 font-display text-4xl font-bold text-white sm:text-5xl">12,000+ students, real results</h2>
        </div>
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.author} className="flex flex-col rounded-[2rem] border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent p-8 backdrop-blur-md shadow-lg">
              <Stars rating={t.rating} size={14} />
              <blockquote className="mt-6 flex-1 text-sm leading-relaxed text-slate-300 font-light italic">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-4 border-t border-white/5 pt-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
                  {t.author[0]}
                </span>
                <div>
                  <p className="text-sm font-bold text-white">{t.author}</p>
                  <p className="text-xs text-slate-500 font-mono">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* 🌌 CINEMATIC CTA AREA BANNER */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0e0a1a] via-[#050506] to-black px-8 py-20 text-center border border-white/5 shadow-[0_0_80px_rgba(139,92,246,0.05)]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-violet-500/10 rounded-full blur-[60px] pointer-events-none" />
          <div className="relative mx-auto max-w-2xl z-10">
            <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
              Ready to build more for less?
            </h2>
            <p className="mt-6 text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Join thousands of students using Claude smarter. Use code{" "}
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400">AICLAUDE</span> for 15% off your first course.
            </p>
            <Link href="/products" className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-xs font-bold uppercase tracking-wider text-black hover:scale-[1.05] transition-transform duration-300">
              Start learning today →
            </Link>
          </div>
        </div>
      </section>

      <InstagramIcon />
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l border-white/10 pl-4 md:pl-6 first:border-none first:pl-0">
      <p className="font-display text-3xl font-extrabold text-white md:text-4xl tracking-tight">{value}</p>
      <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1 font-mono">{label}</p>
    </div>
  );
}
