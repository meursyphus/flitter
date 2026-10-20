"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import LiveDiagram from "@/components/live-diagram";
import type { Theme } from "@/lib/theme";
import CustomizationDemo, {
  CustomizationModel,
  builderNames,
  type Customization,
} from "../_overview/customization";

const choices = {
  node: [
    { value: "card", label: "Card" },
    { value: "circle", label: "Circle" },
    { value: "chart", label: "Chart" },
  ],
  edge: [
    { value: "line", label: "Line" },
    { value: "curve", label: "Curve" },
    { value: "pulse", label: "Pulse" },
  ],
  controls: [
    { value: "dock", label: "Dock" },
    { value: "rail", label: "Rail" },
  ],
} as const;

export default function CustomizationPlayground() {
  const [model] = useState(() => new CustomizationModel());
  const options = useSyncExternalStore(
    model.subscribe,
    model.getSnapshot,
    model.getSnapshot,
  );
  const [renderer, setRenderer] = useState<"svg" | "canvas">("svg");
  const [revision, setRevision] = useState(0);
  const create = useMemo(
    () => (theme: Theme) => CustomizationDemo(theme, model),
    [model],
  );
  const code = `custom: {\n  node: ${builderNames.node[options.node]},\n  edge: ${builderNames.edge[options.edge]},\n  controls: ${builderNames.controls[options.controls]},\n}`;
  const reset = () => {
    model.reset();
    setRevision((value) => value + 1);
  };
  return (
    <section
      data-customization-playground
      className="overflow-hidden rounded-2xl border border-line bg-[var(--chart-bg)]"
    >
      <div className="flex items-center justify-between gap-8 border-b border-line px-4 py-2.5">
        <div
          role="group"
          aria-label="Renderer"
          className="inline-flex rounded-lg border border-line bg-surface p-0.5"
        >
          {(["svg", "canvas"] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={renderer === value}
              onClick={() => setRenderer(value)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${renderer === value ? "bg-ink text-canvas" : "text-soft hover:text-ink"}`}
            >
              {value === "svg" ? "SVG" : "Canvas"}
            </button>
          ))}
        </div>
        <div className="border-l border-line pl-4">
          <button
            type="button"
            onClick={reset}
            className="rounded-md px-2 py-1.5 text-sm text-soft hover:bg-surface hover:text-ink"
          >
            Reset
          </button>
        </div>
      </div>
      <div className="grid xl:grid-cols-[250px_minmax(0,1fr)]">
        <div className="order-2 grid gap-6 border-t border-line bg-surface/50 p-5 sm:order-1 sm:grid-cols-3 sm:border-t-0 sm:border-b xl:grid-cols-1 xl:content-start xl:gap-8 xl:border-b-0 xl:border-r">
          {(Object.keys(choices) as (keyof Customization)[]).map((part) => (
            <fieldset key={part}>
              <legend className="mb-3 font-mono text-[15px] font-medium text-ink">
                custom.{part}
              </legend>
              <div className="flex flex-wrap gap-1.5">
                {choices[part].map((choice) => (
                  <button
                    key={choice.value}
                    type="button"
                    aria-pressed={options[part] === choice.value}
                    onClick={() => model.change(part, choice.value)}
                    className={`rounded-md border px-3 py-2 text-sm transition-colors ${options[part] === choice.value ? "border-accent bg-accent text-on-accent" : "border-line text-soft hover:border-line-strong hover:text-ink"}`}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
        <div
          data-customization-stage
          className="order-1 h-[340px] sm:order-2 sm:h-[480px] xl:h-[520px]"
        >
          <LiveDiagram
            key={`${renderer}-${revision}`}
            create={create}
            renderer={renderer}
          />
        </div>
      </div>
      <details className="border-t border-line px-5 py-4">
        <summary className="cursor-pointer text-base text-soft">Code</summary>
        <pre className="mt-4 overflow-x-auto font-mono text-base leading-7 text-ink">
          <code>{code}</code>
        </pre>
      </details>
    </section>
  );
}
