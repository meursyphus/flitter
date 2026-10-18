"use client";

import { useState } from "react";
import Link from "next/link";
import { categories, examples } from "../_examples/catalog";
import ExamplePreview from "./example-preview";

export default function DiagramGallery({ featured = false }: { featured?: boolean }) {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const entries = featured ? examples.filter((entry) => ["workflow", "organization", "service-map", "headless"].includes(entry.slug))
    : examples.filter((entry) => category === "All" || entry.category === category);

  return (
    <div>
      {!featured && (
        <div role="group" aria-label="Filter examples by use case" className="mb-7 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}
              className={`rounded-full border px-4 py-2 text-sm ${category === item ? "border-accent bg-accent text-on-accent" : "border-line text-soft hover:border-line-strong"}`}>
              {item}
            </button>
          ))}
        </div>
      )}
      <p className="sr-only" aria-live="polite">{entries.length} examples</p>
      <div className="grid gap-x-6 gap-y-10 xl:grid-cols-2">
        {entries.map((entry) => (
          <article key={entry.slug} className="min-w-0">
            <ExamplePreview slug={entry.slug} compact />
            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-faint">{entry.layout}</p>
            <h3 className="mt-1 text-lg font-semibold text-ink">
              <Link href={`/diagram/gallery/${entry.slug}`} className="hover:text-accent">{entry.title}</Link>
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-soft">{entry.description}</p>
            <Link href={`/diagram/gallery/${entry.slug}`} className="mt-3 inline-block text-sm font-semibold text-accent hover:underline">Explore & customize →</Link>
          </article>
        ))}
      </div>
    </div>
  );
}
