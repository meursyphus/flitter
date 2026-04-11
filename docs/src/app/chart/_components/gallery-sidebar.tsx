"use client";

import { useState, useEffect, useRef } from "react";

type GallerySidebarProps = {
  categories: { id: string; label: string }[];
  todoCategories: string[];
};

function toLabel(id: string) {
  return id
    .replace(/-chart$/, "")
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

export default function GallerySidebar({
  categories,
  todoCategories,
}: GallerySidebarProps) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    );

    for (const cat of categories) {
      const el = document.getElementById(cat.id);
      if (el) observerRef.current.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, [categories]);

  return (
    <nav className="sticky top-20 hidden w-44 shrink-0 lg:block">
      <ul className="space-y-0.5">
        {categories.map((cat) => (
          <li key={cat.id}>
            <a
              href={`#${cat.id}`}
              className={`block rounded-md px-3 py-1.5 text-[13px] transition-colors ${
                activeId === cat.id
                  ? "bg-neutral-100 font-medium text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50"
              }`}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById(cat.id)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
                setActiveId(cat.id);
              }}
            >
              {cat.label}
            </a>
          </li>
        ))}

        {todoCategories.length > 0 && (
          <>
            <li className="pt-3 pb-1 px-3">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-300">
                Coming Soon
              </span>
            </li>
            {todoCategories.map((id) => (
              <li key={id}>
                <span className="block px-3 py-1.5 text-[13px] text-neutral-300 cursor-default">
                  {toLabel(id)}
                </span>
              </li>
            ))}
          </>
        )}
      </ul>
    </nav>
  );
}
