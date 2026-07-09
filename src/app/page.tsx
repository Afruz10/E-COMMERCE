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
    <div className="bg-ink min-h-screen text-cream overflow-x-hidden">
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink text-cream">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-[0.35]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/80 to-ink" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
          <div className="max-w-3xl animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/5 px-4 py-1.5 text-xs font-medium tracking-wide backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-mint" />
              Master Claude — the smart, affordable way
            </span>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Use AI for good.
              <br />
              <span className="bg-gradient-to-r from-violet via-[#9b8dff] to-gold bg-clip-text text-transparent">
                Spend less. Build more.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/75">
              AfruzStore is the premium course library for using Claude with
              fewer tokens, building AI that helps people, and turning your
              skills into real income.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 rounded-full bg-cream px-7 py-3.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
              >
                Explore courses
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <Link
                href="/products/claude-low-token-mastery"
                className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-7 py-3.5 text-sm font-semibold text-cream backdrop-blur transition-colors hover:bg-cream/10"
              >
                ◇ See the bestseller
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4">
              <Stat value={`${formatNumber(Math.round(totalStudents / 100) * 100)}+`} label="Students" />
              <Stat value={avgRating.toFixed(1)} label="Avg rating" />
              <Stat value="70%" label="Lower token cost" />
              <Stat value={`${all.length}`} label="Courses" />
            </div>
          </div>
        </div>
      </section>

      {/* 🎨 GRADIENT MIX BORDER LINE (TOP) */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-violet/50 via-[#9b8dff]/70 via-gold/50 to-transparent" />

      {/* MARQUEE */}
      <div className="bg-cream/5 py-4 backdrop-blur">
        <div className="relative flex overflow-hidden">
          <div className="animate-marquee flex shrink-0 items-center gap-10 pr-10">
            {[...marquee, ...marquee].map((m, i) => (
              <span
                key={i}
                className="flex items-center gap-3 whitespace-nowrap text-sm font-medium text-cream/70"
              >
                <span className="text-violet">✦</span>
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 🎨 GRADIENT MIX BORDER LINE (BOTTOM) */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-gold/40 via-[#9b8dff]/60 via-violet/40 to-transparent" />

      {/* COLLECTIONS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet">
              Featured collections
            </p>
            <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-white">
              Find your path
            </h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold text-cream/70 underline-offset-4 hover:text-cream hover:underline"
          >
            View all courses →
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => {
            const count = all.filter((p) => p.categorySlug === c.slug).length;
            return (
              <Link
                key={c.slug}
                href={`/products?category=${c.slug}`}
                className="card-hover group relative flex flex-col justify-between overflow-hidden rounded-3xl p-6 text-white border border-cream/10 shadow-lg hover:border-cream/20 transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${c.accent || '#1e1b4b'} 0%, #09090b 100%)`,
                  minHeight: 220,
                }}
              >
                <div className="grain absolute inset-0 opacity-10" />
                <div className="relative flex items-start justify-between">
                  <span className="font-display text-5xl leading-none opacity-90 text-cream">
                    {c.glyph}
                  </span>
                  <span className="rounded-full bg-white/10 border border-white/10 px-2.5 py-1 text-[0.65rem] font-semibold backdrop-blur text-cream">
                    {count} courses
                  </span>
                </div>
                <div className="relative">
                  <h3 className="font-display text-2xl font-semibold text-white group-hover:text-cyan-400 transition-colors">
                    {c.name}
                  </h3>
                  <p className="mt-1 text-sm text-cream/80">{c.tagline}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-cyan-400 opacity-0 transition-opacity group-hover:opacity-100">
                    Explore →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 🎨 SEPARATOR GRADIENT MIX LINE */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cream/10 to-transparent" />

      {/* FEATURED PRODUCTS */}
      <section className="bg-cream/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet">
                Trending now
              </p>
              <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-cream">
                Student favorites
              </h2>
            </div>
            <Link
              href="/products"
              className="rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
            >
              Shop all
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 6).map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 🎨 SEPARATOR GRADIENT MIX LINE */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cream/10 to-transparent" />

      {/* WHY */}
      <section id="why" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet">
            Why AfruzStore
          </p>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-cream">
            Smarter AI, without the waste
          </h2>
          <p className="mt-4 text-cream/60">
            Everything we teach is practical, ethical, and obsessed with value —
            for your wallet and for the world.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {valueProps.map((v) => (
            <div
              key={v.title}
              className="rounded-3xl border border-cream/10 bg-zinc-950/50 backdrop-blur p-6 shadow-xl transition-all hover:border-cream/20"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet/20 font-display text-2xl text-violet">
                {v.glyph}
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-white">
                {v.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/60">
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 🎨 SEPARATOR GRADIENT MIX LINE */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cream/10 to-transparent" />

      {/* MISSION */}
      <section id="mission" className="bg-zinc-950/40 py-24 text-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-cream/10">
            <div className="absolute inset-0 bg-gradient-to-tr from-violet/20 to-ink" />
            <Image
              src="/images/mission.jpg"
              alt="People building AI for good together"
              fill
              className="object-cover opacity-80"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Our mission
            </p>
            <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-white">
              AI should be affordable, ethical, and within reach.
            </h2>
            <p className="mt-5 leading-relaxed text-cream/70">
              We started AfruzStore because powerful AI shouldn&apos;t mean
              runaway bills or fuzzy ethics. Our courses help you do more with
              Claude using fewer tokens, build tools that genuinely help people,
              and create real income — all while keeping your work responsible
              and transparent.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {[
                "Lifetime access & free updates",
                "Real templates, prompts, and code",
                "30-day money-back guarantee",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-cream/85">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mint/20 text-sm text-mint">
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 🎨 SEPARATOR GRADIENT MIX LINE */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cream/10 to-transparent" />

      {/* TESTIMONIALS */}
      <section id="testimonials" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet">
            Loved by builders
          </p>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-cream">
            12,000+ students, real results
          </h2>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.author}
              className="flex flex-col rounded-3xl border border-cream/10 bg-zinc-950/40 backdrop-blur p-7 shadow-lg"
            >
              <Stars rating={t.rating} size={16} />
              <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-cream/80">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-cream/10 pt-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream font-display text-sm font-semibold text-ink">
                  {t.author[0]}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{t.author}</p>
                  <p className="text-xs text-cream/50">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* 🎨 SEPARATOR GRADIENT MIX LINE */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cream/10 to-transparent" />

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet via-violet/80 to-zinc-950 px-6 py-16 text-center text-white sm:px-12 sm:py-20 border border-cream/10">
          <div className="grain absolute inset-0 opacity-10" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl text-white">
              Ready to build more for less?
            </h2>
            <p className="mt-4 text-cream/80">
              Join thousands of students using Claude smarter. Use code{" "}
              <span className="font-semibold text-gold">AICLAUDE</span> for 15%
              off your first course.
            </p>
            <Link
              href="/products"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-cream px-8 py-4 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
            >
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
    <div>
      <p className="font-display text-3xl font-bold text-white">{value}</p>
      <p className="text-xs uppercase tracking-wider text-cream/60">{label}</p>
    </div>
  );
}
