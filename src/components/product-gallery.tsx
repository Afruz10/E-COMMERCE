"use client";

import { useState } from "react";
import { CourseCover } from "@/components/course-cover";
import type { ProductDTO } from "@/lib/types";

export function ProductGallery({ product }: { product: ProductDTO }) {
  const slides = [
    { key: "cover", glyph: product.glyph, label: "Overview" },
    { key: "curriculum", glyph: "❏", label: "Curriculum" },
    { key: "outcomes", glyph: "✓", label: "Outcomes" },
    { key: "instructor", glyph: "✦", label: "Instructor" },
  ];
  const [active, setActive] = useState(0);
  const current = slides[active];

  return (
    <div>
      <div className="overflow-hidden rounded-3xl shadow-lift">
        <CourseCover
          accent={product.accent}
          glyph={current.glyph}
          title={
            active === 0
              ? product.title
              : active === 1
                ? `${product.lessons} lessons · ${product.durationHours}h`
                : active === 2
                  ? "What you'll achieve"
                  : product.instructor
          }
          level={active === 0 ? product.level : current.label}
          className="aspect-[4/3] w-full"
          size="lg"
        />
      </div>
      <div className="mt-3 grid grid-cols-4 gap-3">
        {slides.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setActive(i)}
            className={`overflow-hidden rounded-2xl border-2 transition-all ${
              i === active
                ? "border-violet scale-[1.02]"
                : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <CourseCover
              accent={product.accent}
              glyph={s.glyph}
              title=""
              className="aspect-square w-full"
              size="sm"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
