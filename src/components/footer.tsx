import Link from "next/link";

const cols = [
  {
    title: "Courses",
    links: [
      { label: "All Courses", href: "/products" },
      { label: "Token Mastery", href: "/products?category=token-mastery" },
      { label: "AI for Money", href: "/products?category=ai-for-money" },
      { label: "AI for Good", href: "/products?category=ai-for-good" },
      { label: "Builder Track", href: "/products?category=builder-track" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Mission", href: "/#mission" },
      { label: "Why AfruzStore", href: "/#why" },
      { label: "Reviews", href: "/#testimonials" },
      { label: "Browse", href: "/products" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cream font-display text-lg font-semibold text-ink">
                A
              </span>
              <span className="font-display text-xl font-semibold">
                Afruz<span className="text-violet">Store</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/65">
              Premium courses that teach you to use Claude with fewer tokens,
              build AI for good, and turn your skills into real income.
            </p>
            <div className="mt-5 flex gap-3">
              {["𝕏", "in", "▶", "✉"].map((s) => (
                <span
                  key={s}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-sm text-cream/70 transition-colors hover:border-cream/40 hover:text-cream"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/45">
                {col.title}
              </h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-cream/70 transition-colors hover:text-cream"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/45">
              Stay in the loop
            </h4>
            <p className="mt-4 text-sm text-cream/65">
              Token-saving tips and new course drops. No spam.
            </p>
            <form className="mt-4 flex overflow-hidden rounded-full border border-cream/15 bg-cream/5">
              <input
                type="email"
                placeholder="you@email.com"
                className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-cream placeholder:text-cream/40 focus:outline-none"
              />
              <button
                type="button"
                className="bg-violet px-4 text-sm font-semibold text-white"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-cream/10 pt-6 text-xs text-cream/50 sm:flex-row">
          <p>© {new Date().getFullYear()} AfruzStore. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <span className="cursor-pointer hover:text-cream/80">Privacy</span>
            <span className="cursor-pointer hover:text-cream/80">Terms</span>
            <span className="cursor-pointer hover:text-cream/80">Refunds</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
