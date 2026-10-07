"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CopyCommand from "@/components/copy-command";
import LiveChart from "@/components/live-chart";
import { highlight } from "@/lib/highlight";
import type { GalleryDetailPageData } from "../_data/types";
import type { GalleryEntry } from "../_data/gallery";
import GalleryCard from "./gallery-card";
import StyleBadge from "./style-badge";

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const [html, setHtml] = useState("");

  useEffect(() => {
    highlight(code, "tsx")
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
        className="absolute right-3 top-3 z-10 flex h-8 items-center gap-1.5 rounded-md border border-line bg-canvas px-2.5 text-[12px] text-soft transition-colors hover:text-ink"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      {html ? (
        <div
          className="text-[13px] leading-relaxed [&_pre]:p-5"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="p-5 text-[13px] leading-relaxed text-soft">
          <code className="!border-0 !bg-transparent !p-0">{code}</code>
        </pre>
      )}
    </div>
  );
}

function TabbedCode({ files }: { files: GalleryEntry["files"] }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="code-surface overflow-hidden rounded-xl">
      <div role="tablist" className="flex border-b border-line">
        {files.map((file, i) => (
          <button
            key={file.filename}
            role="tab"
            aria-selected={i === activeTab}
            onClick={() => setActiveTab(i)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-[12px] transition-colors ${
              i === activeTab
                ? "border-accent text-ink"
                : "border-transparent text-faint hover:text-soft"
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

function ChartStage({ entry }: { entry: GalleryEntry }) {
  const [run, setRun] = useState(0);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-line bg-[var(--chart-bg)]">
      <div className="h-[420px] p-5 md:h-[540px] md:p-8">
        <LiveChart key={run} create={entry.createWidget} />
      </div>
      <button
        onClick={() => setRun((n) => n + 1)}
        className="absolute right-3 top-3 flex h-8 items-center gap-1.5 rounded-md border border-line bg-canvas/80 px-2.5 text-[12px] text-soft backdrop-blur transition-colors hover:text-ink"
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2.5 8a5.5 5.5 0 0 1 9.3-4" />
          <path d="M13.5 8a5.5 5.5 0 0 1-9.3 4" />
          <path d="M11 1.5L12 4l-2.5.5" />
          <path d="M5 14.5L4 12l2.5-.5" />
        </svg>
        Replay
      </button>
    </section>
  );
}

export default function GalleryDetailPage({
  data,
}: {
  data: GalleryDetailPageData;
}) {
  const { entry, relatedEntries } = data;

  return (
    <div className="mx-auto max-w-5xl px-5 pb-20 md:px-10">
      <section className="pt-8 pb-6 lg:pt-12">
        <Link
          href={`/chart/gallery#${entry.chartType}`}
          className="inline-flex items-center gap-1 text-[13px] text-faint transition-colors hover:text-ink"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M7.5 2.5L4 6l3.5 3.5" />
          </svg>
          Gallery
        </Link>

        <h1 className="display mt-4 text-[clamp(1.75rem,4vw,2.75rem)] text-ink">
          {entry.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <StyleBadge style={entry.style} />
          <CopyCommand command={entry.installCommand} />
        </div>
      </section>

      <ChartStage entry={entry} />

      <section className="pt-12">
        <h2 className="mb-4 text-[15px] font-semibold text-ink">Code</h2>
        <TabbedCode files={entry.files} />
      </section>

      {relatedEntries.length > 0 && (
        <section className="pt-14">
          <h2 className="mb-4 text-[15px] font-semibold text-ink">
            More {entry.chartType.replace(/-chart$/, "").replace(/-/g, " ")} charts
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {relatedEntries.map((related) => (
              <GalleryCard key={related.slug} entry={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
