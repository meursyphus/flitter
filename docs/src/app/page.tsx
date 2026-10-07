"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import type { LottieRefCurrentProps } from "lottie-react";
import CopyCommand from "@/components/copy-command";
import FlitterLogo from "@/components/flitter-logo";
import LiveChart from "@/components/live-chart";
import { ToastAreaChart } from "@/lib/charts";
import { DISCORD_URL, GITHUB_REPO_URL } from "@/lib/site-config";
import { galleryCategories, galleryEntries } from "./chart/_data/gallery";
import StyleBadge from "./chart/_components/style-badge";

/** Sample data for the hero; plays the Toast entrance animation on load. */
function createHeroChart() {
  return ToastAreaChart({
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [
        { legend: "Seoul", values: [65, 59, 80, 81, 56, 72, 90] },
        { legend: "Seattle", values: [28, 48, 40, 52, 86, 64, 70] },
        { legend: "Sydney", values: [35, 25, 30, 45, 35, 40, 52] },
      ],
    },
    config: {
      title: { text: "Monthly visitors by city" },
      area: { spline: true, opacity: 0.28 },
    },
  });
}

/** One example per chart type, the most visual ones first. */
const reelOrder = ["treemap", "area", "bubble", "pie", "radar", "heatmap", "candlestick"];
const reelEntries = galleryCategories
  .map((c) => galleryEntries.find((e) => e.chartType === c.id)!)
  .sort((a, b) => {
    const rank = (id: string) => {
      const i = reelOrder.findIndex((t) => id.startsWith(t));
      return i === -1 ? reelOrder.length : i;
    };
    return rank(a.chartType) - rank(b.chartType);
  });

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

/**
 * Frame for the code screenshots. Always dark: the images are dark in both
 * themes, and the fill matches their background (#1a1d23).
 */
function EditorWindow({
  filename,
  children,
  className = "",
}: {
  filename: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <figure
      className={`overflow-hidden rounded-xl border border-[#2a2f38] bg-[#1a1d23] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] ${className}`}
    >
      <figcaption className="flex items-center gap-2 border-b border-[#2a2f38] px-4 py-2.5 text-[12px] text-[#8b93a1]">
        <span className="h-2 w-2 rounded-full bg-[#fbbf24]" aria-hidden="true" />
        {filename}
      </figcaption>
      {children}
    </figure>
  );
}

/* ── Hero ─────────────────────────────────────────────── */

