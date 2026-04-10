"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import type { LottieRefCurrentProps } from "lottie-react";
import { galleryEntries } from "./chart/_data/gallery";

/* ════════════════════════════════════════════════════════
   Section 1 — INTRO (Hero)
   2-col: bold display type left, code image right
   ════════════════════════════════════════════════════════ */
const DISPLAY_FONT = "var(--font-display), sans-serif";

function IntroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Faint grid texture — full bleed */}
      <div
        className="pointer-events-none absolute inset-y-0 opacity-[0.03]"
        style={{
          left: "-16rem",
          right: 0,
          backgroundImage:
            "linear-gradient(#2563EB 1px, transparent 1px), linear-gradient(90deg, #2563EB 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative grid min-h-[85vh] grid-cols-1 items-center gap-0 lg:grid-cols-[1fr_1.1fr]">
        {/* Left — Text */}
        <div className="flex flex-col justify-center px-6 py-20 sm:px-10 lg:py-0 lg:pl-12 xl:pl-16">
          <h1
            className="text-5xl sm:text-6xl lg:text-[72px] xl:text-[80px] font-black leading-[1.06] tracking-tight text-gray-900"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            Powerful
            <br />
            <span className="text-blue-600">Rendering</span>
            <br />
            for the Web
          </h1>

          <p className="mt-6 max-w-[420px] text-base sm:text-lg font-semibold leading-relaxed text-gray-500">
            A JavaScript rendering engine inspired by Flutter.
            Declarative widgets, constraint-based layout, SVG &amp; Canvas
            — in one unified API.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/docs"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-blue-600 px-7 text-sm font-semibold text-white transition-all hover:bg-blue-700"
            >
              Read the Docs
            </Link>
            <a
              href="https://github.com/meursyphus/flitter"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 px-7 text-sm font-semibold text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              GitHub
            </a>
          </div>
        </div>

        {/* Right — Code image */}
        <div className="relative hidden lg:flex lg:items-center lg:justify-start">
          <div className="relative w-full overflow-hidden rounded-l-lg bg-[#f5f7fa] shadow-lg">
            <img
              src="/home/counter-code.png"
              alt="Flitter counter example code"
              className="relative w-full"
              style={{ maxWidth: 680 }}
            />
          </div>
        </div>

        {/* Mobile code image */}
        <div className="px-6 pb-8 lg:hidden">
          <div className="overflow-hidden rounded-lg bg-[#f5f7fa] shadow-lg">
            <img
              src="/home/counter-code.png"
              alt="Flitter counter example code"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   Section 2 — SHOWCASE (Chart carousel)
   ════════════════════════════════════════════════════════ */
const showcaseCharts = galleryEntries.slice(0, 10).map((entry) => ({
  el: <entry.Component />,
  label: entry.title,
  style: entry.style,
}));

function ShowcaseSection() {
  const items = [...showcaseCharts, ...showcaseCharts];

  return (
    <section className="relative py-20 bg-[#fafbfc]">
      <div className="mb-12 px-6 sm:px-10 lg:px-12">
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-gray-900"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          Powered by <span className="text-blue-600">Flitter</span>
        </h2>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-gray-400">
          Every chart is a widget tree. 10+ chart types, two visual
          styles, installed via CLI.
        </p>
      </div>

      {/* Large panel carousel */}
      <div className="showcase-carousel">
        <div className="showcase-track">
          {items.map((chart, i) => (
            <div key={i} className="showcase-panel">
              <div className="relative h-[340px] overflow-hidden bg-white sm:h-[400px]">
                <div className="h-full w-full">{chart.el}</div>
              </div>
              <div className="mt-2.5 flex items-center gap-2 px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                  {chart.style}
                </span>
                <span className="text-[12px] text-gray-400">
                  {chart.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EasyRD — static reference */}
      <div className="mt-20 mx-auto max-w-6xl px-6 sm:px-10 lg:px-12">
        <div className="overflow-hidden">
          <img
            className="w-full"
            src="/home/easyrd.jpg"
            alt="EasyRD - ERD diagram built with Flitter"
          />
        </div>
        <p className="mt-3 text-sm text-gray-400">
          Also powering{" "}
          <a
            href="https://easyrd.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            easyrd.dev
          </a>
          {" "}— an ERD diagram tool built entirely with Flitter.
        </p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   Section 3 — WHY (Flutter + Flitter code comparison)
   ════════════════════════════════════════════════════════ */
function WhySection() {
  return (
    <section className="relative px-6 py-24 sm:px-10 lg:px-12">
      {/* Decorative accent line */}
      <div className="absolute left-6 top-0 h-px w-20 bg-blue-600 sm:left-10 lg:left-12" />

      <div>
        <h2
          className="max-w-3xl text-[clamp(2rem,4vw,3.5rem)] font-black leading-[1.08] tracking-tight text-gray-900"
          style={{
            fontFamily: "var(--font-display), Georgia, serif",
          }}
        >
          Bringing{" "}
          <span className="text-blue-500">Flutter&apos;s</span>{" "}
          Brilliance
          <br className="hidden sm:block" />
          to{" "}
          <span className="text-blue-600">JavaScript</span>
        </h2>

        <p className="mt-5 text-[16px] text-gray-400">
          Same API, same patterns -- just JavaScript.
        </p>

        {/* Code comparison */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="text-xl font-bold text-gray-900">
                Flutter
              </span>
              <span className="text-base text-gray-400">
                Dart
              </span>
            </div>
            <div className="overflow-hidden">
              <img
                src="/home/flutter-dart.png"
                alt="Flutter Dart code"
                className="w-full"
                style={{ aspectRatio: "1.48" }}
              />
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="text-xl font-bold text-blue-600">
                Flitter
              </span>
              <span className="text-base text-gray-400">
                JavaScript
              </span>
            </div>
            <div className="overflow-hidden">
              <img
                src="/home/flitter-javascript.png"
                alt="Flitter JavaScript code"
                className="w-full"
                style={{ aspectRatio: "1.48" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   Section 4 — CODING (Scroll-synced Lottie + text)
   ════════════════════════════════════════════════════════ */
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
      className="relative flex w-full shrink-0 flex-col-reverse lg:flex-row"
    >
      {/* Left — scrolling text */}
      <div className="w-full px-6 sm:px-10 lg:w-1/2 lg:px-12">
        {phrases.map((phrase, i) => (
          <p
            key={i}
            className="flex h-screen items-center text-3xl sm:text-4xl lg:text-[48px] font-bold leading-[1.15] tracking-tight text-gray-900"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            {phrase}
          </p>
        ))}
      </div>

      {/* Right — GSAP pinned Lottie */}
      <div ref={lottieContainerRef} className="sticky top-[48px] flex h-[65vh] w-full items-center justify-center bg-gray-100 lg:h-screen lg:w-3/5">
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

/* ════════════════════════════════════════════════════════
   Section 5 — LAST (CTA)
   ════════════════════════════════════════════════════════ */
function LastSection() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 sm:px-10 lg:px-12">
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(37,99,235,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-[640px] text-center">
        <h2
          className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-[1.08] tracking-tight text-gray-900"
          style={{
            fontFamily: "var(--font-display), Georgia, serif",
          }}
        >
          Start building with{" "}
          <span className="text-blue-600">Flitter</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-gray-400">
          Three commands to go from zero to a fully composable chart in
          your project.
        </p>

        {/* Terminal-like steps */}
        <div className="mx-auto mt-10 max-w-md space-y-2 text-left">
          {[
            { cmd: "npx flitter-ui init", note: "Set up Flitter" },
            {
              cmd: "npx flitter-ui add bar-chart",
              note: "Add a chart",
            },
            { cmd: null, note: "Open the source. Make it yours." },
          ].map((step, i) => (
            <div key={i}>
              {step.cmd ? (
                <code className="block rounded-md bg-gray-50 px-4 py-2.5 text-[13px] font-medium text-gray-600">
                  <span className="mr-2 text-blue-500">$</span>
                  {step.cmd}
                </code>
              ) : (
                <p className="px-4 py-2 text-[13px] text-gray-300 italic">
                  {step.note}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/docs"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-blue-600 px-8 text-[14px] font-semibold text-white transition-all hover:bg-blue-700"
          >
            Get Started
          </Link>
          <Link
            href="/chart"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 px-8 text-[14px] font-semibold text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50"
          >
            Explore Charts
            <svg
              width="13"
              height="13"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 7h12M9 3l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   Footer
   ════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="border-t border-gray-100 px-6 py-8 sm:px-10 lg:px-12">
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold tracking-tight text-gray-300">
            flitter
          </span>
          <span className="text-[11px] text-gray-300">
            &copy; {new Date().getFullYear()}
          </span>
        </div>
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/meursyphus/flitter"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-gray-300 transition-colors hover:text-gray-600"
          >
            GitHub
          </a>
          <a
            href="https://www.npmjs.com/package/flitter-ui"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-gray-300 transition-colors hover:text-gray-600"
          >
            npm
          </a>
          <a
            href="https://discord.gg/flitter"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-gray-300 transition-colors hover:text-gray-600"
          >
            Discord
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <main className="overflow-x-clip">
      <IntroSection />
      <ShowcaseSection />
      <WhySection />
      <CodingSection />
      <LastSection />
      <Footer />
    </main>
  );
}
