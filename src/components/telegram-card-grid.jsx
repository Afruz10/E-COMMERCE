"use client";

import React from "react";

export function TelegramCardGrid() {
  const handleAction = (buttonLabel) => {
    console.log(`Action triggered for: ${buttonLabel}`);
    // Yahan tum custom functions or redirection links assign kar sakte ho
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 select-none">
      {/* 🌌 Main Transparent Glass Container */}
      <div className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-gradient-to-b from-zinc-950/40 to-black/80 backdrop-blur-xl shadow-2xl p-6">
        
        {/* Glow Element Effect */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-violet-500/10 rounded-full blur-[50px] pointer-events-none" />

        {/* 📝 Header Text Section (Tailored for AfruzStore Aesthetics) */}
        <div className="space-y-4 text-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xl">👋</span>
            <h2 className="text-lg font-bold text-white tracking-wide uppercase">
              AfruzStore Node
            </h2>
          </div>
          
          <p className="text-sm text-slate-300 font-light leading-relaxed">
            Welcome to the automated control hub. Acquire your courses instantly with secure checkout transitions and deploy modules directly to your dashboard.
          </p>

          <p className="text-xs text-slate-400 border-l-2 border-violet-500/50 pl-3 italic">
            All code engines and server actions are updated. Read the documentation before launching API updates.
          </p>
        </div>

        {/* 🎛️ Dynamic Button Matrix Layout (Exact Grid Match!) */}
        <div className="mt-8 space-y-2">
          
          {/* Row 1: Full-width Accent Trigger */}
          <button
            onClick={() => handleAction("Global Deploy")}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/[0.08] hover:border-white/20 transition-all active:scale-98"
          >
            <span>✨</span> Access Global Courses <span>✨</span>
          </button>

          {/* Row 2: Two Columns Layout Grid */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleAction("Track Orders")}
              className="flex items-center justify-between py-3.5 px-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-white transition-all active:scale-98"
            >
              <span className="flex items-center gap-2">📦 Track Status</span>
              <span className="text-[10px] text-slate-500 font-mono">↗</span>
            </button>
            <button
              onClick={() => handleAction("Support Node")}
              className="flex items-center justify-between py-3.5 px-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-white transition-all active:scale-98"
            >
              <span className="flex items-center gap-2">💬 Live Chat</span>
              <span className="text-[10px] text-slate-500 font-mono">↗</span>
            </button>
          </div>

          {/* Row 3: Two Columns Secondary Grid */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleAction("Active Promo Code")}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-white transition-all active:scale-98"
            >
              <span>🎟️</span> Coupons Hub
            </button>
            <button
              onClick={() => handleAction("Review Feedback")}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-white transition-all active:scale-98"
            >
              <span>⭐</span> Write Reviews
            </button>
          </div>

          {/* Row 4: Single Center Utility Anchor Button */}
          <button
            onClick={() => handleAction("Change Language")}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white/[0.01] border border-white/5 text-[11px] font-medium tracking-wide text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all active:scale-98"
          >
            🌐 Switch Language Interface 🌐
          </button>

        </div>
      </div>
    </div>
  );
}
