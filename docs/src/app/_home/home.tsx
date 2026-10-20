"use client";

import Link from "next/link";
import CopyCommand from "@/components/copy-command";
import FlitterLogo from "@/components/flitter-logo";
import LiveChart from "@/components/live-chart";
import LiveDiagram from "@/components/live-diagram";
import {
  DISCORD_URL,
  GITHUB_REPO_URL,
  INSTALL_COMMAND,
  NPM_URL,
} from "@/lib/site-config";
import { galleryCategories, galleryEntries } from "../chart/_data/gallery";
import { createLandingDiagram } from "./landing-diagram";
import { Counter } from "./counter";

/** Server-highlighted HTML for each code panel (see ../page.tsx). */
export type HomeCode = { hero: string; flutter: string; flitter: string };

/** The hero renders ./counter.ts, the same file its code panel shows. */
const createCounter = () => new Counter();

/** One example per chart type, the most visual ones first. */
const reelOrder = [
  "treemap",
  "area",
  "bubble",
  "pie",
  "radar",
  "heatmap",
  "candlestick",
];
const reelEntries = galleryCategories
  .map((c) => galleryEntries.find((e) => e.chartType === c.id)!)
  .sort((a, b) => {
    const rank = (id: string) => {
      const i = reelOrder.findIndex((t) => id.startsWith(t));
      return i === -1 ? reelOrder.length : i;
    };
    return rank(a.chartType) - rank(b.chartType);
  });

