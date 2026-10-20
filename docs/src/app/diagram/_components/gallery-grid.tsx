"use client";

import { useState } from "react";
import { listedEntries, categories } from "../_data/gallery/catalog";
import GalleryCard from "./gallery-card";

/** Listed gallery entries; `filter` adds chip filters by interaction. */
export default function GalleryGrid({
  filter = false,
  limit,
}: {
  filter?: boolean;
  limit?: number;
}) {
  const [active, setActive] = useState<string | null>(null);
  const entries = listedEntries
    .filter((entry) => !active || entry.category === active)
    .slice(0, limit);
  const pill = (pressed: boolean) =>
    `rounded-full border px-4 py-2 text-sm transition-colors ${pressed ? "border-accent bg-accent text-on-accent" : "border-line text-soft hover:border-line-strong"}`;

  return (
    <div>
      {filter && (
        <div
          role="group"
          aria-label="Filter by application"
          className="mb-7 flex flex-wrap gap-2"
        >
          <button
            type="button"
            aria-pressed={active === null}
            onClick={() => setActive(null)}
            className={pill(active === null)}
          >
            All
          </button>
          {categories.map((chip) => (
            <button
              key={chip}
              type="button"
              aria-pressed={active === chip}
              onClick={() => setActive(chip)}
              className={pill(active === chip)}
            >
              {chip}
            </button>
          ))}
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        {entries.length} examples
      </p>
      <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(min(100%,440px),1fr))]">
        {entries.map((entry) => (
          <GalleryCard key={entry.slug} entry={entry} />
        ))}
      </div>
    </div>
  );
}
