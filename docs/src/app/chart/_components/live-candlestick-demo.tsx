"use client";

import LiveChart from "@/components/live-chart";
import { CandlestickChart } from "@/lib/charts";
import { bitcoinMonthlyRows } from "./bitcoin-candlestick-data";

function formatUsd(name: string, _index: number, axis: "x" | "y"): string {
  if (axis !== "y") return name;
  const v = Number(name);
  return Number.isFinite(v) ? `$${Math.round(v).toLocaleString("en-US")}` : name;
}

function createWidget() {
  return CandlestickChart({
    data: { rows: bitcoinMonthlyRows, xKey: "date" },
    config: {
      title: { text: "Bitcoin USD" },
      subtitle: { visible: true, text: "(BTC-USD)" },
      axis: { label: { format: formatUsd } },
      legend: { visible: false },
    },
  });
}

export default function LiveCandlestickDemo() {
  return <LiveChart create={createWidget} renderer="canvas" lazy />;
}