/** Editor-style frame around server-highlighted code; follows the site theme. */
function CodeWindow({
  filename,
  html,
  className = "",
  bodyClassName = "",
}: {
  filename: string;
  html: string;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <figure className={`code-surface overflow-hidden rounded-xl ${className}`}>
      <figcaption className="flex items-center gap-2 border-b border-line px-4 py-2.5 font-sans text-[12px] text-faint">
        <span className="h-2 w-2 rounded-full bg-script" aria-hidden="true" />
        {filename}
      </figcaption>
      <div
        className={`overflow-auto text-[12px] leading-[1.6] [&_pre]:px-4 [&_pre]:py-3 ${bodyClassName}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
}

/* ── Hero ─────────────────────────────────────────────── */

function IntroSection({ code }: { code: HomeCode }) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        className="artboard pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-40 top-10 h-[460px] w-[560px] rounded-full blur-[130px]"
        style={{
          background: "var(--brand)",
          opacity: "calc(var(--glow) * 0.55)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[520px] rounded-full blur-[130px]"
        style={{
          background: "var(--chart)",
          opacity: "calc(var(--glow) * 0.45)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1400px] px-5 pt-16 pb-20 sm:px-10 lg:pt-24 lg:pb-24 xl:px-14">
        <div className="grid grid-cols-[minmax(0,1fr)] items-end gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] xl:gap-12">
          <h1 className="display text-[clamp(2.75rem,6.4vw,5rem)] leading-[0.98] text-ink [font-stretch:100%] xl:text-[clamp(3rem,4.4vw,4.75rem)]">
            <span className="text-script">JavaScript</span>{" "}
            <span className="text-chart">Rendering</span>
            <br />
            for <span className="text-brand">Data Visualization</span>
          </h1>

          <div>
            <p className="max-w-[30rem] text-[18px] leading-relaxed text-soft">
              Charts, diagrams, and UI. SVG or Canvas.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/chart"
                className="inline-flex h-11 items-center rounded-lg bg-brand px-6 text-[15px] font-semibold text-on-accent transition-opacity hover:opacity-90"
              >
                Explore Flitter Chart
              </Link>
              <Link
                href="/advanced/what-is-flitter"
                className="inline-flex h-11 items-center rounded-lg border border-line-strong px-6 text-[15px] font-semibold text-ink transition-colors hover:bg-surface"
              >
                Read the docs
              </Link>
            </div>

            <CopyCommand command={INSTALL_COMMAND} className="mt-6" />
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-xl border border-line bg-[var(--chart-bg)]">
          <div className="h-[320px]">
            <LiveDiagram create={createCounter} />
          </div>
          <details className="border-t border-line p-4">
            <summary className="cursor-pointer text-base text-soft">
              Source code
            </summary>
            <CodeWindow
              filename="counter.ts"
              html={code.hero}
              className="mt-4"
            />
          </details>
        </div>
      </div>
    </section>
  );
}

/* ── Libraries ────────────────────────────────────────── */

function LibrariesSection() {
  const previewEntry = galleryEntries.find(
    (e) => e.slug === "bar-chart-toast-department-revenue",
  )!;

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-10 lg:py-28 xl:px-14">
      <div className="max-w-2xl">
        <h2 className="display text-[clamp(2rem,4vw,3.25rem)] text-ink">
          Built with Flitter
        </h2>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        {/* Chart: the preview is live, so the card is not one big link */}
        <div
          data-product="chart"
          className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface p-7 transition-colors hover:border-chart/60 lg:row-span-2"
        >
          <div className="flex items-center justify-between">
            <span className="wordmark text-[26px] text-ink">
              FLITTER <span className="text-chart">CHART</span>
            </span>
          </div>
          <div className="mt-6 min-h-[260px] flex-1 overflow-hidden rounded-xl border border-line bg-[var(--chart-bg)] p-3">
            <LiveChart
              create={previewEntry.createWidget}
              animate={false}
              lazy
            />
          </div>
          <Link
            href="/chart"
            className="mt-5 self-start text-[15px] font-semibold text-chart hover:underline"
          >
            Open Flitter Chart →
          </Link>
        </div>

        {/* Core */}
        <Link
          href="/advanced/what-is-flitter"
          data-product="core"
          className="group flex flex-col rounded-2xl border border-line bg-surface p-7 transition-colors hover:border-core/60"
        >
          <span className="wordmark text-[26px] text-ink">
            FLITTER <span className="text-core">CORE</span>
          </span>
          <pre className="mt-5 overflow-x-auto rounded-lg border border-line bg-canvas px-4 py-3 text-[13px] leading-relaxed text-soft">
            <code className="!border-0 !bg-transparent !p-0">
              <span className="text-core">Container</span>({"{"}
              {"\n"}
              {"  "}padding: EdgeInsets.<span className="text-core">all</span>
              (16),{"\n"}
              {"  "}child: <span className="text-core">Text</span>(
              <span className="text-ok">&quot;Hello, canvas&quot;</span>),{"\n"}
              {"}"})
            </code>
          </pre>
          <span className="mt-5 text-[15px] font-semibold text-core group-hover:underline">
            Read the core docs →
          </span>
        </Link>

        {/* Diagram: live and editable in place (drag, connect, undo) */}
        <div
          data-product="diagram"
          className="group flex flex-col rounded-2xl border border-line bg-surface p-7 transition-colors hover:border-script/60"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="wordmark text-[26px] text-ink">
              FLITTER <span className="text-script">DIAGRAM</span>
            </span>
          </div>
          <div className="mt-5 h-52 overflow-hidden rounded-lg border border-line bg-[var(--chart-bg)]">
            <LiveDiagram create={createLandingDiagram} lazy />
          </div>
          <Link
            href="/diagram"
            className="mt-5 self-start text-[15px] font-semibold text-script hover:underline"
          >
            Open Flitter Diagram →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Reel of live charts ──────────────────────────────── */

function ReelSection() {
  const items = [...reelEntries, ...reelEntries];

  return (
    <section className="border-y border-line bg-surface/40 py-20 lg:py-24">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-end justify-between gap-6 px-5 sm:px-10 xl:px-14">
        <div className="max-w-xl">
          <h2 className="display text-[clamp(2rem,4vw,3.25rem)] text-ink">
            Charts
          </h2>
        </div>
        <Link
          href="/chart/gallery"
          className="text-[15px] font-semibold text-chart underline-offset-4 hover:underline"
        >
          Browse all {galleryEntries.length} examples
        </Link>
      </div>

      <div
        className="reel mt-12"
        style={{ ["--reel-duration" as string]: "120s" }}
      >
        <div className="reel-track">
          {items.map((entry, i) => (
            <div
              key={`${entry.slug}-${i}`}
              aria-hidden={i >= reelEntries.length || undefined}
              className="w-[340px] shrink-0 overflow-hidden rounded-xl border border-line bg-[var(--chart-bg)] transition-colors hover:border-line-strong sm:w-[440px]"
            >
              <div className="h-[260px] p-3 sm:h-[300px]">
                <LiveChart create={entry.createWidget} animate={false} lazy />
              </div>
              <Link
                href={`/chart/gallery/${entry.slug}`}
                tabIndex={i >= reelEntries.length ? -1 : undefined}
                className="flex items-center justify-between gap-3 border-t border-line px-4 py-2.5 hover:bg-surface"
              >
                <span className="truncate text-base font-medium text-ink">
                  {entry.title} →
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Flutter → Flitter ────────────────────────────────── */

function WhySection({ code }: { code: HomeCode }) {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-10 lg:py-28 xl:px-14">
      <div className="max-w-2xl">
        <h2 className="display text-[clamp(2rem,4vw,3.25rem)] text-ink">
          Flutter&apos;s API, written in JavaScript
        </h2>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-ink">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="#027DFD"
              aria-hidden="true"
            >
              <path d="M14.314 0L2.3 12 6 15.7 21.684 0h-7.357zm0 11.066L7.758 17.38l2.39 2.39 4.17-4.17 5.32-5.32-1.324-1.214z" />
            </svg>
            Flutter
            <span className="font-normal text-faint">Dart</span>
          </div>
          <CodeWindow filename="profile_card.dart" html={code.flutter} />
        </div>
        <div>
          <div className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-ink">
            <FlitterLogo size={16} />
            Flitter
            <span className="font-normal text-faint">JavaScript</span>
          </div>
          <CodeWindow filename="profile-card.ts" html={code.flitter} />
        </div>
      </div>
    </section>
  );
}

/* ── In production ────────────────────────────────────── */

function ProductionSection() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-10 lg:py-28 xl:px-14">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-2xl">
            <h2 className="display text-[clamp(2rem,4vw,3.25rem)] text-ink">
              Running in production at{" "}
              <a
                href="https://easyrd.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-core underline decoration-core/40 underline-offset-[6px] hover:decoration-core"
              >
                easyrd.dev
              </a>
            </h2>
          </div>
        </div>
        <div className="mt-10 overflow-hidden rounded-2xl border border-line">
          <img
            className="w-full"
            src="/home/easyrd.jpg"
            alt="easyrd: a DBML editor on the left, an ERD drawn by Flitter on the right"
          />
        </div>
      </div>
    </section>
  );
}

/* ── Maintainer ───────────────────────────────────────── */

function MaintainerSection() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 py-20 sm:px-10 md:grid-cols-[280px_minmax(0,1fr)] lg:py-28">
        <img
          src="/home/maintainer.jpeg"
          alt="Daeseung Moon"
          className="aspect-square w-full max-w-[280px] rounded-2xl object-cover object-top"
        />
        <div>
          <h2 className="flex items-center gap-3 text-[28px] font-bold tracking-tight text-ink">
            Daeseung Moon
            <a
              href="https://www.linkedin.com/in/%EB%AC%B8%EB%8C%80%EC%8A%B9/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-soft transition-colors hover:text-[#0A66C2]"
              aria-label="Daeseung Moon on LinkedIn"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </h2>

          <a
            href="https://ssgoi.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex items-center gap-4 rounded-xl border border-line p-3 transition-colors hover:border-line-strong"
          >
            <img
              src="https://ssgoi.dev/og.png"
              alt=""
              className="h-16 w-28 shrink-0 rounded-md object-cover"
            />
            <span className="min-w-0">
              <span className="block text-[15px] font-semibold text-ink">
                Also by Daeseung: ssgoi
              </span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Closing call to action ───────────────────────────── */

function LastSection() {
  return (
    <section className="relative overflow-hidden border-t border-line">
      <div
        className="artboard pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-3xl px-5 py-24 text-center sm:px-10 lg:py-32">
        <h2 className="display text-[clamp(2.5rem,5.5vw,4.5rem)] text-ink">
          Draw something
        </h2>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/chart/gallery"
            className="inline-flex h-11 items-center rounded-lg bg-chart px-7 text-[15px] font-semibold text-on-accent transition-opacity hover:opacity-90"
          >
            Chart gallery
          </Link>
          <Link
            href="/diagram/gallery"
            className="inline-flex h-11 items-center rounded-lg bg-script px-7 text-[15px] font-semibold text-on-accent transition-opacity hover:opacity-90"
          >
            Diagram gallery
          </Link>
          <Link
            href="/advanced/what-is-flitter"
            className="inline-flex h-11 items-center rounded-lg border border-line-strong px-7 text-[15px] font-semibold text-ink transition-colors hover:bg-surface"
          >
            Learn the core
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ───────────────────────────────────────────── */

const FOOTER_COLUMNS = [
  {
    title: "Libraries",
    links: [
      { label: "Flitter Chart", href: "/chart" },
      { label: "Flitter Diagram", href: "/diagram" },
      { label: "Flitter Core", href: "/advanced/what-is-flitter" },
    ],
  },
  {
    title: "Docs",
    links: [
      { label: "Chart quick start", href: "/chart/quick-start" },
      { label: "Diagram quick start", href: "/diagram/quick-start" },
      { label: "Chart gallery", href: "/chart/gallery" },
      { label: "Diagram gallery", href: "/diagram/gallery" },
      { label: "Integration", href: "/integration" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "GitHub", href: GITHUB_REPO_URL },
      { label: "Discord", href: DISCORD_URL },
      { label: "npm", href: NPM_URL },
    ],
  },
];

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-14 sm:px-10 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] xl:px-14">
        <div>
          <div className="flex items-center gap-2.5">
            <FlitterLogo size={24} />
            <span className="wordmark text-[17px] text-ink">FLITTER</span>
          </div>
          <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-faint">
            MIT licensed.
          </p>
        </div>
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title}>
            <h3 className="text-[13px] font-semibold text-ink">
              {column.title}
            </h3>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => {
                const external = link.href.startsWith("http");
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-[14px] text-soft transition-colors hover:text-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-[1400px] px-5 py-5 text-[13px] text-faint sm:px-10 xl:px-14">
          &copy; {new Date().getFullYear()} Flitter
        </p>
      </div>
    </footer>
  );
}

export default function Home({ code }: { code: HomeCode }) {
  return (
    <main className="overflow-x-clip">
      <IntroSection code={code} />
      <LibrariesSection />
      <ReelSection />
      <WhySection code={code} />
      <ProductionSection />
      <MaintainerSection />
      <LastSection />
      <Footer />
    </main>
  );
}
