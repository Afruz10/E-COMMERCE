"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart-context";
import { formatPrice } from "@/lib/format";

type SuccessOrder = {
  reference: string;
  name: string;
  email: string;
  total: number;
};

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
  const [success, setSuccess] = useState<SuccessOrder | null>(null);

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
          promoCode: promoApplied ? promoCode : "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setSuccess({
        reference: data.order.reference,
        name: data.order.name,
        email: data.order.email,
        total: data.order.total,
      });
      clear();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <div className="animate-fade-up rounded-3xl border border-ink/8 bg-white p-10 shadow-lift">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-mint/15 text-4xl text-mint">
            ✓
          </div>
          <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">
            Thank you, {success.name.split(" ")[0]}!
          </h1>
          <p className="mt-3 text-ink/65">
            Your order is confirmed. We&apos;ve sent your course access details to{" "}
            <span className="font-semibold text-ink">{success.email}</span>.
          </p>
          <div className="mt-6 inline-flex flex-col gap-1 rounded-2xl bg-cream/60 px-6 py-4">
            <span className="text-xs uppercase tracking-wide text-ink/45">
              Order reference
            </span>
            <span className="font-display text-xl font-bold">
              {success.reference}
            </span>
            <span className="text-sm text-ink/60">
              Total paid: {formatPrice(success.total)}
            </span>
          </div>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/products"
              className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream transition-transform hover:scale-[1.03]"
            >
              Continue learning
            </Link>
            <Link
              href="/"
              className="rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink hover:bg-ink/5"
            >
              Back home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (hydrated && items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <div className="text-5xl">🛒</div>
        <h1 className="mt-5 font-display text-3xl font-semibold">
          Your cart is empty
        </h1>
        <p className="mt-2 text-ink/60">
          Add a course before heading to checkout.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream transition-transform hover:scale-[1.03]"
        >
          Browse courses
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link
        href="/products"
        className="text-sm text-ink/50 hover:text-ink"
      >
        ← Continue shopping
      </Link>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
        Checkout
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* form */}
        <form onSubmit={placeOrder} className="flex flex-col gap-6">
          <Section step={1} title="Contact details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Full name"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                placeholder="Ada Lovelace"
              />
              <Field
                label="Email address"
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                placeholder="you@email.com"
              />
            </div>
          </Section>

          <Section step={2} title="Payment">
            <div className="rounded-2xl border border-ink/8 bg-cream/40 p-3 text-xs text-ink/55">
              🔒 This is a secure demo checkout. No real charge is made.
            </div>
            <div className="mt-4 grid gap-4">
              <Field
                label="Card number"
                value={form.card}
                onChange={(v) =>
                  setForm({
                    ...form,
                    card: v
                      .replace(/\D/g, "")
                      .slice(0, 16)
                      .replace(/(.{4})/g, "$1 ")
                      .trim(),
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
                    const formatted =
                      digits.length > 2
                        ? `${digits.slice(0, 2)}/${digits.slice(2)}`
                        : digits;
                    setForm({ ...form, exp: formatted });
                  }}
                  placeholder="MM/YY"
                />
                <Field
                  label="CVC"
                  value={form.cvc}
                  onChange={(v) =>
                    setForm({ ...form, cvc: v.replace(/\D/g, "").slice(0, 4) })
                  }
                  placeholder="123"
                />
              </div>
            </div>
          </Section>

          {error ? (
            <p className="rounded-xl bg-rose/10 px-4 py-3 text-sm font-medium text-rose">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-violet px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-violet/25 transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            {submitting ? "Processing…" : `Pay ${formatPrice(total)}`}
          </button>
          <p className="text-center text-xs text-ink/45">
            By placing your order you agree to our terms. 30-day money-back
            guarantee.
          </p>
        </form>

        {/* summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-ink/8 bg-white p-6 shadow-soft">
            <h2 className="font-display text-lg font-semibold">Order summary</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {items.map((i) => (
                <li key={i.slug} className="flex items-center gap-3">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-display text-xl text-white"
                    style={{ background: i.accent }}
                  >
                    {i.glyph}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-semibold">
                      {i.title}
                    </p>
                    <p className="text-xs text-ink/50">Qty {i.qty}</p>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatPrice(i.price * i.qty)}
                  </span>
                </li>
              ))}
            </ul>

            {/* promo */}
            <div className="mt-5 border-t border-ink/8 pt-4">
              {promoApplied ? (
                <div className="flex items-center justify-between rounded-xl bg-mint/10 px-3 py-2 text-sm">
                  <span className="font-medium text-mint">
                    {promoCode} applied
                  </span>
                  <button
                    onClick={removePromo}
                    className="text-xs text-ink/50 hover:text-rose"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <input
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code"
                      className="min-w-0 flex-1 rounded-xl border border-ink/12 bg-paper px-3 py-2 text-sm focus:border-violet focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handlePromo}
                      className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-cream"
                    >
                      Apply
                    </button>
                  </div>
                  {promoMsg ? (
                    <p className="mt-2 text-xs text-ink/55">{promoMsg}</p>
                  ) : null}
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-1.5 border-t border-ink/8 pt-4 text-sm">
              <div className="flex justify-between text-ink/65">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {promoApplied ? (
                <div className="flex justify-between text-mint">
                  <span>Discount (15%)</span>
                  <span>−{formatPrice(discount)}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-ink/65">
                <span>Tax</span>
                <span>Included</span>
              </div>
              <div className="mt-1 flex justify-between border-t border-ink/8 pt-2 font-display text-xl font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-ink/45">
            <span>🔒 Secure</span>
            <span>♻ 30-day refund</span>
            <span>∞ Lifetime access</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-ink/8 bg-white p-6 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-bold text-cream">
          {step}
        </span>
        <h2 className="font-display text-lg font-semibold">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-ink/50">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl border border-ink/12 bg-paper px-3 py-2.5 text-sm focus:border-violet focus:outline-none"
      />
    </div>
  );
}
