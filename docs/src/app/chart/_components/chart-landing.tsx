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
        <div
          className="artboard pointer-events-none absolute inset-0"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[620px] rounded-full blur-[120px]"
          style={{
            background: "var(--chart)",
            opacity: "calc(var(--glow) * 0.5)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 md:px-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:py-20">
          <div>
            <h1 className="wordmark text-[clamp(3.25rem,8vw,6rem)] leading-[0.92] text-ink">
              Flitter
              <br />
              <span className="text-chart">Chart</span>
            </h1>

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
          </div>

          <ChartPlayground />
        </div>
      </section>

      {/* Ownership */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-10 lg:py-28">
        <h2 className="display text-[clamp(2rem,4vw,3rem)] text-ink">
          Make it yours
        </h2>
        <div className="mt-5 grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <div>{cliCodeBlock}</div>
        </div>

        <details className="mt-8 rounded-xl border border-line p-5">
          <summary className="cursor-pointer text-base text-soft">
            Customization code
          </summary>
          <div className="mt-6 grid gap-10 md:grid-cols-2 md:gap-8">
            <div>
              <h3 className="text-[18px] font-semibold text-ink">
                Replace any part
              </h3>
              {customCodeBlock}
            </div>
            <div>
              <h3 className="text-[18px] font-semibold text-ink">
                Own the source
              </h3>
              {ownCodeBlock}
            </div>
          </div>
        </details>
      </section>

      {/* Canvas demo */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-10 lg:py-28">
        <h2 className="display text-[clamp(2rem,4vw,3rem)] text-ink">
          Bitcoin, 2014 to 2024, on Canvas
        </h2>
        <div className="mt-8 h-[480px] overflow-hidden rounded-2xl border border-line bg-[var(--chart-bg)] p-4">
          <LiveCandlestickDemo />
        </div>
      </section>

      {/* Gallery preview */}
      <section className="mx-auto max-w-6xl px-5 pb-24 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-[clamp(2rem,4vw,3rem)] text-ink">
            Gallery
          </h2>
          <Link
            href="/chart/gallery"
            className="text-[15px] font-semibold text-chart underline-offset-4 hover:underline"
          >
            View all →
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
