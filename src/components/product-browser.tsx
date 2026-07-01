"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import type { CategoryDTO, ProductDTO } from "@/lib/types";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "popular", label: "Most popular" },
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const levels = ["Beginner", "Intermediate", "Advanced", "All levels"];

export function ProductBrowser({
  products,
  categories,
  initialCategory,
}: {
  products: ProductDTO[];
  categories: CategoryDTO[];
  initialCategory?: string;
}) {
  const [category, setCategory] = useState<string>(initialCategory ?? "all");
  const [level, setLevel] = useState<string>("all");
  const [sort, setSort] = useState<string>("featured");
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [query, setQuery] = useState<string>("");

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== "all")
      list = list.filter((p) => p.categorySlug === category);
    if (level !== "all") list = list.filter((p) => p.level === level);
    list = list.filter((p) => p.price <= maxPrice);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.instructor.toLowerCase().includes(q),
      );
    }
    switch (sort) {
      case "popular":
        list.sort((a, b) => b.enrolled - a.enrolled);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return list;
  }, [products, category, level, maxPrice, query, sort]);

  const reset = () => {
    setCategory("all");
    setLevel("all");
    setSort("featured");
    setMaxPrice(200);
    setQuery("");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      {/* Sidebar filters */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl border border-ink/8 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Filters</h2>
            <button
              onClick={reset}
              className="text-xs font-medium text-violet hover:underline"
            >
              Reset
            </button>
          </div>

          <div className="mt-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink/45">
              Search
            </label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses…"
              className="mt-2 w-full rounded-xl border border-ink/12 bg-paper px-3 py-2 text-sm focus:border-violet focus:outline-none"
            />
          </div>

          <Filter title="Category">
            <FilterPill
              active={category === "all"}
              onClick={() => setCategory("all")}
            >
              All categories
            </FilterPill>
            {categories.map((c) => (
              <FilterPill
                key={c.slug}
                active={category === c.slug}
                onClick={() => setCategory(c.slug)}
                accent={c.accent}
              >
                {c.name}
              </FilterPill>
            ))}
          </Filter>

          <Filter title="Level">
            <FilterPill active={level === "all"} onClick={() => setLevel("all")}>
              Any level
            </FilterPill>
            {levels.map((l) => (
              <FilterPill
                key={l}
                active={level === l}
                onClick={() => setLevel(l)}
              >
                {l}
              </FilterPill>
            ))}
          </Filter>

          <Filter title={`Max price: $${maxPrice}`}>
            <input
              type="range"
              min={30}
              max={200}
              step={10}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-violet"
            />
            <div className="flex justify-between text-xs text-ink/45">
              <span>$30</span>
              <span>$200</span>
            </div>
          </Filter>
        </div>
      </aside>

      {/* Results */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink/8 bg-white px-4 py-3 shadow-soft">
          <p className="text-sm text-ink/60">
            <span className="font-semibold text-ink">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "course" : "courses"}
          </p>
          <div className="flex items-center gap-2">
            <label className="text-sm text-ink/55">Sort by</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-ink/12 bg-paper px-3 py-2 text-sm font-medium focus:border-violet focus:outline-none"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-ink/15 bg-white py-20 text-center">
            <p className="text-4xl">🔍</p>
            <p className="mt-3 font-display text-lg font-semibold">
              No courses match your filters
            </p>
            <button
              onClick={reset}
              className="mt-4 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-cream"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Filter({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5 border-t border-ink/8 pt-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">
        {title}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
  accent,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-transparent text-white"
          : "border-ink/12 text-ink/65 hover:border-ink/30"
      }`}
      style={active ? { background: accent ?? "#0e1020" } : undefined}
    >
      {children}
    </button>
  );
}
