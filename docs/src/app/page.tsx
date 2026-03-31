"use client";

import Link from "next/link";
import FlitterLogo from "@/components/flitter-logo";
import {
  VerticalToastBarChart,
} from "./chart/_data/bar-chart/toast/examples.generated";
import {
  NegativeVerticalAgBarChart,
} from "./chart/_data/bar-chart/ag/examples.generated";
import { DefaultToastLineChart } from "./chart/_data/line-chart/toast/examples.generated";
import { DefaultAgLineChart } from "./chart/_data/line-chart/ag/examples.generated";
import { DefaultToastAreaChart } from "./chart/_data/area-chart/toast/examples.generated";
import { RegionalRevenueToast as VerticalToastStackedBarChart } from "./chart/_data/stacked-bar-chart/toast/examples.generated";
import { DefaultToastScatterChart } from "./chart/_data/scatter-chart/toast/examples.generated";
import { BasicPieChart } from "./chart/_data/pie-chart/toast/examples.generated";

export default function Home() {
  return (
    <main className="overflow-hidden">
      {/* ── Hero ── */}
      <section className="relative px-6 pt-28 pb-16 text-center lg:px-16">
        <div className="mx-auto max-w-3xl">
          <div className="flex justify-center">
            <FlitterLogo size={60} />
          </div>
          <h1 className="mt-6 text-[3.5rem] font-black leading-[1.1] tracking-tight text-gray-900 sm:text-[4.5rem]">
            flitter
          </h1>
          <p className="mt-4 text-xl leading-relaxed text-gray-500 sm:text-2xl">
            Charts are widget trees. You own the source.
          </p>
          <p className="mt-3 text-base text-gray-400">
            A rendering engine that gives you Container, Stack, Text — not config objects. Add charts with a CLI command. Every sub-element is yours to replace.
          </p>

          {/* Stats buttons — like TanStack npm/github */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <a
              href="https://www.npmjs.com/package/flitter-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-[13px] font-medium text-gray-600 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="#CB3837">
                <path d="M0 4.2h14v5.6H7v.93H3.73V9.8H0V4.2zm1.87 3.73h.93V5.6h.93v2.33h.93V4.67H1.87v3.26zm4.66-3.26v4.2h1.87v-.94h1.87V4.67H6.53zm1.87.93h.93v1.4h-.93v-1.4zm2.8-.93v3.26h.93V5.6h.93v2.33h.93V5.6h.94v2.33h.93V4.67h-4.66z" />
              </svg>
              npm
            </a>
            <a
              href="https://github.com/meursyphus/flitter"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-[13px] font-medium text-gray-600 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ── Open Source Libraries ── */}
      <section className="px-6 pb-20 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-[13px] font-bold uppercase tracking-[0.15em] text-gray-400">
            Open Source Libraries
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {/* Chart — primary product */}
            <Link
              href="/chart"
              className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-teal-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M4 16V8M8 16V5M12 16V10M16 16V3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Chart</h3>
                  </div>
                </div>
                <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-600">
                  stable
                </span>
              </div>
              <p className="mt-3 text-[14px] leading-relaxed text-gray-500">
                Widget-composable chart library. 10+ chart types, multiple styles. Add with a CLI command — source code lands in your project.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[13px] font-medium text-teal-600 opacity-0 transition-opacity group-hover:opacity-100">
                Explore Charts
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 6h10M7 2l4 4-4 4" />
                </svg>
              </div>
            </Link>

            {/* Diagram — coming soon */}
            <div className="relative rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="6" height="5" rx="1" />
                      <rect x="12" y="13" width="6" height="5" rx="1" />
                      <path d="M5 7v3a2 2 0 002 2h3M15 13v-3a2 2 0 00-2-2h-3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-400">Diagram</h3>
                  </div>
                </div>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-400">
                  coming soon
                </span>
              </div>
              <p className="mt-3 text-[14px] leading-relaxed text-gray-400">
                Interactive diagram library built on the same widget composition engine. ERD, flowchart, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Chart Showcase Carousel ── */}
      <section className="border-t border-gray-100 bg-gray-50/60 py-14">
        <ChartCarouselStrip />
      </section>

      {/* ── What Becomes Possible ── */}
      <section className="px-6 py-24 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            What becomes possible when charts are widget trees
          </h2>
          <ul className="mt-10 space-y-4">
            {[
              "Click a bar to filter every other chart on the dashboard",
              "Long-press a data point to open an annotation editor",
              "Stream real-time values and watch bars animate into place",
              "Drill from yearly \u2192 quarterly \u2192 daily with a single tap",
              "Embed any React or Svelte component inside a tooltip",
              "Generate an entire custom chart by describing it to your AI assistant",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-gray-600">
                <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center text-sm leading-relaxed text-gray-400">
            None of these require plugins. They&apos;re possible because every element is a widget you control.
          </p>
        </div>
      </section>

      {/* ── Why Flitter ── */}
      <section className="px-6 py-24 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-[13px] font-bold uppercase tracking-[0.15em] text-gray-400">
            Why Flitter
          </h2>
          <p className="mt-4 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            A rendering engine, not a config wrapper.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-gray-500">
            Most chart libraries give you options objects. Flitter gives you a real widget tree — the same composition model that powers Flutter, running natively in your browser.
          </p>

          <div className="mt-16 grid gap-10 sm:grid-cols-2">
            {[
              {
                title: "Not Config. Widgets.",
                desc: "Every bar, axis, tooltip, and legend is a real widget \u2014 Container, Stack, Positioned, Text. Not an options object with 200 properties. A tree you can read, modify, and extend.",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="5" height="5" rx="1" />
                    <rect x="12" y="3" width="5" height="5" rx="1" />
                    <rect x="3" y="12" width="5" height="5" rx="1" />
                    <rect x="12" y="12" width="5" height="5" rx="1" />
                  </svg>
                ),
              },
              {
                title: "Source Code You Own",
                desc: "npx flitter-ui add bar-chart drops the full source into your project. There is no hidden runtime. Delete the CLI after install. It\u2019s your code now.",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6l-4-4z" />
                    <path d="M12 2v4h4" />
                    <path d="M10 10v4M8 12l2 2 2-2" />
                  </svg>
                ),
              },
              {
                title: "LLM Native",
                desc: "Feed one URL to Claude, Cursor, or Copilot. It reads the full widget API and generates charts end-to-end. A powerful shortcut when you want to move fast.",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 2v3M10 15v3M15 5l-2 2M7 13l-2 2M18 10h-3M5 10H2M15 15l-2-2M7 7L5 5" />
                    <circle cx="10" cy="10" r="2" />
                  </svg>
                ),
              },
              {
                title: "Complex Scenarios, Built In",
                desc: "Cross-filtering, drill-down, annotations, real-time updates \u2014 these aren\u2019t plugins. They\u2019re structurally possible because every element is a composable widget.",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 6h12M4 10h8M4 14h10" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="border-t border-gray-100 bg-gray-50/60 px-6 py-24 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-[13px] font-bold uppercase tracking-[0.15em] text-gray-400">
            Getting Started
          </h2>
          <p className="mt-4 text-center text-3xl font-bold tracking-tight text-gray-900">
            Three commands. Full control.
          </p>

          <div className="mt-14 space-y-8">
            {[
              {
                step: "1",
                title: "Initialize your project",
                code: "npx flitter-ui init",
                desc: "Sets up the Flitter config and installs the rendering engine.",
              },
              {
                step: "2",
                title: "Add a chart",
                code: "npx flitter-ui add bar-chart",
                desc: "Pulls the full chart source code into your project. Pick a style with --style toast or --style ag.",
              },
              {
                step: "3",
                title: "Make it yours",
                code: null,
                desc: "Open the source. Every axis label, grid line, and tooltip is a widget function. Swap the tooltip for a rich card. Add click handlers to bars. Build drill-down navigation. It\u2019s not configuration \u2014 it\u2019s composition.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-[13px] font-bold text-white">
                  {item.step}
                </div>
                <div className="pt-0.5">
                  <h3 className="text-[15px] font-bold text-gray-900">{item.title}</h3>
                  {item.code && (
                    <code className="mt-2 inline-block rounded-md border border-gray-200 bg-white px-3 py-1.5 text-[13px] text-gray-700">
                      <span className="text-teal-600">$</span> {item.code}
                    </code>
                  )}
                  <p className="mt-2 text-[14px] leading-relaxed text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Framework Support ── */}
      <section className="px-6 py-16 lg:px-16">
        <div className="mx-auto flex max-w-2xl items-center justify-center gap-10">
          <span className="text-[13px] font-medium text-gray-400">Works with</span>
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="#61DAFB">
              <circle cx="10" cy="10" r="2" />
              <ellipse cx="10" cy="10" rx="8" ry="3" fill="none" stroke="#61DAFB" strokeWidth="1" />
              <ellipse cx="10" cy="10" rx="8" ry="3" fill="none" stroke="#61DAFB" strokeWidth="1" transform="rotate(60 10 10)" />
              <ellipse cx="10" cy="10" rx="8" ry="3" fill="none" stroke="#61DAFB" strokeWidth="1" transform="rotate(120 10 10)" />
            </svg>
            <span className="text-[14px] font-medium text-gray-700">React</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="18" height="20" viewBox="0 0 256 308" fill="none">
              <path d="M239.682 40.707C211.113-.182 154.69-12.301 113.895 13.69L42.247 56.859a85.193 85.193 0 00-42.248 73.677 88.018 88.018 0 008.58 37.878A85.244 85.244 0 000 203.136a88.093 88.093 0 0015.223 49.883C43.815 308.28 100.236 320.399 141.03 294.408l71.648-43.169a85.193 85.193 0 0042.248-73.677 88.018 88.018 0 00-8.58-37.878 85.262 85.262 0 008.58-34.722 88.084 88.084 0 00-15.244-64.255z" fill="#FF3E00" transform="scale(0.07)" />
            </svg>
            <span className="text-[14px] font-medium text-gray-700">Svelte</span>
          </div>
          <span className="text-[13px] text-gray-400">Vue (coming)</span>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 px-6 py-10 lg:px-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <FlitterLogo size={18} />
            <span className="text-[13px] font-bold tracking-tight text-gray-400">flitter</span>
            <span className="text-[12px] text-gray-300">&copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/meursyphus/flitter"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-gray-400 transition-colors hover:text-gray-700"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/flitter-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-gray-400 transition-colors hover:text-gray-700"
            >
              npm
            </a>
            <a
              href="https://discord.gg/flitter"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-gray-400 transition-colors hover:text-gray-700"
            >
              Discord
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ── Infinite Carousel Strip ── */
const carouselCharts = [
  { el: <VerticalToastBarChart.Component />, label: "Bar" },
  { el: <DefaultToastLineChart.Component />, label: "Line" },
  { el: <DefaultToastAreaChart.Component />, label: "Area" },
  { el: <VerticalToastStackedBarChart.Component />, label: "Stacked Bar" },
  { el: <DefaultToastScatterChart.Component />, label: "Scatter" },
  { el: <BasicPieChart.Component />, label: "Pie" },
  { el: <NegativeVerticalAgBarChart.Component />, label: "Negative Values" },
  { el: <DefaultAgLineChart.Component />, label: "Line" },
];

function ChartCarouselStrip() {
  const items = [...carouselCharts, ...carouselCharts];
  return (
    <div className="carousel-container">
      <div className="carousel-track">
        {items.map((chart, i) => (
          <div key={i} className="carousel-item">
            <div className="h-[280px] overflow-hidden rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
              <div className="h-full w-full">{chart.el}</div>
            </div>
            <p className="mt-2 text-center text-[12px] font-medium text-gray-400">
              {chart.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
