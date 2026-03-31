"use client";

import { useState, useEffect } from "react";
import { codeToHtml } from "shiki";

type ShowcaseItem = {
  style: "Toast" | "AG";
  chart: React.ReactNode;
  title?: string;
  subtitle?: string;
  description?: string;
  height?: number;
  featured?: boolean;
  fullWidth?: boolean;
  code?: string;
};

function CardCaption({ example }: { example: ShowcaseItem }) {
  if (example.description) {
    return (
      <div className="px-5 py-3 border-t border-neutral-100">
        <span className="mr-2 inline-block rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-500 uppercase tracking-wide">
          {example.style}
        </span>
        <span className="text-[13px] text-neutral-500">
          {example.description}
        </span>
      </div>
    );
  }
  if (example.title) {
    return (
      <div className="px-5 py-3 border-t border-neutral-100">
        <span className="mr-2 inline-block rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-500 uppercase tracking-wide">
          {example.style}
        </span>
        <span className="text-[13px] font-medium text-neutral-700">
          {example.title}
        </span>
        {example.subtitle && (
          <span className="text-[13px] text-neutral-400">
            {" — "}
            {example.subtitle}
          </span>
        )}
      </div>
    );
  }
  return null;
}

function CodeExpandSection({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const [html, setHtml] = useState("");

  useEffect(() => {
    codeToHtml(code.trim(), { lang: "tsx", theme: "github-dark" })
      .then(setHtml)
      .catch(() => {});
  }, [code]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <details className="group/code border-t border-neutral-100">
      <summary className="flex cursor-pointer items-center gap-2 px-5 py-2.5 text-xs font-medium text-neutral-400 transition-colors hover:text-neutral-600 select-none">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="shrink-0 transition-transform group-open/code:rotate-90"
        >
          <path d="M4.5 2.5l4 3.5-4 3.5" />
        </svg>
        View code
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleCopy();
          }}
          className="ml-auto rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
          title="Copy code"
        >
          {copied ? (
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 7.5l3 3 5-6" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="4.5" y="4.5" width="8" height="8" rx="1.5" />
              <path d="M9.5 4.5V2.5a1 1 0 00-1-1h-6a1 1 0 00-1 1v6a1 1 0 001 1h2" />
            </svg>
          )}
        </button>
      </summary>
      <div className="max-h-[320px] overflow-auto px-5 pb-4">
        {html ? (
          <div
            className="rounded-lg overflow-x-auto text-[13px] leading-relaxed [&_pre]:!m-0 [&_pre]:!p-4 [&_pre]:!rounded-lg [&_code]:!text-[13px] [&_code]:!leading-relaxed"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <pre className="rounded-lg bg-neutral-900 p-4 text-[13px] leading-relaxed text-neutral-200 overflow-x-auto">
            <code>{code}</code>
          </pre>
        )}
      </div>
    </details>
  );
}

export default function ShowcaseGallery({
  examples,
}: {
  examples: ShowcaseItem[];
}) {
  const featuredExample = examples.find((e) => e.featured);
  const gridExamples = examples.filter((e) => !e.featured);

  return (
    <section className="px-6 pt-10 pb-16 md:px-10">
      {/* Featured hero card */}
      {featuredExample && (
        <div
          className="group mb-6 overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-sm transition-[border-color,box-shadow] hover:border-neutral-200 hover:shadow-md animate-fade-up"
          style={{ animationDelay: "0s" }}
        >
          <div
            className="px-3 pt-3 pb-3 h-[280px] md:h-[440px]"
          >
            <div
              className="h-full w-full rounded-lg bg-neutral-50/50"
              role="img"
              aria-label={featuredExample.description ?? featuredExample.title}
            >
              {featuredExample.chart}
            </div>
          </div>
          <CardCaption example={featuredExample} />
          {featuredExample.code && <CodeExpandSection code={featuredExample.code} />}
        </div>
      )}

      {/* Grid cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {gridExamples.map((example, i) => (
          <div
            key={`${i}-${example.description ?? example.title}`}
            className={`group overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] hover:border-neutral-200 hover:shadow-md animate-fade-up${
              example.fullWidth ? " lg:col-span-2" : ""
            }`}
            style={{ animationDelay: `${(i + 1) * 0.06}s` }}
          >
            <div
              className="px-3 pt-3 pb-3"
              style={{ height: example.height ?? 360 }}
            >
              <div
                className="h-full w-full rounded-lg bg-neutral-50/50"
                role="img"
                aria-label={example.description ?? example.title}
              >
                {example.chart}
              </div>
            </div>
            <CardCaption example={example} />
            {example.code && <CodeExpandSection code={example.code} />}
          </div>
        ))}
      </div>
    </section>
  );
}
