"use client";

import Widget from "@flitterjs/react";
import { ToastRadarChart } from "shared/chart";
import { Align, Alignment, TextAlign, Row, SizedBox, MainAxisSize, Text, TextStyle } from "flitter-ui";

const skillEmojis: Record<string, string> = {
  JavaScript: "🟨",
  TypeScript: "🔷",
  React: "⚛️",
  "Node.js": "🟩",
  CSS: "🎨",
  GraphQL: "◆",
  Testing: "🧪",
  DevOps: "🔧",
};

export default function BasicRadarChart() {
  return (
    <Widget
      widget={ToastRadarChart({
        data: {
          labels: ["JavaScript", "TypeScript", "React", "Node.js", "CSS", "GraphQL", "Testing", "DevOps"],
          datasets: [
            { legend: "Senior Dev", values: [95, 90, 85, 80, 70, 75, 80, 65] },
            { legend: "Junior Dev", values: [70, 50, 60, 40, 65, 30, 35, 20] },
            { legend: "Full Stack", values: [80, 75, 70, 85, 60, 65, 70, 80] },
          ],
        },
        custom: {
          angularAxisLabel: ({ label, angle, nx, ny }: any) => {
            const emoji = skillEmojis[label] || "";
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const labelOffset = 0.12;
            const lx = nx + labelOffset * cos;
            const ly = ny + labelOffset * sin;

            return Align({
              alignment: new Alignment({ x: lx * 2 - 1, y: ly * 2 - 1 }),
              child: Row({
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(emoji, { style: new TextStyle({ fontSize: 11 }) }),
                  SizedBox({ width: 2 }),
                  Text(label, {
                    style: new TextStyle({ fontSize: 10, color: "#334155", fontWeight: "600" }),
                  }),
                ],
              }),
            });
          },
        },
        config: {
          title: { text: "Developer Skill Radar", visible: true },
          radar: { fillOpacity: 0.15, strokeWidth: 2.5 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