function IntroSection() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="artboard pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -left-40 top-10 h-[460px] w-[560px] rounded-full blur-[130px]"
        style={{ background: "var(--brand)", opacity: "calc(var(--glow) * 0.55)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[520px] rounded-full blur-[130px]"
        style={{ background: "var(--chart)", opacity: "calc(var(--glow) * 0.45)" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-[1400px] items-center gap-14 px-5 pt-16 pb-20 sm:px-10 lg:pt-24 lg:pb-28 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] xl:px-14">
        <div>
          <h1 className="display text-[clamp(2.75rem,6.4vw,5rem)] leading-[0.98] text-ink [font-stretch:100%] xl:text-[clamp(3rem,4.4vw,4.75rem)]">
            <span className="text-script">JavaScript</span>{" "}
            <span className="text-chart">Rendering</span>
            <br />
            for <span className="text-brand">Data Visualization</span>
          </h1>

          <p className="mt-7 max-w-[30rem] text-[18px] leading-relaxed text-soft">
            Charts, diagrams and interfaces drawn by one engine. Flutter&apos;s
            widget model, rendered to SVG or Canvas.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
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
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 px-3 text-[15px] font-semibold text-soft transition-colors hover:text-ink"
            >
              <GitHubIcon />
              GitHub
            </a>
          </div>

          <CopyCommand command="npm install flitter-ui" className="mt-8" />
        </div>

        {/* Code, and what it draws */}
        <div className="relative mx-auto w-full max-w-[640px] pb-24 sm:pb-28 xl:pb-16">
          <EditorWindow filename="counter.ts" className="ml-auto max-w-[520px]">
            <div className="relative h-[340px] overflow-hidden sm:h-[420px]">
              <img
                src="/home/counter-code.png"
                alt="A Flitter counter widget written as a StatefulWidget"
                className="w-full"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#1a1d23] to-transparent" />
            </div>
          </EditorWindow>

          <Link
            href="/chart"
            className="absolute bottom-0 left-0 w-[92%] max-w-[480px] overflow-hidden rounded-xl border border-line-strong bg-[var(--chart-bg)] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.65)] sm:w-[80%]"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-2 text-[12px] text-faint">
              <span>Rendered live in your browser</span>
              <span className="text-soft">SVG</span>
            </div>
            <div className="h-[230px] p-3 sm:h-[270px]">
              <LiveChart create={createHeroChart} />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Libraries ────────────────────────────────────────── */

function LibrariesSection() {
  const previewEntry = galleryEntries.find((e) => e.slug === "bar-chart-toast-department-revenue")!;

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-10 lg:py-28 xl:px-14">
      <div className="max-w-2xl">
        <h2 className="display text-[clamp(2rem,4vw,3.25rem)] text-ink">
          Libraries on one engine
        </h2>
        <p className="mt-4 text-[17px] leading-relaxed text-soft">
          Each library is a set of Flitter widgets, so they share layout,
          painting, gestures and animation, and render anywhere Flitter does.
        </p>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        {/* Chart */}
        <Link
          href="/chart"
          data-product="chart"
          className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface p-7 transition-colors hover:border-chart/60 lg:row-span-2"
        >
          <div className="flex items-center justify-between">
            <span className="wordmark text-[26px] text-ink">
              FLITTER <span className="text-chart">CHART</span>
            </span>
            <span className="rounded-full bg-chart/15 px-2.5 py-0.5 text-[12px] font-semibold text-chart">
              New
            </span>
          </div>
          <p className="mt-3 max-w-md text-[16px] leading-relaxed text-soft">
            shadcn-style charts installed as source. {galleryCategories.length} chart
            types, each in AG and Toast styles.
          </p>
          <div className="mt-6 min-h-[260px] flex-1 overflow-hidden rounded-xl border border-line bg-[var(--chart-bg)] p-3">
            <LiveChart create={previewEntry.createWidget} animate={false} lazy />
          </div>
          <span className="mt-5 text-[15px] font-semibold text-chart">
            Open Flitter Chart
          </span>
        </Link>

        {/* Core */}
        <Link
          href="/advanced/what-is-flitter"
          data-product="core"
          className="group flex flex-col rounded-2xl border border-line bg-surface p-7 transition-colors hover:border-core/60"
        >
          <span className="wordmark text-[26px] text-ink">
            FLITTER <span className="text-core">CORE</span>
          </span>
          <p className="mt-3 text-[16px] leading-relaxed text-soft">
            The rendering engine: 50+ widgets, constraint layout, gestures and
            animation controllers, with React and Svelte adapters.
          </p>
          <pre className="mt-5 overflow-x-auto rounded-lg border border-line bg-canvas px-4 py-3 text-[13px] leading-relaxed text-soft">
            <code className="!border-0 !bg-transparent !p-0">
              <span className="text-core">Container</span>({"{"}{"\n"}
              {"  "}padding: EdgeInsets.<span className="text-core">all</span>(16),{"\n"}
              {"  "}child: <span className="text-core">Text</span>(<span className="text-ok">&quot;Hello, canvas&quot;</span>),{"\n"}
              {"}"})
            </code>
          </pre>
          <span className="mt-5 text-[15px] font-semibold text-core">Read the core docs</span>
        </Link>

        {/* Diagram */}
        <div className="flex flex-col rounded-2xl border border-dashed border-line-strong p-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="wordmark text-[26px] text-ink">
              FLITTER <span className="text-script">DIAGRAM</span>
            </span>
            <span className="whitespace-nowrap rounded-full border border-line px-2.5 py-0.5 text-[12px] font-medium text-faint">
              Coming soon
            </span>
          </div>
          <p className="mt-3 text-[16px] leading-relaxed text-soft">
            Node-and-edge editors like the ERD canvas in easyrd, packaged the
            same way as the charts.
          </p>
          <div className="mt-5 h-28 overflow-hidden rounded-lg border border-line">
            <img
              src="/home/easyrd.jpg"
              alt=""
              className="w-full object-cover object-[70%_30%] opacity-70 grayscale"
            />
          </div>
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
            No screenshots here
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-soft">
            Every chart on this page is drawn by Flitter as you scroll. Hover
            one to see its tooltip, or switch the theme up top.
          </p>
        </div>
        <Link
          href="/chart/gallery"
          className="text-[15px] font-semibold text-chart underline-offset-4 hover:underline"
        >
          Browse all {galleryEntries.length} examples
        </Link>
      </div>

      <div className="reel mt-12" style={{ ["--reel-duration" as string]: "120s" }}>
        <div className="reel-track">
          {items.map((entry, i) => (
            <Link
              key={`${entry.slug}-${i}`}
              href={`/chart/gallery/${entry.slug}`}
              aria-hidden={i >= reelEntries.length || undefined}
              tabIndex={i >= reelEntries.length ? -1 : undefined}
              className="block w-[340px] shrink-0 overflow-hidden rounded-xl border border-line bg-[var(--chart-bg)] transition-colors hover:border-line-strong sm:w-[440px]"
            >
              <div className="h-[260px] p-3 sm:h-[300px]">
                <LiveChart create={entry.createWidget} animate={false} lazy />
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-2.5">
                <span className="truncate text-[13px] text-soft">{entry.title}</span>
                <StyleBadge style={entry.style} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Flutter → Flitter ────────────────────────────────── */

function WhySection() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-10 lg:py-28 xl:px-14">
      <div className="max-w-2xl">
        <h2 className="display text-[clamp(2rem,4vw,3.25rem)] text-ink">
          Flutter&apos;s API, written in JavaScript
        </h2>
        <p className="mt-4 text-[17px] leading-relaxed text-soft">
          If you have built a Flutter widget, you can read Flitter. Same
          widgets, same constraints, one engine for SVG and Canvas.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-ink">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#027DFD" aria-hidden="true">
              <path d="M14.314 0L2.3 12 6 15.7 21.684 0h-7.357zm0 11.066L7.758 17.38l2.39 2.39 4.17-4.17 5.32-5.32-1.324-1.214z" />
            </svg>
            Flutter
            <span className="font-normal text-faint">Dart</span>
          </div>
          <EditorWindow filename="profile_card.dart">
            <img src="/home/flutter-dart.png" alt="A profile card widget in Flutter (Dart)" className="w-full" />
          </EditorWindow>
        </div>
        <div>
          <div className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-ink">
            <FlitterLogo size={16} />
            Flitter
            <span className="font-normal text-faint">JavaScript</span>
          </div>
          <EditorWindow filename="profile-card.js">
            <img src="/home/flitter-javascript.png" alt="The same profile card in Flitter (JavaScript)" className="w-full" />
          </EditorWindow>
        </div>
      </div>
    </section>
  );
}

/* ── Scroll-synced Lottie ─────────────────────────────── */

function CodingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [animationData, setAnimationData] = useState<any>(null);
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tweenRef = useRef<any>(null);
  const lottieContainerRef = useRef<HTMLDivElement>(null);

  // Fetch animation data
  useEffect(() => {
    const abortController = new AbortController();
    fetch("https://static.flitter.dev/coding.json", {
      signal: abortController.signal,
    })
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((e) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        console.error("Failed to load coding animation:", e);
      });
    return () => {
      abortController.abort();
      tweenRef.current?.kill();
    };
  }, []);

  // Set up GSAP ScrollTrigger to drive Lottie based on scroll
  useEffect(() => {
    if (!animationData) return;

    // Wait for lottie-react to initialize the animation instance
    const timer = setTimeout(() => {
      const animItem = lottieRef.current?.animationItem;
      if (!animItem || !sectionRef.current) return;

      (async () => {
        const [gsapModule, scrollTriggerModule] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        const gsap = gsapModule.default;
        const ScrollTrigger = scrollTriggerModule.default;
        gsap.registerPlugin(ScrollTrigger);

        // Drive Lottie frames by scroll progress
        const playhead = { frame: 0 };
        tweenRef.current = gsap.to(playhead, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
          frame: animItem.totalFrames - 1,
          ease: "none",
          onUpdate: () => animItem.goToAndStop(playhead.frame, true),
        });

        ScrollTrigger.refresh();
      })();
    }, 200);

    return () => clearTimeout(timer);
  }, [animationData]);

  const phrases = [
    "Declarative code that reads like a blueprint.",
    "Box model layouts -- constraint-based, predictable, powerful.",
    "SVG or Canvas? Both. One API, two renderers.",
    "Interactive charts with click, hover, and gesture support.",
    "Canvas events handled elegantly, no hacks required.",
    "50+ widgets ready to compose into anything you imagine.",
    "Rendering performance that scales with your ambition.",
  ];

  return (
    <section
      ref={sectionRef}
      className="relative flex w-full shrink-0 flex-col-reverse border-t border-line lg:flex-row"
    >
      {/* Scrolling phrases */}
      <div className="w-full px-5 sm:px-10 lg:w-1/2 lg:px-12">
        {phrases.map((phrase, i) => (
          <p
            key={i}
            className="display flex h-screen items-center text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.12] text-ink"
          >
            {phrase}
          </p>
        ))}
      </div>

      {/* Pinned Lottie, driven by scroll */}
      <div ref={lottieContainerRef} className="sticky top-16 flex h-[65vh] w-full items-center justify-center border-line bg-surface lg:h-[calc(100vh-4rem)] lg:w-3/5 lg:border-l">
        {animationData && (
          <Lottie
            lottieRef={lottieRef}
            animationData={animationData}
            renderer={"canvas" as "svg"}
            loop={false}
            autoplay={false}
            className="h-full overflow-hidden py-4 lg:h-[90%] lg:py-0"
          />
        )}
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
            <p className="mt-4 text-[17px] leading-relaxed text-soft">
              A database diagram editor used by more than 10,000 people, built
              with SvelteKit, Flitter and DBML.
            </p>
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </h2>
          <p className="mt-1 text-[15px] text-faint">Maintainer</p>
          <blockquote className="mt-5 border-l-2 border-ok pl-4 text-[17px] leading-relaxed text-soft">
            Korean frontend developer, 7 years in. I love building visual
            experiences on the web.
          </blockquote>

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
              <span className="mt-0.5 block text-[14px] text-soft">
                Page transitions for the web, 800+ stars on GitHub
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
      <div className="artboard pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-3xl px-5 py-24 text-center sm:px-10 lg:py-32">
        <h2 className="display text-[clamp(2.5rem,5.5vw,4.5rem)] text-ink">
          Draw something
        </h2>
        <p className="mx-auto mt-5 max-w-md text-[17px] leading-relaxed text-soft">
          Start from a chart in the gallery, or build your own widget tree on
          the core engine.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/chart/gallery"
            className="inline-flex h-11 items-center rounded-lg bg-chart px-7 text-[15px] font-semibold text-on-accent transition-opacity hover:opacity-90"
          >
            Open the gallery
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
      { label: "Flitter Core", href: "/advanced/what-is-flitter" },
    ],
  },
  {
    title: "Docs",
    links: [
      { label: "Installation", href: "/chart/installation" },
      { label: "Quick start", href: "/chart/quick-start" },
      { label: "Gallery", href: "/chart/gallery" },
      { label: "Integration", href: "/integration" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "GitHub", href: GITHUB_REPO_URL },
      { label: "Discord", href: DISCORD_URL },
      { label: "npm", href: "https://www.npmjs.com/package/flitter-ui" },
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
            A rendering engine for the web, modeled on Flutter. MIT licensed.
          </p>
        </div>
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title}>
            <h3 className="text-[13px] font-semibold text-ink">{column.title}</h3>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => {
                const external = link.href.startsWith("http");
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <IntroSection />
      <LibrariesSection />
      <ReelSection />
      <WhySection />
      <CodingSection />
      <ProductionSection />
      <MaintainerSection />
      <LastSection />
      <Footer />
    </main>
  );
}
