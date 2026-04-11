"use client";

import Widget from "@flitterjs/react";
import { CandlestickChart } from "shared/chart";
import { bitcoinMonthlyRows } from "./bitcoin-candlestick-data";

function formatUsd(name: string, _index: number, axis: "x" | "y"): string {
  if (axis !== "y") return name;
  const v = Number(name);
  return Number.isFinite(v) ? `$${Math.round(v).toLocaleString("en-US")}` : name;
}

export default function LiveCandlestickDemo() {
  const widget = CandlestickChart({
    data: { rows: bitcoinMonthlyRows, xKey: "date" },
    config: {
      title: { text: "Bitcoin USD" },
      subtitle: { visible: true, text: "(BTC-USD)" },
      axis: { label: { format: formatUsd } },
      legend: { visible: false },
    },
  });

  return (
    <Widget widget={widget} width="100%" height="100%" renderer="canvas" />
  );
}
