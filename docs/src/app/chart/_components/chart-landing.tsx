"use client";

import Link from "next/link";
import { galleryCategories, galleryEntries } from "../_data/gallery";
import ChartPlayground from "./chart-playground";
import GalleryCard from "./gallery-card";
import LiveCandlestickDemo from "./live-candlestick-demo";

/** One of each chart type, in gallery order. */
const previewEntries = galleryCategories
  .map((c) => galleryEntries.find((e) => e.chartType === c.id)!)
  .slice(0, 6);

const FEATURES = [
  {
    title: "Two styles, one data shape",
    body: "Every chart ships as AG and Toast. Swap the style flag and the same data renders in the other look.",
  },
  {
    title: "SVG or Canvas",
    body: "Charts are Flitter widget trees, so either renderer draws them. Use Canvas for dense, frequently updated data.",
  },
  {
    title: "Interaction built in",
    body: "Hover states, tooltips and legend toggles are wired by the headless engine. Styles only decide how they look.",
  },
];

export default function ChartLanding({
  cliCodeBlock,
  customCodeBlock,
  ownCodeBlock,
}: {
  cliCodeBlock?: React.ReactNode;
  customCodeBlock?: React.ReactNode;
  ownCodeBlock?: React.ReactNode;
}) {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="artboard pointer-events-none absolute inset-0" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[620px] rounded-full blur-[120px]"
          style={{ background: "var(--chart)", opacity: "calc(var(--glow) * 0.5)" }}
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 md:px-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:py-20">
          <div>
            <h1 className="wordmark text-[clamp(3.25rem,8vw,6rem)] leading-[0.92] text-ink">
              Flitter
              <br />
              <span className="text-chart">Chart</span>
            </h1>
            <p className="mt-6 max-w-md text-[18px] leading-relaxed text-soft">
              Charts you install as source code. Pick a style, own every line,
              change any part.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/chart/gallery"
                className="inline-flex h-11 items-center rounded-lg bg-chart px-6 text-[15px] font-semibold text-on-accent transition-opacity hover:opacity-90"
              >
                Browse the gallery
              </Link>
              <Link
                href="/chart/installation"
                className="inline-flex h-11 items-center rounded-lg border border-line-strong px-6 text-[15px] font-semibold text-ink transition-colors hover:bg-surface"
              >
                Install
              </Link>
            </div>

            <dl className="mt-10 flex gap-8 border-t border-line pt-6">
              <div>
                <dt className="text-[13px] text-faint">Chart types</dt>
                <dd className="display mt-1 text-[28px] text-ink">{galleryCategories.length}</dd>
              </div>
              <div>
                <dt className="text-[13px] text-faint">Styles each</dt>
                <dd className="display mt-1 text-[28px] text-ink">2</dd>
              </div>
              <div>
                <dt className="text-[13px] text-faint">Renderers</dt>
                <dd className="display mt-1 text-[28px] text-ink">2</dd>
              </div>
            </dl>
          </div>

          <ChartPlayground />
        </div>
      </section>

      {/* Ownership */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-10 lg:py-28">
        <h2 className="display text-[clamp(2rem,4vw,3rem)] text-ink">
          No lock-in. Full custom.
        </h2>
        <div className="mt-5 grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <p className="max-w-md text-[16px] leading-relaxed text-soft">
            The CLI copies the chart into your project, the way shadcn/ui does.
            There is no chart package to upgrade around, just files you can
            read and edit.
          </p>
          <div>{cliCodeBlock}</div>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-8">
          <div>
            <h3 className="text-[18px] font-semibold text-ink">Replace any part</h3>
            <p className="mt-2 mb-5 text-[15px] leading-relaxed text-soft">
              Bars, axes, legends and tooltips are builder functions. Pass your
              own and keep the rest.
            </p>
            {customCodeBlock}
          </div>
          <div>
            <h3 className="text-[18px] font-semibold text-ink">Own the source</h3>
            <p className="mt-2 mb-5 text-[15px] leading-relaxed text-soft">
              Each part lives in its own file. Change the look once and every
              chart that uses it follows.
            </p>
            {ownCodeBlock}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-line bg-surface/50">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3 md:px-10">
          {FEATURES.map((f) => (
            <div key={f.title} className="border-l-2 border-chart pl-5">
              <h3 className="text-[16px] font-semibold text-ink">{f.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-soft">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Canvas demo */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-10 lg:py-28">
        <h2 className="display text-[clamp(2rem,4vw,3rem)] text-ink">
          Bitcoin, 2014 to 2024, on Canvas
        </h2>
        <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-soft">
          Monthly Bitcoin prices drawn with the Canvas renderer. Move across the
          chart for the crosshair and price callouts.
        </p>
        <div className="mt-8 h-[480px] overflow-hidden rounded-2xl border border-line bg-[var(--chart-bg)] p-4">
          <LiveCandlestickDemo />
        </div>
      </section>

      {/* Gallery preview */}
      <section className="mx-auto max-w-6xl px-5 pb-24 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-[clamp(2rem,4vw,3rem)] text-ink">From the gallery</h2>
          <Link
            href="/chart/gallery"
            className="text-[15px] font-semibold text-chart underline-offset-4 hover:underline"
          >
            See all {galleryEntries.length} examples
          </Link>
        </div>
        <div className="mt-8 grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(min(100%,440px),1fr))]">
          {previewEntries.map((entry) => (
            <GalleryCard key={entry.slug} entry={entry} />
          ))}
        </div>
      </section>
    </div>
  );
}
