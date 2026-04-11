"use client";

import { galleryEntries } from "../_data/gallery";
import LiveCandlestickDemo from "./live-candlestick-demo";

const DISPLAY_FONT = "var(--font-display), Georgia, serif";

const previewCharts = galleryEntries.slice(0, 8);

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
      {/* ═══════════════════════════════════════════
          Brand Banner — dark, rose accent, chart carousel
          ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gray-950 py-14 sm:py-18 lg:py-20">
        <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_1fr]">
            {/* Left — Title */}
            <div>
              <h1
                className="text-[clamp(3rem,7vw,5.5rem)] font-black leading-[1] tracking-tight text-white"
                style={{ fontFamily: DISPLAY_FONT }}
              >
                Flitter{" "}
                <span className="text-rose-500">Chart</span>
              </h1>
              <p className="mt-4 max-w-md text-lg text-gray-400">
                shadcn-style chart library. Install via CLI, own the source, customize everything.
              </p>
            </div>

            {/* Right — Single column vertical scroll carousel */}
            <div className="hidden lg:block relative h-[480px] overflow-hidden">
              {/* Dim effect top & bottom */}
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-gray-950 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-gray-950 to-transparent" />

              <div className="chart-vertical-scroll flex flex-col gap-4">
                {[...previewCharts, ...previewCharts].map((entry, i) => (
                  <div
                    key={i}
                    className="shrink-0 overflow-hidden rounded-lg bg-white p-4"
                  >
                    <img
                      src={entry.thumbnailUrl}
                      alt={entry.title}
                      className="h-full w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          Hero — shadcn approach: CLI + own the code
          ═══════════════════════════════════════════ */}
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-12 sm:pt-24 sm:pb-16">
        <h2
          className="text-[clamp(2rem,4.5vw,3.5rem)] font-black leading-[1.08] tracking-tight text-gray-900"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          No lock-in.{" "}
          <span className="text-rose-500">Full custom.</span>
        </h2>

        <div className="mt-8">
          {cliCodeBlock}
        </div>

        <div className="mt-8">
          <a
            href="/chart/gallery"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-rose-500 px-7 text-[14px] font-semibold text-white transition-all hover:bg-rose-600"
          >
            Browse Charts
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          Benefits — Code only, minimal text
          ═══════════════════════════════════════════ */}
      <section className="mx-auto max-w-5xl px-6 pb-20 sm:pb-28">
        <div className="grid gap-16 md:grid-cols-2 md:gap-12">
          {/* Benefit 1: Customize */}
          <div>
            <h3
              className="text-[clamp(1.4rem,2.5vw,2rem)] font-black tracking-tight text-gray-900"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              Replace any part
            </h3>
            {customCodeBlock}
          </div>

          {/* Benefit 2: Own the code */}
          <div>
            <h3
              className="text-[clamp(1.4rem,2.5vw,2rem)] font-black tracking-tight text-gray-900"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              Own the source
            </h3>
            {ownCodeBlock}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          Demo Slot 1
          ═══════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-6 pb-20 sm:pb-28">
        <h2
          className="mb-6 text-[clamp(1.8rem,3.5vw,2.8rem)] font-black leading-[1.08] tracking-tight text-gray-900"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          See what&apos;s possible
        </h2>
        <div className="h-[480px] overflow-hidden rounded-lg border border-gray-200 bg-white">
          <LiveCandlestickDemo />
        </div>
      </section>

      <style jsx>{`
        .chart-vertical-scroll {
          animation: scrollUp 30s linear infinite;
        }
        @keyframes scrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .chart-vertical-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
