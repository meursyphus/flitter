"use client";

import LiveDiagram from "@/components/live-diagram";
import { cells, type CellId } from "../_data/interactions/cells";
import CopyButton from "./copy-button";
import { interactionDemos } from "./interaction-demos";

const tierLabel = { D: "Default", B: "Opt-in" } as const;

/** One micro-demo per gesture: caption, live stage, enabling snippet. */
export default function InteractionGrid({ html }: { html: Record<CellId, string> }) {
  return (
    <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(min(100%,360px),1fr))]">
      {cells.map((cell) => (
        <article
          key={cell.id}
          id={cell.id}
          data-cell={cell.id}
          data-ready={cell.ready}
          className="flex min-w-0 scroll-mt-24 flex-col overflow-hidden rounded-xl border border-line"
        >
          <header className="flex items-center justify-between gap-2 px-4 pt-3">
            <h2 className="text-[14px] font-semibold text-ink">{cell.title}</h2>
            <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${cell.tier === "D" ? "bg-accent/15 text-accent" : "bg-surface text-soft"}`}>
              {tierLabel[cell.tier]}
            </span>
          </header>
          <p className="px-4 pb-3 pt-1 text-[13px] text-soft">{cell.caption}</p>
          <div className="h-[260px] border-y border-line bg-[var(--chart-bg)]">
            {cell.ready ? (
              <LiveDiagram create={interactionDemos[cell.id]} lazy />
            ) : (
              <div className="flex h-full items-center justify-center text-[12px] text-faint">Live demo in progress</div>
            )}
          </div>
          <div className="code-surface relative flex-1 overflow-x-auto text-[12px] leading-relaxed [&_pre]:px-4 [&_pre]:py-3">
            <CopyButton text={cell.snippet} className="absolute right-2 top-2" />
            <div dangerouslySetInnerHTML={{ __html: html[cell.id] }} />
          </div>
        </article>
      ))}
    </div>
  );
}
