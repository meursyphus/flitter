"use client";

export const galleryTitle = "Bitcoin Monthly OHLC";

import Widget from "@flitterjs/react";
import { CandlestickChart } from "shared/chart";

function formatUsd(name: string, _index: number, axis: "x" | "y"): string {
  if (axis !== "y") return name;
  const v = Number(name);
  return Number.isFinite(v) ? `$${Math.round(v).toLocaleString("en-US")}` : name;
}

export function createWidget() {
  return CandlestickChart({
    data: {
      rows: [
        { tick: 0, open: 387.43, high: 411.70, low: 289.30, close: 338.32 },
        { tick: 1, open: 338.65, high: 457.09, low: 320.63, close: 378.05 },
        { tick: 2, open: 378.25, high: 384.04, low: 304.23, close: 320.19 },
        { tick: 3, open: 320.43, high: 320.43, low: 171.51, close: 217.46 },
        { tick: 4, open: 216.87, high: 265.61, low: 212.01, close: 254.26 },
        { tick: 5, open: 254.28, high: 300.04, low: 236.51, close: 244.22 },
        { tick: 6, open: 244.22, high: 261.80, low: 214.87, close: 236.15 },
        { tick: 7, open: 235.94, high: 247.80, low: 228.57, close: 230.19 },
        { tick: 8, open: 230.23, high: 267.87, low: 221.30, close: 263.07 },
        { tick: 9, open: 263.35, high: 314.39, low: 253.51, close: 284.65 },
        { tick: 10, open: 284.69, high: 285.71, low: 199.57, close: 230.06 },
        { tick: 11, open: 230.26, high: 259.18, low: 225.12, close: 236.06 },
        { tick: 12, open: 236.00, high: 334.17, low: 235.62, close: 314.17 },
        { tick: 13, open: 315.01, high: 495.56, low: 301.00, close: 377.32 },
        { tick: 14, open: 377.41, high: 469.10, low: 349.46, close: 430.57 },
        { tick: 15, open: 430.72, high: 462.93, low: 354.91, close: 368.77 },
        { tick: 16, open: 369.35, high: 448.05, low: 367.96, close: 437.70 },
        { tick: 17, open: 437.92, high: 439.65, low: 394.04, close: 416.73 },
        { tick: 18, open: 416.76, high: 467.96, low: 415.83, close: 448.32 },
        { tick: 19, open: 448.48, high: 553.96, low: 437.39, close: 531.39 },
        { tick: 20, open: 531.11, high: 778.00, low: 525.64, close: 673.34 },
        { tick: 21, open: 672.52, high: 704.97, low: 611.83, close: 624.68 },
        { tick: 22, open: 624.60, high: 626.12, low: 531.33, close: 575.47 },
        { tick: 23, open: 575.55, high: 628.82, low: 570.81, close: 609.73 },
        { tick: 24, open: 609.93, high: 720.40, low: 609.48, close: 700.97 },
      ],
      xKey: "tick",
    },
    config: {
      title: { text: "Bitcoin Monthly OHLC", visible: true },
      subtitle: { visible: true, text: "Sep 2014 – Oct 2016" },
      axis: { label: { format: formatUsd } },
    },
  });
}

export default function CandlestickChartAg() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
