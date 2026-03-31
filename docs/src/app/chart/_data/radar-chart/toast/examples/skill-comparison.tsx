"use client";

import Widget from "@flitterjs/react";
import { ToastRadarChart } from "shared/chart";
import { Align, Alignment, TextAlign, Text, TextStyle, Column, MainAxisSize } from "flitter-ui";

const aliceValues = [90, 85, 95, 70, 80, 92];
const bobValues = [75, 92, 60, 95, 65, 78];

export default function SkillComparisonRadarChart() {
  return (
    <Widget
      widget={ToastRadarChart({
        data: {
          labels: ["Leadership", "Problem Solving", "Communication", "Technical", "Creativity", "Teamwork"],
          datasets: [
            { legend: "Alice", values: aliceValues },
            { legend: "Bob", values: bobValues },
          ],
        },
        custom: {
          angularAxisLabel: ({ index, label, angle, nx, ny }: any) => {
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const labelOffset = 0.13;
            const lx = nx + labelOffset * cos;
            const ly = ny + labelOffset * sin;

            const diff = aliceValues[index] - bobValues[index];
            const winner = diff > 0 ? "A" : diff < 0 ? "B" : "=";
            const winColor = diff > 0 ? "#3b82f6" : diff < 0 ? "#ef4444" : "#94a3b8";

            return Align({
              alignment: new Alignment({ x: lx * 2 - 1, y: ly * 2 - 1 }),
              child: Column({
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(label, {
                    style: new TextStyle({ fontSize: 10, color: "#475569" }),
                  }),
                  Text(winner === "=" ? "TIE" : `${winner} +${Math.abs(diff)}`, {
                    style: new TextStyle({ fontSize: 9, color: winColor, fontWeight: "700" }),
                  }),
                ],
              }),
            });
          },
        },
        config: {
          colors: ["#3b82f6", "#ef4444"],
          radar: { fillOpacity: 0.12, strokeWidth: 2.5 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
