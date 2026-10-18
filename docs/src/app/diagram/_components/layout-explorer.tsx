"use client";

import { useState } from "react";
import LiveDiagram from "@/components/live-diagram";
import { layoutDemos } from "./demos";

export default function LayoutExplorer() {
  const [active, setActive] = useState<string>("layered");
  const demo = layoutDemos.find((entry) => entry.id === active)!;
  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-line bg-[var(--chart-bg)]">
      <div role="group" aria-label="Choose a layout" className="flex flex-wrap gap-1 border-b border-line p-3">
        {layoutDemos.map((entry) => <button key={entry.id} type="button" aria-pressed={active === entry.id}
          onClick={() => setActive(entry.id)}
          className={`rounded px-3 py-1.5 text-xs font-medium ${active === entry.id ? "bg-accent text-on-accent" : "text-soft hover:bg-surface"}`}>
          {entry.label}
        </button>)}
      </div>
      <div className="h-[400px]"><LiveDiagram create={demo.create} lazy /></div>
      <p className="border-t border-line px-4 py-3 text-xs text-soft">Same service graph, different placement. Drag the nodes after layout to keep editing.</p>
    </div>
  );
}
