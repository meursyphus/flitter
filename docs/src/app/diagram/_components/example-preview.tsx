"use client";

import { useEffect, useState } from "react";
import LiveDiagram from "@/components/live-diagram";
import { findEntry, type ExampleFactory } from "../_data/gallery/catalog";

/** A gallery example, loaded on demand, with SVG/Canvas and reset controls. */
export default function ExamplePreview({
  slug,
  presentation = "gallery",
}: {
  slug: string;
  presentation?: "gallery" | "hero";
}) {
  const entry = findEntry(slug);
  const [create, setCreate] = useState<ExampleFactory | null>(null);
  const [renderer, setRenderer] = useState<"svg" | "canvas">("svg");
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let live = true;
    entry?.load?.().then((module) => {
      if (live)
        setCreate(
          () => (theme: Parameters<ExampleFactory>[0]) =>
            module.default(theme, { presentation }),
        );
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
      <div className="flex items-center justify-between gap-8 border-b border-line px-4 py-2.5">
        <div
          role="group"
          aria-label="Renderer"
          className="inline-flex rounded-lg border border-line bg-surface p-0.5"
        >
          {(["svg", "canvas"] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={renderer === value}
              onClick={() => setRenderer(value)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${renderer === value ? "bg-ink text-canvas" : "text-soft hover:text-ink"}`}
            >
              {value === "svg" ? "SVG" : "Canvas"}
            </button>
          ))}
        </div>
        <div className="border-l border-line pl-4">
          <button
            type="button"
            onClick={() => setRevision((value) => value + 1)}
            className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-soft hover:bg-surface hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2.5 8a5.5 5.5 0 0 1 9.3-4M13.5 8a5.5 5.5 0 0 1-9.3 4M11 1.5L12 4l-2.5.5M5 14.5L4 12l2.5-.5" />
            </svg>
            Reset
          </button>
        </div>
      </div>
      <div
        data-diagram-stage
        className={
          presentation === "hero"
            ? "h-[340px] sm:h-[520px]"
            : "h-[340px] sm:h-[600px]"
        }
      >
        {!create && (
          <div
            role="status"
            className="flex h-full items-center justify-center text-sm text-faint"
          >
            Loading…
          </div>
        )}
        {create && (
          <LiveDiagram
            key={`${renderer}-${revision}`}
            create={create}
            renderer={renderer}
            lazy
            inspectLayout
          />
        )}
      </div>
    </div>
  );
}
