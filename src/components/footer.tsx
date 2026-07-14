import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-cream/10 bg-ink text-cream/70">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          
          {/* Brand Info */}
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cream font-display text-sm font-bold text-ink">
                A
              </span>
              <span className="font-display text-lg font-semibold text-white">
                Afruz<span className="text-violet">Store</span>
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-cream/60">
              Premium courses that teach you to use Claude with fewer tokens, build AI for good, and turn your skills into real income.
            </p>
            {/* Social Icons Placeholder Grid */}
            <div className="flex space-x-4">
              {["x", "in", "yt", "mail"].map((s) => (
                <span key={s} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-cream/10 bg-cream/5 text-xs text-cream/40 hover:border-cream/30 hover:text-white transition-colors">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation Links Blocks */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
                  Courses
                </h3>
                <ul className="mt-4 space-y-2">
                  <li><Link href="/products" className="text-sm hover:text-cyan-400 transition-colors">All Courses</Link></li>
                  <li><Link href="/products/claude-low-token-mastery" className="text-sm hover:text-cyan-400 transition-colors">Token Mastery</Link></li>
                  <li><Link href="/products?category=money" className="text-sm hover:text-cyan-400 transition-colors">AI for Money</Link></li>
                  <li><Link href="/products?category=good" className="text-sm hover:text-cyan-400 transition-colors">AI for Good</Link></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
                  Company
                </h3>
                <ul className="mt-4 space-y-2">
                  <li><Link href="/#mission" className="text-sm hover:text-cyan-400 transition-colors">Our Mission</Link></li>
                  <li><Link href="/#why" className="text-sm hover:text-cyan-400 transition-colors">Why AfruzStore</Link></li>
                  <li><Link href="/#testimonials" className="text-sm hover:text-cyan-400 transition-colors">Reviews</Link></li>
                  <li><Link href="/products" className="text-sm hover:text-cyan-400 transition-colors">Browse</Link></li>
                </ul>
              </div>
            </div>

            {/* Newsletter Input Box Form Node */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
                Stay in the loop
              </h3>
              <p className="mt-4 text-sm text-cream/60">
                Token-saving tips and new course drops. No spam.
              </p>
              <form className="mt-4 sm:flex sm:max-w-md">
                <input
                  type="email"
                  required
                  placeholder="you@email.com"
                  className="w-full rounded-2xl border border-cream/10 bg-zinc-950/50 px-4 py-2.5 text-sm text-white placeholder-cream/30 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 sm:max-w-xs"
                />
                <button
                  type="submit"
                  className="mt-3 flex w-full items-center justify-center rounded-2xl bg-violet px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet/80 transition-colors sm:ml-3 sm:mt-0 sm:w-auto"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Rights Bar Layer */}
        <div className="mt-12 border-t border-cream/5 pt-8 md:flex md:items-center md:justify-between">
          <p className="text-xs text-cream/40 order-2 md:order-1">
            &copy; 2026 AfruzStore. All rights reserved.
          </p>
          <div className="mt-4 flex space-x-6 order-1 md:order-2 md:mt-0">
            <Link href="/privacy" className="text-xs hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs hover:text-white transition-colors">Terms</Link>
            <Link href="/refunds" className="text-xs hover:text-white transition-colors">Refunds</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
