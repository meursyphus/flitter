"use client";

import Widget from "@flitterjs/react";
import { StackedBarChart } from "shared/chart";

export default function RevenueByProductAg() {
  return (
    <Widget
      widget={StackedBarChart({
        direction: "vertical",
        data: {
          labels: ["Q1 2023", "Q2 2023", "Q3 2023", "Q4 2023", "Q1 2024", "Q2 2024"],
          datasets: [
            { legend: "SaaS Platform", values: [850, 920, 980, 1050, 1120, 1200] },
            { legend: "Mobile App", values: [320, 380, 420, 460, 510, 560] },
            { legend: "API Services", values: [180, 210, 240, 280, 320, 370] },
          ],
        },
        config: {
          colors: { fills: ["#0d9488", "#d97706", "#7c3aed"], strokes: ["#0d9488", "#d97706", "#7c3aed"] },
          background: "#fafafa",
          bar: { gap: 4 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
