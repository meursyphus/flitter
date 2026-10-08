"use client";

import LiveDiagram from "@/components/live-diagram";
import { createInteractionDiagram } from "./demos";

/** Resizing, a node toolbar and edge reconnection, running. */
export default function InteractionDemo() {
  return (
    <div className="not-prose my-6">
      <div className="h-[380px] overflow-hidden rounded-xl border border-line bg-[var(--chart-bg)]">
        <LiveDiagram create={createInteractionDiagram} lazy />
      </div>
      <p className="mt-2 text-[13px] text-faint">
        The first node starts selected: drag a corner or side to resize it,
        or use its toolbar. Press the labelled edge just above the Output
        node&apos;s handle and drag it onto the other node&apos;s handle to
        reconnect it.
      </p>
    </div>
  );
}
