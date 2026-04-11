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
    <section className="relative overflow-hidden bg-gray-950">
      <div className="relative grid min-h-[85vh] grid-cols-1 items-center gap-0 lg:grid-cols-[1fr_1.1fr]">
        {/* Left — Text */}
        <div className="flex flex-col justify-center px-6 py-20 sm:px-10 lg:py-0 lg:pl-12 xl:pl-16">
          <h1
            className="text-5xl sm:text-6xl lg:text-[72px] xl:text-[80px] font-black leading-[1.06] tracking-tight text-white"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            <span className="text-amber-400">JavaScript</span>{" "}
            <span className="text-rose-500">Rendering</span>
            <br />
            <span className="text-white">for</span>{" "}
            <span className="text-blue-400">Data Visualization</span>
          </h1>

          <p className="mt-6 max-w-[420px] text-base sm:text-lg font-semibold leading-relaxed text-gray-400">
            Charts, Diagrams, and beyond — powered by one engine.
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
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-700 px-7 text-sm font-semibold text-gray-300 transition-all hover:border-gray-500 hover:bg-gray-800"
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

        {/* Right — Code image with blue glow */}
        <div className="relative hidden lg:flex lg:items-center lg:justify-start">
          {/* Blue glow behind image */}
          <div
            className="absolute -right-20 top-1/2 -translate-y-1/2 h-[80%] w-[60%] rounded-full blur-[100px] opacity-40"
            style={{ background: "linear-gradient(135deg, #60a5fa, #818cf8)" }}
          />
          <div className="relative w-full overflow-hidden rounded-l-lg">
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
          <div className="relative overflow-hidden rounded-lg">
            <div
              className="absolute inset-0 rounded-full blur-[80px] opacity-30"
              style={{ background: "linear-gradient(135deg, #60a5fa, #818cf8)" }}
            />
            <img
              src="/home/counter-code.png"
              alt="Flitter counter example code"
              className="relative w-full"
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
const showcaseOrder = [
  "boxplot",
  "treemap",
  "area",
  "bubble",
  "pie",
  "radar",
  "heatmap",
];
const showcaseCharts = (() => {
  const seen = new Set<string>();
  const firsts: typeof galleryEntries = [];
  const rest: typeof galleryEntries = [];
  for (const e of galleryEntries) {
    (seen.has(e.chartType) ? rest : firsts).push(e);
    seen.add(e.chartType);
  }
  // 유형별 첫 번째: 우선순위 순 → 나머지는 원래 순서
  firsts.sort((a, b) => {
    const ai = showcaseOrder.findIndex((t) => a.chartType.startsWith(t));
    const bi = showcaseOrder.findIndex((t) => b.chartType.startsWith(t));
    return (ai === -1 ? showcaseOrder.length : ai) - (bi === -1 ? showcaseOrder.length : bi);
  });
  return [...firsts, ...rest].map((entry) => ({
    thumbnailUrl: entry.thumbnailUrl,
    label: entry.title,
    style: entry.style,
  }));
})();

