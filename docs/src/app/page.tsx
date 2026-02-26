"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

const sections = [
  {
    title: "Chart",
    description:
      "One chart library, every style. Fully customizable and headless — cover any chart style you need with a single dependency.",
    href: "/chart",
    demoId: "chart-demo",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="4" y="18" width="5" height="10" rx="1" />
        <rect x="13" y="10" width="5" height="18" rx="1" />
        <rect x="22" y="4" width="5" height="24" rx="1" />
      </svg>
    ),
  },
  // {
  //   title: "Diagram",
  //   description: "...",
  //   href: "#",
  //   comingSoon: true,
  //   demoId: "diagram-demo",
  //   icon: ( ... ),
  // },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative px-6 pt-20 pb-16 lg:px-16">
        <div className="dot-pattern pointer-events-none absolute inset-0 opacity-30" />

        <div className="relative max-w-2xl">
          <h1
            className="animate-fade-up text-4xl tracking-tight text-neutral-900 sm:text-5xl"
            style={{ animationDelay: "0.1s" }}
          >
            <span
              className="italic text-neutral-700"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Flutter&apos;s rendering,
            </span>
            <br />
            <span className="font-bold">on the web.</span>
          </h1>
          <p
            className="animate-fade-up mt-5 text-base leading-relaxed text-neutral-500 sm:text-lg"
            style={{ animationDelay: "0.25s" }}
          >
            Declarative widget system for charts, diagrams,
            <br className="hidden sm:block" />
            and every visualization.
          </p>
          <div
            className="animate-fade-up mt-8 flex items-center gap-4"
            style={{ animationDelay: "0.4s" }}
          >
            <Link
              href="/chart"
              className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-neutral-700 hover:shadow-lg hover:shadow-neutral-900/10"
            >
              Get Started
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 7h12M8 2l5 5-5 5" />
              </svg>
            </Link>
            <a
              href="https://github.com/meursyphus/flitter"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-600 transition-all hover:border-neutral-400 hover:text-neutral-900"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Sections */}
      {sections.map((section) => (
        <section
          key={section.title}
          className="border-t border-neutral-100 px-6 py-20 lg:px-16"
        >
          <ScrollReveal>
            <div className="mx-auto max-w-6xl">
              <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
                {/* Left — info */}
                <div className="flex-shrink-0 lg:w-[340px]">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="text-neutral-400">{section.icon}</span>
                    <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                      {section.title}
                    </h2>
                  </div>
                  <p className="text-sm leading-relaxed text-neutral-500">
                    {section.description}
                  </p>
                  <Link
                    href={section.href}
                    className="group mt-6 inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-700 transition-all hover:border-neutral-400 hover:text-neutral-900"
                  >
                    See more
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
                      <path d="M1 6h10M7 2l4 4-4 4" />
                    </svg>
                  </Link>
                </div>

                {/* Right — demo */}
                <div className="min-w-0 flex-1">
                  <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
                    {/* Browser chrome */}
                    <div className="flex items-center gap-1.5 border-b border-neutral-100 bg-neutral-50 px-4 py-2.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
                      <span className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
                      <span className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
                    </div>
                    {/* Demo area */}
                    <div
                      className="flex aspect-[16/10] items-center justify-center"
                      id={section.demoId}
                    >
                      <span className="text-xs font-medium uppercase tracking-widest text-neutral-200">
                        Demo
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      ))}

      {/* Footer */}
      <footer className="border-t border-neutral-100 px-6 py-10 lg:px-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold tracking-tight text-neutral-400" style={{ fontFamily: "var(--font-display)" }}>
              flitter
            </span>
            <span className="text-xs text-neutral-300">&copy; 2025</span>
          </div>
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/meursyphus/flitter"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-400 transition-colors hover:text-neutral-600"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/@meursyphus/flitter"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-400 transition-colors hover:text-neutral-600"
            >
              npm
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
