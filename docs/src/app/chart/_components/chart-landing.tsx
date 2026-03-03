import Link from "next/link";
import ChartCarousel from "./chart-carousel";
import { chartShowcase } from "./chart-showcase";

export default function ChartLanding() {
  return (
    <div className="-mx-6 -mt-8 md:-mx-10">
      {/* Hero */}
      <section className="relative px-6 pt-20 pb-16 md:px-10">
        <div className="dot-pattern pointer-events-none absolute inset-0 opacity-20" />

        <div className="relative max-w-2xl">
          <h1
            className="animate-fade-up text-4xl tracking-tight text-neutral-900 sm:text-5xl"
            style={{ animationDelay: "0.1s" }}
          >
            <span
              className="italic text-neutral-700"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Every style you've seen,
            </span>
            <br />
            <span className="font-bold">all in one library.</span>
          </h1>
          <p
            className="animate-fade-up mt-5 max-w-lg text-base leading-relaxed text-neutral-500"
            style={{ animationDelay: "0.25s" }}
          >
            Styles from every chart library — paid or free — rebuilt here.
            <br className="hidden sm:block" />
            All features, all open source.
          </p>
          <div
            className="animate-fade-up mt-8 flex items-center gap-4"
            style={{ animationDelay: "0.4s" }}
          >
            <Link
              href="/chart/getting-started"
              className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-neutral-700 hover:shadow-lg hover:shadow-neutral-900/10"
            >
              Get Started
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 7h12M8 2l5 5-5 5" />
              </svg>
            </Link>
            <a
              href="https://github.com/meursyphus/flitter"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-600 transition-all hover:border-neutral-400 hover:text-neutral-900"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* LLM Native */}
      <section className="px-6 py-12 md:px-10">
        <div
          className="animate-fade-up max-w-2xl"
          style={{ animationDelay: "0.5s" }}
        >
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-400">
            LLM Native
          </p>
          <p className="mt-3 text-lg tracking-tight text-neutral-900 sm:text-xl">
            <span
              className="italic text-neutral-700"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Paste the URL,
            </span>{" "}
            <span className="font-bold">your AI sets it up.</span>
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-neutral-400"
            >
              <path d="M10 1.5H11.5A1.5 1.5 0 0 1 13 3v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 1 11V3a1.5 1.5 0 0 1 1.5-1.5H4" />
              <path d="M5 1h4v2H5z" />
            </svg>
            <code className="text-sm text-neutral-600">
              ui.flitter.dev/llm/chart.md
            </code>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            Feed this to Claude Code or Cursor and get a fully configured chart
            in seconds.
          </p>
        </div>
      </section>

      {/* Accent line */}
      <div className="accent-line mx-6 md:mx-10" />

      {/* Chart demos — infinite carousel */}
      <section className="py-16">
        <div className="px-6 md:px-10">
          <p
            className="animate-fade-up text-xs font-medium uppercase tracking-widest text-neutral-400"
            style={{ animationDelay: "0.6s" }}
          >
            All Charts
          </p>
          <p
            className="animate-fade-up mt-3 text-lg tracking-tight text-neutral-900 sm:text-xl"
            style={{ animationDelay: "0.7s" }}
          >
            <span className="font-bold">Multiple styles,</span>{" "}
            <span
              className="italic text-neutral-700"
              style={{ fontFamily: "var(--font-display)" }}
            >
              one library.
            </span>
          </p>
        </div>

        <div
          className="animate-fade-up mt-8 w-full overflow-hidden px-6 md:px-10"
          style={{ animationDelay: "0.8s" }}
        >
          <ChartCarousel charts={chartShowcase} />
        </div>
      </section>
    </div>
  );
}