function ShowcaseSection() {
  const items = [...showcaseCharts, ...showcaseCharts];

  return (
    <section className="relative py-20 lg:py-40 bg-[#fafbfc]">
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
              <div className="relative h-[340px] overflow-hidden bg-white sm:h-[400px] flex items-center justify-center p-5">
                <img
                  src={chart.thumbnailUrl}
                  alt={chart.label}
                  className="h-full w-full object-contain"
                />
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

      {/* EasyRD — production showcase */}
      <div className="mt-20 mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <h3
          className="text-4xl sm:text-5xl lg:text-[64px] font-black tracking-tight leading-[1.08] text-gray-900"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          Used in Production —{" "}
          <a
            href="https://easyrd.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-600 font-semibold hover:underline"
          >
            easyrd.dev
          </a>
        </h3>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-500">
          A database table editor used by 10,000+ users.
          Built with SvelteKit + Flitter + DBML.
        </p>
        <div className="mt-6 overflow-hidden rounded-lg">
          <img
            className="w-full"
            src="/home/easyrd.jpg"
            alt="EasyRD - ERD diagram editor powered by Flitter"
          />
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   Section 3 — MAINTAINER
   ════════════════════════════════════════════════════════ */
function MaintainerSection() {
  return (
    <section className="relative py-24 lg:py-40 px-6 sm:px-10 lg:px-12">
      <div className="mx-auto max-w-2xl text-center">
        {/* Photo — vertical, centered */}
        <div className="mx-auto w-full max-w-sm overflow-hidden rounded-xl">
          <img
            src="/home/maintainer.jpeg"
            alt="Daeseung Moon"
            className="w-full object-cover object-top"
          />
        </div>

        {/* Info */}
        <div className="mt-8">
          <h3
            className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 flex items-center justify-center gap-3"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            Daeseung Moon
            <a
              href="https://www.linkedin.com/in/%EB%AC%B8%EB%8C%80%EC%8A%B9/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-[#0A66C2]"
              aria-label="LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </h3>

          {/* Quote-style bio */}
          <blockquote className="mt-4 border-l-2 border-emerald-400 pl-4 text-left text-[17px] leading-relaxed text-gray-500 italic">
            Korean frontend developer, 7 years in.
            <br />
            I love building visual experiences on the web.
          </blockquote>

          {/* ssgoi card */}
          <p className="mt-8 mb-1 text-[12px] font-bold uppercase tracking-wider text-gray-400">
            Also built by Daeseung
          </p>
          <a
            href="https://github.com/meursyphus/ssgoi"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-3 inline-flex items-center gap-2 text-[14px] text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span>ssgoi — Page transition library for the web</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[12px] font-semibold text-gray-700">
              <span className="text-yellow-500">&#9733;</span>
              800+
            </span>
          </a>
          <a
            href="https://ssgoi.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="block overflow-hidden border border-gray-200 transition-all hover:border-gray-300 hover:shadow-md"
          >
            <img
              src="https://ssgoi.dev/og.png"
              alt="ssgoi — Page transition library for the web"
              className="w-full"
            />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   Section 4 — WHY (Flutter + Flitter code comparison)
   ════════════════════════════════════════════════════════ */
function WhySection() {
  return (
    <section className="relative px-6 py-24 lg:py-40 sm:px-10 lg:px-12">
      <div>
        <h2
          className="max-w-3xl text-[clamp(2rem,4vw,3.5rem)] font-black leading-[1.08] tracking-tight text-gray-900"
          style={{
            fontFamily: "var(--font-display), Georgia, serif",
          }}
        >
          <span className="text-blue-600">Google&apos;s</span>{" "}
          Creative <span className="text-rose-500">Power</span>,
          <br className="hidden sm:block" />
          Now on the <span className="text-emerald-500">Web</span>
        </h2>

        <p className="mt-5 text-[16px] text-gray-400">
          Flutter&apos;s declarative API, now in JavaScript. SVG &amp; Canvas, one unified engine.
        </p>

        {/* Code comparison */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#027DFD"><path d="M14.314 0L2.3 12 6 15.7 21.684 0h-7.357zm0 11.066L7.758 17.38l2.39 2.39 4.17-4.17 5.32-5.32-1.324-1.214z" /></svg>
              <span className="text-xl font-bold text-blue-500">
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
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#F7DF1E"><path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.405-.6-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z" /></svg>
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
   Section 5 — CODING (Scroll-synced Lottie + text)
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
   Section 6 — LAST (CTA)
   ════════════════════════════════════════════════════════ */
function LastSection() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 sm:px-10 lg:px-12">
      <div className="relative max-w-[640px] text-center">
        <h2
          className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-[1.08] tracking-tight text-gray-900"
          style={{
            fontFamily: "var(--font-display), Georgia, serif",
          }}
        >
          See What&apos;s Possible
        </h2>
        <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-gray-400">
          Explore the chart gallery, dive into the docs, or contribute on GitHub.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/chart"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-blue-600 px-8 text-[14px] font-semibold text-white transition-all hover:bg-blue-700"
          >
            Chart Gallery
          </Link>
          <a
            href="https://github.com/meursyphus/flitter"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-gray-900 px-8 text-[14px] font-semibold text-white transition-all hover:bg-gray-800"
          >
            GitHub
          </a>
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
      <MaintainerSection />
      <LastSection />
      <Footer />
    </main>
  );
}
