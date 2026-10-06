"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import CopyCommand from "@/components/copy-command";
import LiveChart from "@/components/live-chart";
import {
  AreaChart,
  BarChart,
  LineChart,
  RadarChart,
  StackedBarChart,
  ToastAreaChart,
  ToastBarChart,
  ToastLineChart,
  ToastRadarChart,
  ToastStackedBarChart,
} from "@/lib/charts";

type Style = "ag" | "toast";

const signups = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    { legend: "Organic", values: [420, 510, 480, 620, 700, 760] },
    { legend: "Referral", values: [210, 260, 330, 310, 390, 450] },
    { legend: "Paid", values: [150, 180, 160, 240, 220, 300] },
  ],
};

const skills = {
  labels: ["Layout", "Paint", "Gesture", "Animation", "Text", "Canvas"],
  datasets: [
    { legend: "Flitter", values: [92, 88, 80, 85, 76, 90] },
    { legend: "Hand-rolled SVG", values: [55, 70, 45, 40, 60, 35] },
  ],
};

const CHARTS = [
  {
    id: "bar-chart",
    label: "Bar",
    create: {
      ag: () => BarChart({ data: signups, config: { title: { text: "Signups by channel" } } }),
      toast: () => ToastBarChart({ data: signups, config: { title: { text: "Signups by channel" } } }),
    },
  },
  {
    id: "line-chart",
    label: "Line",
    create: {
      ag: () => LineChart({ data: signups, config: { title: { text: "Signups by channel" } } }),
      toast: () => ToastLineChart({ data: signups, config: { title: { text: "Signups by channel" } } }),
    },
  },
  {
    id: "area-chart",
    label: "Area",
    create: {
      ag: () =>
        AreaChart({ data: signups, config: { title: { text: "Signups by channel" }, area: { spline: true } } }),
      toast: () =>
        ToastAreaChart({ data: signups, config: { title: { text: "Signups by channel" }, area: { spline: true } } }),
    },
  },
  {
    id: "stacked-bar-chart",
    label: "Stacked",
    create: {
      ag: () => StackedBarChart({ data: signups, config: { title: { text: "Total signups" } } }),
      toast: () => ToastStackedBarChart({ data: signups, config: { title: { text: "Total signups" } } }),
    },
  },
  {
    id: "radar-chart",
    label: "Radar",
    create: {
      ag: () => RadarChart({ data: skills, config: { title: { text: "Rendering coverage" } } }),
      toast: () => ToastRadarChart({ data: skills, config: { title: { text: "Rendering coverage" } } }),
    },
  },
] as const;

const STYLES: { id: Style; label: string }[] = [
  { id: "ag", label: "AG" },
  { id: "toast", label: "Toast" },
];

/**
 * The same data through both visual styles. Switching re-creates the widget,
 * so Toast replays its entrance animation.
 */
export default function ChartPlayground() {
  const [chartId, setChartId] = useState<(typeof CHARTS)[number]["id"]>("bar-chart");
  const [style, setStyle] = useState<Style>("toast");

  const chart = CHARTS.find((c) => c.id === chartId)!;
  const create = useMemo(() => chart.create[style], [chart, style]);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-[var(--chart-bg)] shadow-[0_40px_120px_-40px_color-mix(in_oklab,var(--chart)_45%,transparent)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-3 py-2.5">
        <div role="tablist" aria-label="Chart type" className="flex flex-wrap gap-1">
          {CHARTS.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={c.id === chartId}
              onClick={() => setChartId(c.id)}
              className={clsx(
                "rounded-md px-2.5 py-1 text-[13px] font-medium transition-colors",
                c.id === chartId ? "bg-surface text-ink" : "text-faint hover:text-ink",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div
          role="radiogroup"
          aria-label="Visual style"
          className="flex rounded-lg border border-line p-0.5"
        >
          {STYLES.map((s) => (
            <button
              key={s.id}
              role="radio"
              aria-checked={s.id === style}
              onClick={() => setStyle(s.id)}
              className={clsx(
                "rounded-md px-3 py-1 text-[13px] font-semibold transition-colors",
                s.id === style ? "bg-accent text-on-accent" : "text-soft hover:text-ink",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[340px] p-4 sm:h-[380px] sm:p-5">
        <LiveChart create={create} />
      </div>

      <div className="border-t border-line px-3 py-3">
        <CopyCommand
          command={`npx flitter-ui add ${chart.id} --${style}`}
          className="w-full !bg-transparent !border-0 !px-1"
        />
      </div>
    </div>
  );
}
