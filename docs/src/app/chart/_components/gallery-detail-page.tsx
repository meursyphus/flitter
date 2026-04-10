"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { codeToHtml } from "shiki";
import type { GalleryDetailPageData } from "../_data/types";
import GalleryCard from "./gallery-card";

function CodeBlock({ code }: { code: string }) {
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
    <div className="relative">
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-neutral-200"
        title="Copy code"
      >
        {copied ? (
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M3 7.5l3 3 5-6" />
          </svg>
        ) : (
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="4.5" y="4.5" width="8" height="8" rx="1.5" />
            <path d="M9.5 4.5V2.5a1 1 0 00-1-1h-6a1 1 0 00-1 1v6a1 1 0 001 1h2" />
          </svg>
        )}
      </button>
      {html ? (
        <div
          className="overflow-x-auto text-[13px] leading-relaxed [&_pre]:!m-0 [&_pre]:!p-4 [&_pre]:!rounded-none [&_code]:!text-[13px] [&_code]:!leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="bg-neutral-900 p-4 text-[13px] leading-relaxed text-neutral-200 overflow-x-auto">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}

function ChartPreview({ Component }: { Component: React.ComponentType }) {
  const [chartKey, setChartKey] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const handleReplay = () => {
    setSpinning(true);
    setChartKey((k) => k + 1);
    setTimeout(() => setSpinning(false), 600);
  };

  return (
    <section className="relative">
      <div className="h-[400px] md:h-[500px] rounded-2xl bg-neutral-50 p-6">
        <div className="h-full w-full">
          <Component key={chartKey} />
        </div>
      </div>
      <button
        onClick={handleReplay}
        className="absolute right-3 top-3 rounded-full p-2 text-neutral-300 transition-colors hover:bg-neutral-200/60 hover:text-neutral-500 active:scale-90"
        title="Replay animation"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={spinning ? "animate-[spin_0.5s_ease-in-out]" : ""}
        >
          <path d="M2.5 8a5.5 5.5 0 0 1 9.3-4" />
          <path d="M13.5 8a5.5 5.5 0 0 1-9.3 4" />
          <path d="M11 1.5L12 4l-2.5.5" />
          <path d="M5 14.5L4 12l2.5-.5" />
        </svg>
      </button>
    </section>
  );
}

function TabbedCodeBlock({
  files,
}: {
  files: { filename: string; code: string }[];
}) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="rounded-lg overflow-hidden border border-neutral-800">
      <div className="flex bg-neutral-900 border-b border-neutral-800">
        {files.map((file, i) => (
          <button
            key={file.filename}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 text-[12px] font-mono transition-colors border-b-2 ${
              i === activeTab
                ? "text-neutral-200 border-teal-400 bg-neutral-800/60"
                : "text-neutral-500 border-transparent hover:text-neutral-300"
            }`}
          >
            {file.filename}
          </button>
        ))}
      </div>
      <CodeBlock code={files[activeTab].code} />
    </div>
  );
}

export default function GalleryDetailPage({
  data,
}: {
  data: GalleryDetailPageData;
}) {
  const { entry, relatedEntries } = data;

  return (
    <div className="mx-auto max-w-5xl">
      {/* Back link + Header */}
      <section className="pt-8 pb-4">
        <Link
          href="/chart/gallery"
          className="inline-flex items-center gap-1 text-[13px] text-neutral-400 transition-colors hover:text-neutral-600"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M7.5 2.5L4 6l3.5 3.5" />
          </svg>
          Gallery
        </Link>

        <h1 className="mt-3 text-2xl font-bold tracking-tight text-neutral-900">
          {entry.title}
        </h1>

        <div className="mt-3 flex items-center gap-3">
          <span className="inline-block rounded bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
            {entry.style}
          </span>
          <div className="inline-flex items-center gap-2 rounded-lg bg-neutral-50 border border-neutral-200 px-3 py-1.5">
            <code className="text-xs text-neutral-600">
              <span className="text-teal-500">$</span>{" "}
              {entry.installCommand}
            </code>
          </div>
        </div>
      </section>

      {/* Chart */}
      <ChartPreview Component={entry.Component} />

      {/* Code */}
      <section className="pt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-neutral-400">
          Code
        </h2>
        <TabbedCodeBlock files={entry.files} />
      </section>

      {/* Related charts */}
      {relatedEntries.length > 0 && (
        <section className="pt-10 pb-16">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-neutral-400">
            Related Charts
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {relatedEntries.map((rel, i) => (
              <GalleryCard
                key={rel.slug}
                slug={rel.slug}
                title={rel.title}
                style={rel.style}
                thumbnailUrl={rel.thumbnailUrl}
                index={i}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
