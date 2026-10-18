import Link from "next/link";
import ExamplePreview from "./example-preview";
import GalleryGrid from "./gallery-grid";
import { HighlightedCode, OVERVIEW_CODE } from "./code-blocks";

const POINTS = [
  ["The engine owns interactions.", "Drag, connect, undo, copy, context menu and touch work with zero config."],
  ["You own every widget.", "Nodes, edges, handles, menus and guides are builders you replace."],
  ["One copied theme.", "The CLI copies its source into your project to edit."],
];

export default function DiagramLanding() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-line">
        <div className="artboard pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 md:px-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:py-20">
          <div>
            <h1 className="wordmark text-[clamp(3rem,6.5vw,5.25rem)] leading-[0.92] text-ink">
              Flitter
              <br />
              <span className="text-script">Diagram</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-soft">
              Editor-grade interactions built in. Every pixel is your widget.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/diagram/gallery" className="inline-flex h-11 items-center rounded-lg bg-accent px-5 text-sm font-semibold text-on-accent hover:opacity-90">
                Browse the gallery
              </Link>
              <Link href="/diagram/interactions" className="inline-flex h-11 items-center rounded-lg border border-line-strong px-5 text-sm font-semibold text-ink hover:bg-surface">
                Try the interactions
              </Link>
            </div>
          </div>
          <ExamplePreview slug="automation-workflow" presentation="hero" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 md:px-10">
        <ul className="grid gap-6 md:grid-cols-3">
          {POINTS.map(([title, body]) => (
            <li key={title} className="border-l-2 border-script pl-4">
              <p className="font-semibold text-ink">{title}</p>
              <p className="mt-1 text-sm text-soft">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 md:px-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="display text-[clamp(1.75rem,3.5vw,2.5rem)] text-ink">Gallery</h2>
          <Link href="/diagram/gallery" className="text-sm font-semibold text-accent hover:underline">All examples →</Link>
        </div>
        <GalleryGrid limit={6} />
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-20 md:px-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="display text-[clamp(1.75rem,3.5vw,2.5rem)] text-ink">Quick start</h2>
          <Link href="/diagram/installation" className="text-sm font-semibold text-accent hover:underline">Install →</Link>
        </div>
        <HighlightedCode code={OVERVIEW_CODE} lang="tsx" />
      </section>
    </div>
  );
}
