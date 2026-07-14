"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart-context";
import { formatPrice } from "@/lib/format";

export default function CheckoutPage() {
  const {
    items,
    subtotal,
    discount,
    total,
    promoApplied,
    promoCode,
    applyPromo,
    removePromo,
    clear,
    hydrated,
  } = useCart();

  const [form, setForm] = useState({
    name: "",
    email: "",
    card: "",
    exp: "",
    cvc: "",
    country: "United States",
  });
  const [promoInput, setPromoInput] = useState("");
  const [promoMsg, setPromoMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handlePromo = () => {
    if (applyPromo(promoInput)) {
      setPromoMsg("Promo applied — 15% off!");
    } else {
      setPromoMsg("Invalid code. Try AICLAUDE.");
    }
  };

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim()) {
      setError("Please enter your name and email.");
      return;
    }
    if (!form.card.trim() || !form.exp.trim() || !form.cvc.trim()) {
      setError("Please complete your payment details.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          items: items.map((i) => ({
            slug: i.slug,
            title: i.title,
            price: i.price,
            qty: i.qty,
          })),
          total: total, // Passing exact calculated values to backend logic
          promoCode: promoApplied ? promoCode : "",
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      
      // 🛒 Wipe current client state data tokens safely
      clear();

      // 🔥 REDIRECT INJECTION HUB: Redirecting direct to our premium new page configuration!
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        // Fallback standard redirection path if backend router parameters drop out
        window.location.href = `/checkout/success?amount=${total}&course=${encodeURIComponent(items[0]?.title || "Course")}&ref=${data.order?.reference || "REF-STORE"}`;
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (hydrated && items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 bg-[#030303] text-white rounded-3xl mt-12 border border-white/5 shadow-2xl">
        <div className="text-5xl">🛒</div>
        <h1 className="mt-5 font-display text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-slate-400 font-light">Add a course before heading to checkout.</p>
        <Link href="/products" className="mt-6 inline-flex rounded-full bg-white px-8 py-3 text-xs font-bold uppercase tracking-wider text-black transition-transform hover:scale-[1.03]">
          Browse courses
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 bg-[#030303] text-slate-200 min-h-screen">
      <Link href="/products" className="text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-white transition-colors">
        ← Continue shopping
      </Link>
      <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
        Checkout
      </h1>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        
        {/* Input Interactive Forms Blocks */}
        <form onSubmit={placeOrder} className="flex flex-col gap-6">
          
          <Section step={1} title="Contact details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Ada Lovelace" />
              <Field label="Email address" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="you@email.com" />
            </div>
          </Section>

          <Section step={2} title="Payment">
            <div className="rounded-xl border border-white/5 bg-white/[0.01] p-3 text-xs text-slate-400 font-light tracking-wide backdrop-blur">
              🔒 This is a secure demo checkout vault. No real charge is made.
            </div>
            <div className="mt-4 grid gap-4">
              <Field
                label="Card number"
                value={form.card}
                onChange={(v) =>
                  setForm({
                    ...form,
                    card: v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim(),
                  })
                }
                placeholder="4242 4242 4242 4242"
              />
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Expiry"
                  value={form.exp}
                  onChange={(v) => {
                    const digits = v.replace(/\D/g, "").slice(0, 4);
                    const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
                    setForm({ ...form, exp: formatted });
                  }}
                  placeholder="MM/YY"
                />
                <Field label="CVC" value={form.cvc} onChange={(v) => setForm({ ...form, cvc: v.replace(/\D/g, "").slice(0, 4) })} placeholder="123" />
              </div>
            </div>
          </Section>

          {error ? (
            <p className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs font-semibold text-red-400">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-pink-600 px-6 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-violet-500/10 hover:opacity-95 transition-opacity disabled:opacity-50"
          >
            {submitting ? "Processing Flow Node…" : `Pay ${formatPrice(total)}`}
          </button>
        </form>

        {/* Sidebar Summary Dynamic Glass Panels Grid */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[2rem] border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent p-6 backdrop-blur-xl shadow-2xl">
            <h2 className="font-display text-lg font-bold text-white uppercase tracking-wider">Order summary</h2>
            <ul className="mt-6 flex flex-col gap-4">
              {items.map((i) => (
                <li key={i.slug} className="flex items-center gap-4 border-b border-white/5 pb-4 last:border-none last:pb-0">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-display text-xl text-white border border-white/10" style={{ background: i.accent }}>
                    {i.glyph}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-bold text-white">{i.title}</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">Qty {i.qty}</p>
                  </div>
                  <span className="text-sm font-bold text-white">{formatPrice(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>

            {/* Promo Inputs Fields Layout */}
            <div className="mt-6 border-t border-white/5 pt-4">
              {promoApplied ? (
                <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-xs">
                  <span className="font-bold text-emerald-400 uppercase tracking-wide">{promoCode} applied</span>
                  <button onClick={removePromo} className="text-xs font-semibold text-slate-500 hover:text-red-400 transition-colors">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Promo code"
                    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-zinc-950/60 px-4 py-2 text-xs text-white placeholder-slate-600 focus:border-violet-500 focus:outline-none"
                  />
                  <button onClick={handlePromo} className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-black hover:bg-slate-200 transition-colors">
                    Apply
                  </button>
                </div>
              )}
              {promoMsg && <p className="mt-2 text-[11px] text-slate-400 font-medium">{promoMsg}</p>}
            </div>

            {/* Pricing Summary Blocks Array */}
            <div className="mt-6 flex flex-col gap-2 border-t border-white/5 pt-4 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>SUBTOTAL</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>DISCOUNT (15%)</span>
                  <span>−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>TAX METRICS</span>
                <span>INCLUDED</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-white/5 pt-3 font-display text-xl font-extrabold text-white">
                <span className="font-sans text-sm font-bold tracking-wider text-slate-400 uppercase">TOTAL DUE</span>
                <span className="text-2xl tracking-tight font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}

function Section({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[2rem] border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent p-6 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center gap-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] font-black text-black">
          {step}
        </span>
        <h2 className="font-display text-base font-bold uppercase tracking-wider text-white">{title}</h2>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div className="w-full">
      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950/60 px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-violet-500 focus:outline-none transition-colors"
      />
    </div>
  );
}
