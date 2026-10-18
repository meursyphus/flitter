"use client";

import { useState } from "react";
import LiveDiagram from "@/components/live-diagram";
import { exampleFactories } from "../_examples";
import type { ExampleSlug } from "../_examples/catalog";

export default function ExamplePreview({ slug, compact = false }: { slug: ExampleSlug; compact?: boolean }) {
  const [renderer, setRenderer] = useState<"svg" | "canvas">("svg");
  const [revision, setRevision] = useState(0);
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-[var(--chart-bg)]" data-example={slug}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-3 py-2">
        <span className="text-xs text-faint">Drag, select & zoom</span>
        <div className="flex gap-1">
          {(["svg", "canvas"] as const).map((value) => (
            <button key={value} type="button" aria-pressed={renderer === value} onClick={() => setRenderer(value)}
              className={`rounded px-2 py-1 text-xs font-medium ${renderer === value ? "bg-accent text-on-accent" : "text-soft hover:bg-surface"}`}>
              {value === "svg" ? "SVG" : "Canvas"}
            </button>
          ))}
          <button type="button" onClick={() => setRevision((value) => value + 1)} className="rounded px-2 py-1 text-xs text-soft hover:bg-surface">Reset</button>
        </div>
      </div>
      <div className={compact ? "h-[300px]" : "h-[420px] sm:h-[540px]"}>
        <LiveDiagram key={`${renderer}-${revision}`} create={exampleFactories[slug]} renderer={renderer} lazy />
      </div>
    </div>
  );
}
