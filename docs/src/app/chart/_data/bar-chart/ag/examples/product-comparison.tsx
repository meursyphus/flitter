"use client";

import Widget from "@flitterjs/react";
import {
  Transform,
  Text,
  TextStyle,
  Alignment,
  Container,
} from "flitter-ui";
import { BarChart } from "shared/chart";

export default function ProductComparisonAg() {
  return (
    <Widget
      widget={BarChart({
        direction: "vertical",
        data: {
          labels: ["Battery Life", "Camera Quality", "Performance", "Customer Support", "Value for Money"],
          datasets: [
            { legend: "Product A", values: [88, 76, 92, 65, 70] },
            { legend: "Product B", values: [72, 91, 68, 82, 85] },
            { legend: "Product C", values: [81, 84, 79, 90, 62] },
          ],
        },
        custom: {
          xAxisLabel: ({ name }: { name: string; index: number }) =>
            Transform.rotate({
              angle: -Math.PI / 7,
              alignment: Alignment.center,
              child: Text(name, {
                style: new TextStyle({ fontSize: 11, color: "#64748b" }),
              }),
            }),
        },
        config: {
          colors: { fills: ["#0ea5e9", "#f97316", "#8b5cf6"] },
          bar: { cornerRadius: 3 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
