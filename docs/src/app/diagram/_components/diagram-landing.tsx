"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import LiveDiagram from "@/components/live-diagram";
import { createHeroDiagram, layoutDemos } from "./demos";

type Renderer = "svg" | "canvas";

const FEATURES = [
  {
    title: "React Flow's interactions",
    body: "Drag to pan, wheel to zoom, Shift+drag to box-select, drag between handles to connect, drag an edge end to reconnect it. Defaults match React Flow.",
  },
  {
    title: "Mouse and touch",
    body: "On touch screens a tap selects, one finger drags nodes or pans, and two fingers pinch to zoom around their midpoint.",
  },
  {
    title: "Resizer and toolbar",
    body: "Selected nodes can show resize controls and a toolbar that stays at screen size, like React Flow's NodeResizer and NodeToolbar.",
  },
  {
    title: "Rebuilds only what changed",
    body: "Each node and edge widget listens to its own signal. Dragging a node rebuilds that node and its edges; panning and zooming rebuild none.",
  },
  {
    title: "SVG or Canvas",
    body: "The editor is a Flitter widget tree, so either renderer draws it. Nodes, edges, the background and the minimap all follow.",
  },
  {
    title: "Pluggable layouts",
    body: "Layered, tree, force, grid and circular ship built in, and children are laid out inside their group. dagre or ELK plug in as one async function.",
  },
];

const HINTS = [
  "Drag a node",
  "Wheel or pinch to zoom",
  "Shift+drag to select",
  "Drag from a handle to connect",
  "Drag an edge end to reconnect",
  "Backspace deletes",
];

function RendererToggle({ value, onChange }: { value: Renderer; onChange: (r: Renderer) => void }) {
  return (
    <div role="radiogroup" aria-label="Renderer" className="flex rounded-lg border border-line p-0.5">
      {(["svg", "canvas"] as const).map((r) => (
        <button
          key={r}
          role="radio"
          aria-checked={r === value}
          onClick={() => onChange(r)}
          className={clsx(
            "rounded-md px-3 py-1 text-[13px] font-semibold transition-colors",
            r === value ? "bg-accent text-on-accent" : "text-soft hover:text-ink",
          )}
        >
          {r === "svg" ? "SVG" : "Canvas"}
        </button>
      ))}
    </div>
  );
}

function LayoutPlayground() {
  const [layoutId, setLayoutId] = useState<(typeof layoutDemos)[number]["id"]>("layered");
  const demo = layoutDemos.find((d) => d.id === layoutId)!;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-[var(--chart-bg)]">
      <div role="tablist" aria-label="Layout algorithm" className="flex flex-wrap gap-1 border-b border-line px-3 py-2.5">
        {layoutDemos.map((d) => (
          <button
            key={d.id}
            role="tab"
            aria-selected={d.id === layoutId}
            onClick={() => setLayoutId(d.id)}
            className={clsx(
              "rounded-md px-2.5 py-1 text-[13px] font-medium transition-colors",
              d.id === layoutId ? "bg-surface text-ink" : "text-faint hover:text-ink",
            )}
          >
            {d.label}
          </button>
        ))}
      </div>
      <div className="h-[420px]">
        <LiveDiagram create={demo.create} lazy />
      </div>
    </div>
  );
}

