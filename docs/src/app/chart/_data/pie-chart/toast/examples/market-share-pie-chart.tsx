"use client";

import Widget from "@flitterjs/react";
import { ToastPieChart } from "shared/chart";

export default function MarketSharePieChart() {
  return (
    <Widget
      widget={ToastPieChart({
        data: {
          datasets: [
            { name: "Apple", value: 28 },
            { name: "Samsung", value: 22 },
            { name: "Xiaomi", value: 13 },
            { name: "Oppo", value: 9 },
            { name: "Vivo", value: 8 },
            { name: "Others", value: 20 },
          ],
        },
        config: {
          colors: ["#3b82f6", "#10b981", "#f97316", "#8b5cf6", "#ef4444", "#64748b"],
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
