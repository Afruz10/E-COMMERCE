"use client";

import { useState } from "react";
import { Stars } from "@/components/stars";
import type { ReviewDTO } from "@/lib/types";

export function ReviewsSection({
  slug,
  initialReviews,
  rating,
  reviewCount,
}: {
  slug: string;
  initialReviews: ReviewDTO[];
  rating: number;
  reviewCount: number;
}) {
  const [reviews, setReviews] = useState<ReviewDTO[]>(initialReviews);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    author: "",
    role: "",
    rating: 5,
    title: "",
    body: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const dist = [5, 4, 3, 2, 1].map((star) => {
    const c = reviews.filter((r) => r.rating === star).length;
    return { star, count: c, pct: reviews.length ? (c / reviews.length) * 100 : 0 };
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.author.trim() || !form.title.trim() || !form.body.trim()) {
      setError("Please fill in your name, a title, and your review.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, productSlug: slug }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setReviews((prev) => [data.review as ReviewDTO, ...prev]);
      setForm({ author: "", role: "", rating: 5, title: "", body: "" });
      setOpen(false);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="reviews" className="scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-3xl font-semibold tracking-tight">
          Student reviews
        </h2>
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream transition-transform hover:scale-[1.03]"
        >
          {open ? "Close" : "Write a review"}
        </button>
      </div>

      <div className="mt-6 grid gap-8 rounded-3xl border border-ink/8 bg-white p-6 shadow-soft sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="text-center sm:border-r sm:border-ink/8 sm:pr-8">
          <p className="font-display text-5xl font-bold">{rating.toFixed(1)}</p>
          <Stars rating={rating} size={18} className="mt-2 justify-center" />
          <p className="mt-1 text-xs text-ink/50">{reviewCount} ratings</p>
        </div>
        <div className="flex flex-col gap-2">
          {dist.map((d) => (
            <div key={d.star} className="flex items-center gap-3 text-sm">
              <span className="w-12 shrink-0 text-ink/55">{d.star} star</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/8">
                <div
                  className="h-full rounded-full bg-gold transition-all"
                  style={{ width: `${d.pct}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right text-xs text-ink/45">
                {d.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {open ? (
        <form
          onSubmit={submit}
          className="mt-6 rounded-3xl border border-ink/8 bg-cream/50 p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                Your name
              </label>
              <input
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-ink/12 bg-white px-3 py-2 text-sm focus:border-violet focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                Your role (optional)
              </label>
              <input
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="e.g. Developer"
                className="mt-1.5 w-full rounded-xl border border-ink/12 bg-white px-3 py-2 text-sm focus:border-violet focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink/50">
              Rating
            </label>
            <div className="mt-1.5 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm({ ...form, rating: n })}
                  className="text-2xl"
                  aria-label={`${n} stars`}
                >
                  <span
                    className={n <= form.rating ? "text-gold" : "text-ink/20"}
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink/50">
              Title
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-ink/12 bg-white px-3 py-2 text-sm focus:border-violet focus:outline-none"
            />
          </div>
          <div className="mt-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink/50">
              Your review
            </label>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={4}
              className="mt-1.5 w-full rounded-xl border border-ink/12 bg-white px-3 py-2 text-sm focus:border-violet focus:outline-none"
            />
          </div>
          {error ? <p className="mt-3 text-sm text-rose">{error}</p> : null}
          <button
            type="submit"
            disabled={submitting}
            className="mt-4 rounded-full bg-violet px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03] disabled:opacity-60"
          >
            {submitting ? "Posting…" : "Post review"}
          </button>
        </form>
      ) : null}

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {reviews.map((r) => (
          <figure
            key={r.id}
            className="rounded-3xl border border-ink/8 bg-white p-6 shadow-soft"
          >
            <div className="flex items-center justify-between">
              <Stars rating={r.rating} size={15} />
              <span className="text-xs text-ink/40">
                {new Date(r.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <h4 className="mt-3 font-display text-base font-semibold">
              {r.title}
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">{r.body}</p>
            <figcaption className="mt-4 flex items-center gap-3 border-t border-ink/8 pt-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-display text-sm font-semibold text-cream">
                {r.author[0]}
              </span>
              <div>
                <p className="text-sm font-semibold">{r.author}</p>
                {r.role ? (
                  <p className="text-xs text-ink/50">{r.role}</p>
                ) : null}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
