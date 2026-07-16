"use client";

import React, { useState } from "react";

// Mock Initial Data Engine Structure
const initialCourses = [
  { id: 1, title: "Next.js Masterclass", price: "499", slug: "nextjs-masterclass" },
  { id: 2, title: "AI Prompt Engineering", price: "299", slug: "ai-prompt-eng" },
  { id: 3, title: "Tailwind UI Mastery", price: "199", slug: "tailwind-ui" },
];

const initialCoupons = [
  { id: 1, code: "AFRUZSTORE10", discountPercent: 10, targetProductId: 1 },
  { id: 2, code: "GLOBALFREE", discountPercent: 100, targetProductId: null },
];

export default function MasterAdminDashboard() {
  // --- Core States Infrastructure ---
  const [activeTab, setActiveTab] = useState<"none" | "course" | "coupon">("none");
  const [courses, setCourses] = useState(initialCourses);
  const [coupons, setCoupons] = useState(initialCoupons);

  // Selection States for Editing Modules
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<any | null>(null);

  // Form Creation Input Controllers
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCoursePrice, setNewCoursePrice] = useState("");
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponDiscount, setNewCouponDiscount] = useState("");
  const [newCouponTarget, setNewCouponTarget] = useState("");

  // --- Actions Engine Pipelines ---

  // 1. Course Operations Actions
  const handleAddCourse = () => {
    if (!newCourseTitle || !newCoursePrice) return;
    const newId = courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1;
    setCourses([...courses, {
      id: newId,
      title: newCourseTitle,
      price: newCoursePrice,
      slug: newCourseTitle.toLowerCase().replace(/ /g, "-")
    }]);
    setNewCourseTitle("");
    setNewCoursePrice("");
  };

  const handleDeleteCourse = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents auto-selecting for edit when deleting
    setCourses(courses.filter(c => c.id !== id));
    if (selectedCourse?.id === id) setSelectedCourse(null);
  };

  const handleUpdateCourse = () => {
    if (!selectedCourse) return;
    setCourses(courses.map(c => c.id === selectedCourse.id ? selectedCourse : c));
    setSelectedCourse(null);
  };

  // 2. Coupon Operations Actions
  const handleAddCoupon = () => {
    if (!newCouponCode || !newCouponDiscount) return;
    const newId = coupons.length > 0 ? Math.max(...coupons.map(c => c.id)) + 1 : 1;
    setCoupons([...coupons, {
      id: newId,
      code: newCouponCode.toUpperCase(),
      discountPercent: Number(newCouponDiscount),
      targetProductId: newCouponTarget ? Number(newCouponTarget) : null
    }]);
    setNewCouponCode("");
    setNewCouponDiscount("");
    setNewCouponTarget("");
  };

  const handleDeleteCoupon = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCoupons(coupons.filter(c => c.id !== id));
    if (selectedCoupon?.id === id) setSelectedCoupon(null);
  };

  const handleUpdateCoupon = () => {
    if (!selectedCoupon) return;
    setCoupons(coupons.map(c => c.id === selectedCoupon.id ? selectedCoupon : c));
    setSelectedCoupon(null);
  };

  return (
    <div className="w-full min-h-screen bg-[#030303] text-slate-200 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Dashboard Title Header Block */}
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wider text-white">
            Store Master Vault
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Click any section box to access active management interfaces, perform database adjustments, and modify items.
          </p>
        </div>

        {/* --- STEP 1: Main Isolated Grids Grid Blocks --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* COURSE SELECTION CONTROL VAULT BOX */}
          <div 
            onClick={() => { setActiveTab("course"); setSelectedCoupon(null); }}
            className={`cursor-pointer group relative overflow-hidden rounded-[2rem] border p-8 backdrop-blur-xl transition-all duration-300 ${
              activeTab === "course" 
                ? "border-violet-500 bg-violet-500/[0.03] shadow-lg shadow-violet-500/5" 
                : "border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent hover:border-white/10"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-2xl">📚</span>
                <h2 className="mt-4 text-xl font-bold tracking-wide text-white group-hover:text-violet-400 transition-colors">
                  Course
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage digital curriculums, scale pricing models, and alter configuration attributes.
                </p>
              </div>
              <span className="text-xs font-mono bg-white/5 px-2.5 py-1 rounded-full text-slate-400">
                {courses.length} Active
              </span>
            </div>
          </div>

          {/* COUPON SELECTION CONTROL VAULT BOX */}
          <div 
            onClick={() => { setActiveTab("coupon"); setSelectedCourse(null); }}
            className={`cursor-pointer group relative overflow-hidden rounded-[2rem] border p-8 backdrop-blur-xl transition-all duration-300 ${
              activeTab === "coupon" 
                ? "border-emerald-500 bg-emerald-500/[0.03] shadow-lg shadow-emerald-500/5" 
                : "border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent hover:border-white/10"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-2xl">🎟️</span>
                <h2 className="mt-4 text-xl font-bold tracking-wide text-white group-hover:text-emerald-400 transition-colors">
                  Coupon
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Deploy promo validation patterns, link restrictions, and handle active price reduction metrics.
                </p>
              </div>
              <span className="text-xs font-mono bg-white/5 px-2.5 py-1 rounded-full text-slate-400">
                {coupons.length} In-Store
              </span>
            </div>
          </div>

        </div>

        {/* --- STEP 2: Conditional Active View Management Layouts --- */}
        {activeTab === "course" && (
          <div className="rounded-[2rem] border border-white/5 bg-zinc-950/40 p-6 space-y-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-sm font-bold tracking-wider text-white uppercase">📚 Inside Active Box: Course</h3>
              <button 
                onClick={() => { setActiveTab("none"); setSelectedCourse(null); }}
                className="text-xs text-slate-500 hover:text-white transition-colors"
              >
                [ Close Panel ]
              </button>
            </div>

            {/* Quick Add Form Section Inside Grid View */}
            <div className="grid gap-4 md:grid-cols-3 items-end p-4 rounded-2xl bg-white/[0.01] border border-white/5">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Course Name</label>
                <input type="text" value={newCourseTitle} onChange={(e) => setNewCourseTitle(e.target.value)} placeholder="e.g., Full Stack Dev" className="mt-1.5 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Price (INR)</label>
                <input type="number" value={newCoursePrice} onChange={(e) => setNewCoursePrice(e.target.value)} placeholder="e.g., 499" className="mt-1.5 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2.5 text-xs text-white focus:border-violet-500 focus:outline-none" />
              </div>
              <button onClick={handleAddCourse} className="w-full rounded-xl bg-white py-2.5 text-xs font-bold text-black hover:bg-slate-200 transition-colors">
                Add Course +
              </button>
            </div>

            {/* Interactive Courses Target List Rendering */}
            <div className="divide-y divide-white/5">
              {courses.map((course) => (
                <div 
                  key={course.id}
                  onClick={() => setSelectedCourse({ ...course })}
                  className={`flex items-center justify-between p-4 cursor-pointer rounded-xl transition-all ${
                    selectedCourse?.id === course.id ? "bg-white/[0.04] border border-white/10" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-white group-hover:text-violet-400">{course.title}</p>
                    <p className="text-[11px] text-slate-500 font-mono">ID: {course.id} • Price: ₹{course.price}</p>
                  </div>
                  <button 
                    onClick={(e) => handleDeleteCourse(course.id, e)}
                    className="text-[11px] font-bold uppercase tracking-wider text-red-400 hover:text-red-500 px-3 py-1 bg-red-500/10 rounded-lg border border-red-500/20 transition-all"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            {/* Dynamic Modify Layer Component Injection */}
            {selectedCourse && (
              <div className="p-4 rounded-2xl bg-violet-500/[0.02] border border-violet-500/20 space-y-4 animate-slideUp">
                <h4 className="text-xs font-bold text-violet-400 uppercase tracking-widest">⚙️ Modify Course Data Matrix</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500">Edit Title</label>
                    <input type="text" value={selectedCourse.title} onChange={(e) => setSelectedCourse({ ...selectedCourse, title: e.target.value })} className="mt-1.5 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2 text-xs text-white focus:border-violet-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500">Edit Price</label>
                    <input type="number" value={selectedCourse.price} onChange={(e) => setSelectedCourse({ ...selectedCourse, price: e.target.value })} className="mt-1.5 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2 text-xs text-white focus:border-violet-500 focus:outline-none" />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setSelectedCourse(null)} className="px-4 py-2 rounded-xl border border-white/10 text-xs hover:bg-white/5 transition-colors">Cancel</button>
                  <button onClick={handleUpdateCourse} className="px-4 py-2 rounded-xl bg-violet-600 font-bold text-white text-xs hover:bg-violet-700 transition-colors">Save Changes</button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "coupon" && (
          <div className="rounded-[2rem] border border-white/5 bg-zinc-950/40 p-6 space-y-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-sm font-bold tracking-wider text-white uppercase">🎟️ Inside Active Box: Coupon</h3>
              <button 
                onClick={() => { setActiveTab("none"); setSelectedCoupon(null); }}
                className="text-xs text-slate-500 hover:text-white transition-colors"
              >
                [ Close Panel ]
              </button>
            </div>

            {/* Quick Add Form Section Inside Grid View */}
            <div className="grid gap-4 md:grid-cols-4 items-end p-4 rounded-2xl bg-white/[0.01] border border-white/5">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Coupon Code</label>
                <input type="text" value={newCouponCode} onChange={(e) => setNewCouponCode(e.target.value)} placeholder="ZARAFIT" className="mt-1.5 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Discount %</label>
                <input type="number" value={newCouponDiscount} onChange={(e) => setNewCouponDiscount(e.target.value)} placeholder="15" className="mt-1.5 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Target Restriction</label>
                <select value={newCouponTarget} onChange={(e) => setNewCouponTarget(e.target.value)} className="mt-1.5 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none">
                  <option value="">✨ Global (All Courses)</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <button onClick={handleAddCoupon} className="w-full rounded-xl bg-white py-2.5 text-xs font-bold text-black hover:bg-slate-200 transition-colors">
                Add Coupon +
              </button>
            </div>

            {/* Interactive Coupon Action List Rendering */}
            <div className="divide-y divide-white/5">
              {coupons.map((coupon) => {
                const linkedCourse = courses.find(c => c.id === coupon.targetProductId);
                return (
                  <div 
                    key={coupon.id}
                    onClick={() => setSelectedCoupon({ ...coupon })}
                    className={`flex items-center justify-between p-4 cursor-pointer rounded-xl transition-all ${
                      selectedCoupon?.id === coupon.id ? "bg-white/[0.04] border border-white/10" : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-3">
                        <span className="bg-white/10 px-2 py-0.5 rounded text-[11px] font-mono text-white font-bold">{coupon.code}</span>
                        <span className="text-emerald-400 font-bold text-xs">{coupon.discountPercent}% OFF</span>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        SCOPE: <span className="text-slate-400">{linkedCourse ? `Restricted to "${linkedCourse.title}"` : "Global Scope"}</span>
                      </p>
                    </div>
                    <button 
                      onClick={(e) => handleDeleteCoupon(coupon.id, e)}
                      className="text-[11px] font-bold uppercase tracking-wider text-red-400 hover:text-red-500 px-3 py-1 bg-red-500/10 rounded-lg border border-red-500/20 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Dynamic Modify Layer Component Injection for Coupons */}
            {selectedCoupon && (
              <div className="p-4 rounded-2xl bg-emerald-500/[0.02] border border-emerald-500/20 space-y-4 animate-slideUp">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">⚙️ Modify Coupon Data Matrix</h4>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500">Edit Code</label>
                    <input type="text" value={selectedCoupon.code} onChange={(e) => setSelectedCoupon({ ...selectedCoupon, code: e.target.value.toUpperCase() })} className="mt-1.5 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500">Edit Discount %</label>
                    <input type="number" value={selectedCoupon.discountPercent} onChange={(e) => setSelectedCoupon({ ...selectedCoupon, discountPercent: Number(e.target.value) })} className="mt-1.5 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500">Edit Target Course</label>
                    <select value={selectedCoupon.targetProductId || ""} onChange={(e) => setSelectedCoupon({ ...selectedCoupon, targetProductId: e.target.value ? Number(e.target.value) : null })} className="mt-1.5 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none">
                      <option value="">Global Scope</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setSelectedCoupon(null)} className="px-4 py-2 rounded-xl border border-white/10 text-xs hover:bg-white/5 transition-colors">Cancel</button>
                  <button onClick={handleUpdateCoupon} className="px-4 py-2 rounded-xl bg-emerald-600 font-bold text-white text-xs hover:bg-emerald-700 transition-colors">Save Changes</button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
