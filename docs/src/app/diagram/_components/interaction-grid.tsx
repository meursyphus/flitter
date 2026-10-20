"use client";

import LiveDiagram from "@/components/live-diagram";
import { cells, type CellId } from "../_data/interactions/cells";
import CopyButton from "./copy-button";
import { interactionDemos } from "./interaction-demos";

/** One micro-demo per gesture: caption, live stage, enabling snippet. */
export default function InteractionGrid({
  html,
}: {
  html: Record<CellId, string>;
}) {
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
          <header className="flex items-center justify-between gap-2 px-5 pt-5">
            <h2 className="text-xl font-semibold text-ink">{cell.title}</h2>
          </header>
          <p className="px-5 pb-4 pt-2 text-[15px] text-soft">{cell.caption}</p>
          <div className="h-[260px] border-y border-line bg-[var(--chart-bg)]">
            {cell.ready ? (
              <LiveDiagram create={interactionDemos[cell.id]} lazy />
            ) : (
              <div className="flex h-full items-center justify-center text-[12px] text-faint">
                Live demo in progress
              </div>
            )}
          </div>
          <details className="code-surface p-4">
            <summary className="cursor-pointer text-sm text-soft">
              Source code
            </summary>
            <div className="relative flex-1 overflow-x-auto text-[12px] leading-relaxed [&_pre]:px-4 [&_pre]:py-3">
              <CopyButton
                text={cell.snippet}
                className="absolute right-2 top-2"
              />
              <div dangerouslySetInnerHTML={{ __html: html[cell.id] }} />
            </div>
          </details>
        </article>
      ))}
    </div>
  );
}
