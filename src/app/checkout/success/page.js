"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useState } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  // 💸 URL parameters se dynamic amount, course name aur ref code detect karega
  const amount = searchParams.get("amount") || "29"; 
  const course = searchParams.get("course") || "Premium Course";
  const reference = searchParams.get("ref") || "REF-" + Math.floor(100000 + Math.random() * 900000);

  // ⭐️ 5. INTERACTIVE REVIEW STATE
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-slate-100 flex items-center justify-center p-4 pt-28">
      <div className="relative w-full max-w-xl rounded-[2.5rem] border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent p-8 backdrop-blur-xl shadow-2xl text-center">
        
        {/* Top Emerald Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] bg-emerald-500/10 rounded-full blur-[40px] pointer-events-none" />

        {/* Dynamic Success Checkmark Trigger */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Payment Successful!
        </h1>
        <p className="mt-2 text-sm text-slate-400 font-light">
          Your course access parameters have been deployed safely.
        </p>

        {/* 💸 100% DYNAMIC INVOICE RECEIPT BOX */}
        <div className="mt-8 bg-white/[0.01] border border-white/5 rounded-2xl p-5 text-left space-y-3 font-mono text-xs">
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-slate-500">PRODUCT NAME:</span>
            <span className="text-white font-bold max-w-[220px] truncate uppercase">{course}</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-slate-500">AMOUNT PAID:</span>
            {/* 💥 YAHA RELECT HOGA EXACT PAUSED VALUE PARAMETER */}
            <span className="text-emerald-400 font-bold text-sm">₹{amount}.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">TRANSACTION ID:</span>
            <span className="text-slate-300 select-all">{reference}</span>
          </div>
        </div>

        {/* ⭐️ 5. CLIENT-SIDE REVIEW SYSTEM */}
        <div className="mt-8 border-t border-white/5 pt-6 text-left">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Leave a Quick Review</h3>
          {!submitted ? (
            <form onSubmit={handleReviewSubmit} className="mt-3 space-y-3">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-xl transition-transform active:scale-95 ${star <= rating ? "text-amber-400" : "text-slate-600"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <input
                type="text"
                required
                placeholder="How was your checkout experience?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full rounded-xl border border-white/5 bg-zinc-950/60 px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-violet-500 focus:outline-none"
              />
              <button type="submit" className="w-full rounded-xl bg-white py-2 text-xs font-bold text-black hover:bg-slate-200 transition-colors">
                Submit Feedback
              </button>
            </form>
          ) : (
            <p className="mt-3 text-xs text-violet-400 font-medium animate-fade-in">✓ Thanks for making AfruzStore better! 🔥</p>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <Link href="/products" className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:opacity-90 transition-opacity">
            Go To My Dashboard →
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030303] flex items-center justify-center text-slate-400">Loading receipt stream...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
