import Link from "next/link";
import ExamplePreview from "./example-preview";
import GalleryGrid from "./gallery-grid";
import { HighlightedCode } from "./code-blocks";
import { listedEntries } from "../_data/gallery/catalog";

const CUSTOM = `FlowDiagram({
  data,
  custom: {
    node: ({ label, isSelected }) => Container({
      padding: EdgeInsets.all(16),
      color: isSelected ? "#ede9fe" : "#ffffff",
      child: label,
    }),
  },
});`;
const COMPOSE = `custom: {
  controls: ({ zoomIn, zoomOut, fitView }) => Row({
    mainAxisSize: MainAxisSize.min,
    children: [zoomOut, fitView, zoomIn],
  }),
}`;
const FEATURES = [
  [
    "Widgets all the way down",
    "Replace a node, a button or the parent layout. Each slot returns a Flitter widget.",
  ],
  [
    "SVG or Canvas",
    "The same widget tree renders in either mode. Switch renderers without rewriting your UI.",
  ],
  [
    "Interaction built in",
    "Drag, connect, select and undo are wired by the engine. Your widgets decide how they look.",
  ],
];
export default function DiagramLanding() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-line">
        <div
          className="artboard pointer-events-none absolute inset-0"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 md:px-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:py-20">
          <div>
            <h1 className="wordmark text-[clamp(3.25rem,8vw,6rem)] leading-[0.92] text-ink">
              Flitter
              <br />
              <span className="text-script">Diagram</span>
            </h1>
            <p className="mt-6 max-w-md text-[18px] leading-relaxed text-soft">
              Diagrams you install as source code. Start with a preset, own
              every widget, change any part.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/diagram/gallery"
                className="inline-flex h-11 items-center rounded-lg bg-accent px-6 text-[15px] font-semibold text-on-accent hover:opacity-90"
              >
                Browse the gallery
              </Link>
              <Link
                href="/diagram/installation"
                className="inline-flex h-11 items-center rounded-lg border border-line-strong px-6 text-[15px] font-semibold text-ink hover:bg-surface"
              >
                Install
              </Link>
            </div>
            <dl className="mt-10 flex gap-8 border-t border-line pt-6">
              <div>
                <dt className="text-[13px] text-faint">Examples</dt>
                <dd className="display mt-1 text-[28px] text-ink">
                  {listedEntries.length}
                </dd>
              </div>
              <div>
                <dt className="text-[13px] text-faint">Renderers</dt>
                <dd className="display mt-1 text-[28px] text-ink">
                  SVG + Canvas
                </dd>
              </div>
            </dl>
          </div>
          <ExamplePreview slug="custom-nodes" presentation="hero" />
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-10 lg:py-28">
        <h2 className="display text-[clamp(2rem,4vw,3rem)] text-ink">
          Own the source. Replace any widget.
        </h2>
        <div className="mt-5 grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <p className="max-w-md text-[16px] leading-relaxed text-soft">
            The CLI copies the preset into your project, just like Flitter
            charts. Config adjusts the defaults. Custom builders replace the
            widgets. The engine keeps the interaction behavior.
          </p>
          <HighlightedCode code="npx @flitterjs/cli@latest add flow-diagram" lang="bash" />
        </div>
        <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-8">
          <div>
            <h3 className="text-[18px] font-semibold text-ink">
              Replace one part
            </h3>
            <p className="mt-2 mb-5 text-[15px] leading-relaxed text-soft">
              Use the built label, draw a new node, keep drag and selection.
            </p>
            <HighlightedCode code={CUSTOM} lang="typescript" />
          </div>
          <div>
            <h3 className="text-[18px] font-semibold text-ink">
              Compose the children
            </h3>
            <p className="mt-2 mb-5 text-[15px] leading-relaxed text-soft">
              Arrange buttons that already work. Replace their parent without
              rewiring their actions.
            </p>
            <HighlightedCode code={COMPOSE} lang="typescript" />
          </div>
        </div>
        <Link
          href="/diagram/quick-start"
          className="mt-8 inline-block text-sm font-semibold text-accent hover:underline"
        >
          Explore the widget tree →
        </Link>
      </section>
      <section className="border-y border-line bg-surface/50">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3 md:px-10">
          {FEATURES.map(([title, body]) => (
            <div key={title} className="border-l-2 border-script pl-5">
              <h3 className="text-[16px] font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-soft">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-[clamp(2rem,4vw,3rem)] text-ink">
            From the gallery
          </h2>
          <Link
            href="/diagram/gallery"
            className="text-[15px] font-semibold text-accent hover:underline"
          >
            See all {listedEntries.length} examples
          </Link>
        </div>
        <GalleryGrid limit={6} />
      </section>
    </div>
  );
}
