"use client";

import Widget from "@flitterjs/react";
import { ToastRadarChart } from "shared/chart";
import { Text, TextStyle, SizedBox } from "flitter-ui";

const units: Record<number, string> = { 0: "g", 1: "g", 2: "g", 3: "g", 4: "mg" };

export default function NutritionProfileRadar() {
  return (
    <Widget
      widget={ToastRadarChart({
        data: {
          labels: ["Protein", "Carbs", "Fat", "Fiber", "Vitamins"],
          datasets: [
            { legend: "Chicken Breast", values: [95, 5, 20, 0, 35] },
            { legend: "Brown Rice", values: [15, 90, 8, 65, 30] },
            { legend: "Avocado", values: [12, 20, 85, 55, 72] },
          ],
        },
        custom: {
          radialAxisLabel: ({ value, index }: any, context: any) => {
            if (index === 0) return SizedBox.shrink();
            return Text(`${value}`, {
              style: new TextStyle({
                fontSize: 9,
                color: value >= 60 ? "#dc2626" : value >= 30 ? "#d97706" : "#16a34a",
                fontWeight: "500",
              }),
            });
          },
        },
        config: {
          colors: ["#22c55e", "#f97316", "#ef4444"],
          radar: {
            fillOpacity: 0.2,
            gridColor: "rgba(34, 197, 94, 0.12)",
            gridWidth: 2,
            axisColor: "rgba(34, 197, 94, 0.2)",
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
