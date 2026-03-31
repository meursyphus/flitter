"use client";

import Widget from "@flitterjs/react";
import { ToastRadarChart } from "shared/chart";
import { Text, TextStyle, Container, BoxDecoration, EdgeInsets, BorderRadius } from "flitter-ui";

const scores = [88, 92, 75, 95, 80];

export default function TeamPerformanceCardToast() {
  return (
    <Widget
      widget={ToastRadarChart({
        data: {
          labels: ["Execution", "Collaboration", "Initiative", "Reliability", "Growth"],
          datasets: [
            { legend: "Q4 Review", values: [88, 92, 75, 95, 80] },
            { legend: "Q3 Review", values: [78, 85, 70, 90, 72] },
          ],
        },
        custom: {
          angularAxisLabel: ({ index, label }: { index: number; label: string; angle: number; nx: number; ny: number }) => {
            const isWeak = scores[index] < 80;
            return isWeak
              ? Container({
                  padding: EdgeInsets.symmetric({ horizontal: 6, vertical: 2 }),
                  decoration: new BoxDecoration({
                    color: "#fef2f2",
                    borderRadius: BorderRadius.circular(4),
                  }),
                  child: Text(label, { style: new TextStyle({ fontSize: 11, color: "#dc2626", fontWeight: "600" }) }),
                })
              : Text(label, { style: new TextStyle({ fontSize: 11, color: "#475569" }) });
          },
        },
        config: {
          title: { text: "Team Metrics", visible: true, alignment: "center" },
          colors: ["#6366f1", "#a5b4fc"],
          radar: { fillOpacity: 0.2, strokeWidth: 2.5 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
