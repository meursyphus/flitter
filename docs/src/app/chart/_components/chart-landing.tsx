import Link from "next/link";
import ChartCarousel from "./chart-carousel";
import { chartShowcase } from "./chart-showcase";

function Principle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-1.5">
      <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
      <p className="text-sm leading-relaxed text-neutral-500">{description}</p>
    </div>
  );
}

export default function ChartLanding() {
  return (
    <div className="-mx-6 -mt-8 md:-mx-10">
      {/* Hero */}
      <section className="relative px-6 pt-14 pb-10 md:px-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Charts
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-neutral-600">
            This is not a chart config wrapper.{" "}
            <span className="font-semibold text-neutral-900">
              It&apos;s a rendering engine.
            </span>
          </p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-500">
            Every chart is built from composable widgets — the same primitives
            that power the core engine. You get the source code. You own it.
            Modify anything.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-neutral-50 border border-neutral-200 px-4 py-2">
              <code className="text-sm text-neutral-600">
                <span className="text-teal-500">$</span> npx flitter add bar-chart
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="px-6 pb-10 md:px-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Principle
            title="Widget Composition"
            description="Charts are trees of widgets — Container, Stack, Positioned, Text — not opaque config objects. Swap any part."
          />
          <Principle
            title="Source Code You Own"
            description="Run npx flitter add and the full source lands in your project. No hidden internals. Read it, change it, learn from it."
          />
          <Principle
            title="Framework Agnostic"
            description="Pure JavaScript core. Use it standalone, or plug into React or Svelte with a one-line integration package."
          />
          <Principle
            title="LLM Native"
            description="Feed the chart spec to your AI assistant and let it generate, customize, or explain any chart for you."
          />
        </div>
      </section>

      {/* LLM Native badge */}
      <section className="px-6 pb-8 md:px-10">
        <div className="inline-flex items-center gap-3 rounded-lg border border-teal-100 bg-teal-50 px-4 py-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round">
              <path d="M6 1v10M1 6h10" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-teal-700">LLM Native</p>
            <p className="text-[11px] text-teal-600">
              Feed <code className="font-mono">ui.flitter.dev/llm/chart.md</code> to your AI assistant
            </p>
          </div>
        </div>
      </section>

      {/* Chart grid */}
      <section className="px-6 pb-16 md:px-10">
        <h2 className="mb-6 text-xl font-bold tracking-tight text-neutral-900">
          Browse Charts
        </h2>
        <ChartCarousel charts={chartShowcase} />
      </section>
    </div>
  );
}
