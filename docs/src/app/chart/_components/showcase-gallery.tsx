"use client";

import { useState } from "react";

type StyleFilter = "all" | "Toast" | "AG";

type ShowcaseItem = {
  title: string;
  subtitle: string;
  style: "Toast" | "AG";
  chart: React.ReactNode;
  height?: number;
  featured?: boolean;
  fullWidth?: boolean;
  code?: string;
};

function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy code"
      className="shrink-0 rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
    >
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 7.5l3 3 5-6" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="4.5" y="4.5" width="8" height="8" rx="1.5" />
          <path d="M9.5 4.5V2.5a1 1 0 00-1-1h-6a1 1 0 00-1 1v6a1 1 0 001 1h2" />
        </svg>
      )}
    </button>
  );
}

function StyleBadge({ style }: { style: "Toast" | "AG" }) {
  return (
    <span
      className={`ml-3 shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
        style === "Toast"
          ? "bg-teal-50 text-teal-600"
          : "bg-sky-50 text-sky-600"
      }`}
    >
      {style}
    </span>
  );
}

export default function ShowcaseGallery({
  examples,
}: {
  examples: ShowcaseItem[];
}) {
  const [filter, setFilter] = useState<StyleFilter>("all");

  const hasToast = examples.some((e) => e.style === "Toast");
  const hasAG = examples.some((e) => e.style === "AG");
  const showToggle = hasToast && hasAG;

  const filtered =
    filter === "all"
      ? examples
      : examples.filter((e) => e.style === filter);

  const featuredExample = filtered.find((e) => e.featured);
  const gridExamples = filtered.filter((e) => !e.featured);

  const pills: { label: string; value: StyleFilter }[] = [
    { label: "All", value: "all" },
    { label: "Toast", value: "Toast" },
    { label: "AG", value: "AG" },
  ];

  return (
    <section className="px-6 pt-10 pb-16 md:px-10">
      {showToggle && (
        <div className="mb-6 flex items-center gap-1.5">
          {pills.map((pill) => (
            <button
              key={pill.value}
              onClick={() => setFilter(pill.value)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filter === pill.value
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      )}

      {/* Featured hero card */}
      {featuredExample && (
        <div
          className="group mb-6 overflow-hidden rounded-xl border border-neutral-100 border-l-4 border-l-teal-400 bg-white shadow-sm transition-[border-color,box-shadow] hover:border-neutral-200 hover:border-l-teal-400 hover:shadow-md animate-fade-up"
          style={{ animationDelay: "0s" }}
        >
          <div className="flex items-start justify-between px-5 pt-4 pb-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-neutral-900 truncate">
                {featuredExample.title}
              </h3>
              <p className="mt-0.5 text-xs text-neutral-400 line-clamp-2">
                {featuredExample.subtitle}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {featuredExample.code && <CopyCodeButton code={featuredExample.code} />}
              <StyleBadge style={featuredExample.style} />
            </div>
          </div>
          <div className="px-3 pb-3 h-[280px] md:h-[440px]">
            <div
              className="h-full w-full rounded-lg bg-neutral-50/50"
              role="img"
              aria-label={featuredExample.title}
            >
              {featuredExample.chart}
            </div>
          </div>
        </div>
      )}

      {/* Grid cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {gridExamples.map((example, i) => (
          <div
            key={`${i}-${example.title}`}
            className={`group overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] hover:border-neutral-200 hover:shadow-md animate-fade-up${
              example.fullWidth ? " lg:col-span-2" : ""
            }`}
            style={{ animationDelay: `${(i + 1) * 0.06}s` }}
          >
            {/* Card header */}
            <div className="flex items-start justify-between px-5 pt-4 pb-2">
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-neutral-900 truncate">
                  {example.title}
                </h3>
                <p className="mt-0.5 text-xs text-neutral-400 line-clamp-2">
                  {example.subtitle}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {example.code && <CopyCodeButton code={example.code} />}
                <StyleBadge style={example.style} />
              </div>
            </div>
            {/* Chart area */}
            <div
              className="px-3 pb-3"
              style={{ height: example.height ?? 360 }}
            >
              <div
                className="h-full w-full rounded-lg bg-neutral-50/50"
                role="img"
                aria-label={example.title}
              >
                {example.chart}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
