"use client";

import { useEffect, useState } from "react";
import LiveDiagram from "@/components/live-diagram";
import { findEntry, type ExampleFactory } from "../_data/gallery/catalog";

/** A gallery example, loaded on demand, with SVG/Canvas and reset controls. */
export default function ExamplePreview({ slug, presentation = "gallery" }: { slug: string; presentation?: "gallery" | "hero" }) {
  const entry = findEntry(slug);
  const [create, setCreate] = useState<ExampleFactory | null>(null);
  const [renderer, setRenderer] = useState<"svg" | "canvas">("svg");
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let live = true;
    entry?.load?.().then((module) => {
      if (live) setCreate(() => (theme: Parameters<ExampleFactory>[0]) => module.default(theme, { presentation }));
    });
    return () => {
      live = false;
    };
  }, [entry, presentation]);

  return (
    <div
      className="overflow-hidden rounded-xl border border-line bg-[var(--chart-bg)]"
      data-example={slug}
      data-presentation={presentation}
    >
      <div className="flex justify-end gap-1 border-b border-line px-3 py-2">
        {(["svg", "canvas"] as const).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={renderer === value}
            onClick={() => setRenderer(value)}
            className={`rounded px-2 py-1 text-xs font-medium ${renderer === value ? "bg-accent text-on-accent" : "text-soft hover:bg-surface"}`}
          >
            {value === "svg" ? "SVG" : "Canvas"}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setRevision((value) => value + 1)}
          className="rounded px-2 py-1 text-xs text-soft hover:bg-surface"
        >
          Reset
        </button>
      </div>
      <div data-diagram-stage className={presentation === "hero" ? "h-[300px] sm:h-[380px]" : "h-[320px] sm:h-[540px]"}>
        {create && (
          <LiveDiagram key={`${renderer}-${revision}`} create={create} renderer={renderer} lazy inspectLayout />
        )}
      </div>
    </div>
  );
}
