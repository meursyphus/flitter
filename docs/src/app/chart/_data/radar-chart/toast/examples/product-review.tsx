"use client";

import Widget from "@flitterjs/react";
import { ToastRadarChart } from "shared/chart";
import { Text, TextStyle, Container, BoxDecoration, EdgeInsets, BorderRadius, SizedBox } from "flitter-ui";

export default function ProductReviewRadarChart() {
  return (
    <Widget
      widget={ToastRadarChart({
        data: {
          labels: ["Price", "Quality", "Design", "Durability", "Support"],
          datasets: [
            { legend: "Product A", values: [60, 90, 85, 95, 70] },
            { legend: "Product B", values: [85, 70, 75, 60, 90] },
            { legend: "Product C", values: [75, 80, 90, 80, 65] },
          ],
        },
        custom: {
          radialAxisLabel: ({ value, index }: any) => {
            if (index === 0) return SizedBox.shrink();
            return Container({
              padding: EdgeInsets.symmetric({ horizontal: 4, vertical: 1 }),
              decoration: new BoxDecoration({
                color: "rgba(16, 185, 129, 0.08)",
                borderRadius: BorderRadius.circular(3),
              }),
              child: Text(`${value}%`, {
                style: new TextStyle({ fontSize: 9, color: "#059669", fontWeight: "600" }),
              }),
            });
          },
        },
        config: {
          colors: ["#10b981", "#f97316", "#8b5cf6"],
          radar: {
            fillOpacity: 0.2,
            gridColor: "rgba(16, 185, 129, 0.15)",
            gridWidth: 1.5,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