export default function DiagramLanding({
  minimalCodeBlock,
  customNodeCodeBlock,
}: {
  minimalCodeBlock?: React.ReactNode;
  customNodeCodeBlock?: React.ReactNode;
}) {
  const [renderer, setRenderer] = useState<Renderer>("svg");

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="artboard pointer-events-none absolute inset-0" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[620px] rounded-full blur-[120px]"
          style={{ background: "var(--script)", opacity: "calc(var(--glow) * 0.45)" }}
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 md:px-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:py-20">
          <div>
            <h1 className="wordmark text-[clamp(3.25rem,8vw,6rem)] leading-[0.92] text-ink">
              Flitter
              <br />
              <span className="text-script">Diagram</span>
            </h1>
            <p className="mt-6 max-w-md text-[18px] leading-relaxed text-soft">
              Node and edge editors with React Flow&apos;s interactions, drawn
              by Flitter on SVG or Canvas.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/diagram/quick-start"
                className="inline-flex h-11 items-center rounded-lg bg-accent px-6 text-[15px] font-semibold text-on-accent transition-opacity hover:opacity-90"
              >
                Quick start
              </Link>
              <Link
                href="/diagram/api"
                className="inline-flex h-11 items-center rounded-lg border border-line-strong px-6 text-[15px] font-semibold text-ink transition-colors hover:bg-surface"
              >
                API reference
              </Link>
            </div>

            <dl className="mt-10 flex gap-8 border-t border-line pt-6">
              <div>
                <dt className="text-[13px] text-faint">Layouts</dt>
                <dd className="display mt-1 text-[28px] text-ink">5</dd>
              </div>
              <div>
                <dt className="text-[13px] text-faint">Edge paths</dt>
                <dd className="display mt-1 text-[28px] text-ink">5</dd>
              </div>
              <div>
                <dt className="text-[13px] text-faint">Renderers</dt>
                <dd className="display mt-1 text-[28px] text-ink">2</dd>
              </div>
            </dl>
          </div>

          <div className="overflow-hidden rounded-2xl border border-line bg-[var(--chart-bg)] shadow-[0_40px_120px_-40px_color-mix(in_oklab,var(--script)_45%,transparent)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-3 py-2.5">
              <span className="px-1 text-[13px] font-medium text-soft">Deploy pipeline</span>
              <RendererToggle value={renderer} onChange={setRenderer} />
            </div>
            <div className="h-[380px] sm:h-[440px]">
              <LiveDiagram create={createHeroDiagram} renderer={renderer} />
            </div>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 border-t border-line px-4 py-3 text-[12px] text-faint">
              {HINTS.map((hint) => (
                <li key={hint}>{hint}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Minimal example */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-10 lg:py-28">
        <h2 className="display text-[clamp(2rem,4vw,3rem)] text-ink">Nodes in, editor out</h2>
        <div className="mt-5 grid items-start gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-12">
          <div className="max-w-md text-[16px] leading-relaxed text-soft">
            <p>
              Describe nodes and edges as plain objects, the same shape React
              Flow uses. <code>FlowDiagram</code> returns a widget with
              panning, zooming, selection, connecting, controls and a minimap
              already wired.
            </p>
            <p className="mt-4">
              The editor keeps its own state. Change callbacks tell you what
              happened, and a <code>FlowController</code> lets you change it
              from outside.
            </p>
            <Link
              href="/diagram/quick-start"
              className="mt-6 inline-block text-[15px] font-semibold text-accent underline-offset-4 hover:underline"
            >
              Walk through the quick start
            </Link>
          </div>
          <div>{minimalCodeBlock}</div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-line bg-surface/50">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-2 md:px-10 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="border-l-2 border-script pl-5">
              <h3 className="text-[16px] font-semibold text-ink">{f.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-soft">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Layouts */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-10 lg:py-28">
        <h2 className="display text-[clamp(2rem,4vw,3rem)] text-ink">One graph, five layouts</h2>
        <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-soft">
          Every node below starts at the origin. The layout runs once the
          nodes are measured, then fits the view. Switch the algorithm to see
          the same graph placed differently.
        </p>
        <div className="mt-8">
          <LayoutPlayground />
        </div>
      </section>

      {/* Custom nodes */}
      <section className="mx-auto max-w-6xl px-5 pb-24 md:px-10">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-12">
          <div className="max-w-md">
            <h2 className="display text-[clamp(2rem,4vw,3rem)] text-ink">Bring your own nodes</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-soft">
              A node type is a builder that returns any Flitter widget, plus
              the handles it exposes. Handles are declared, not measured, so
              edges know where to attach before anything is painted.
            </p>
            <div className="mt-6 flex flex-col gap-2 text-[15px] font-semibold">
              <Link href="/diagram/api/nodes-and-handles" className="text-accent underline-offset-4 hover:underline">
                Nodes and handles
              </Link>
              <Link href="/diagram/api/styling" className="text-accent underline-offset-4 hover:underline">
                Styling and headless mode
              </Link>
            </div>
          </div>
          <div>{customNodeCodeBlock}</div>
        </div>
      </section>
    </div>
  );
}
