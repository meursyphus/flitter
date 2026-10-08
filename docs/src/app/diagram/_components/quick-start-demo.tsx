"use client";

import LiveDiagram from "@/components/live-diagram";
import { createQuickStartDiagram } from "./demos";

/** The quick start editor, running. Connections get an arrow via `onConnect`. */
export default function QuickStartDemo() {
  return (
    <div className="not-prose my-6">
      <div className="h-[360px] overflow-hidden rounded-xl border border-line bg-[var(--chart-bg)]">
        <LiveDiagram create={createQuickStartDiagram} lazy />
      </div>
      <p className="mt-2 text-[13px] text-faint">
        Drag from a bottom handle to a top handle to add an edge. Select an
        element and press Backspace to delete it.
      </p>
    </div>
  );
}
