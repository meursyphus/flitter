"use client";

import Widget from "@flitterjs/react";
import { StackedBarChart } from "shared/chart";
import {
  Row,
  Container,
  BoxDecoration,
  EdgeInsets,
  SizedBox,
  Text,
  TextStyle,
  CrossAxisAlignment,
  BorderRadius,
} from "flitter-ui";

export default function ProjectHoursAg() {
  return (
    <Widget
      widget={StackedBarChart({
        direction: "vertical",
        data: {
          labels: ["Auth Service", "Dashboard", "Mobile App", "Data Pipeline", "Admin Portal"],
          datasets: [
            { legend: "Design", values: [40, 64, 56, 24, 32] },
            { legend: "Development", values: [120, 180, 160, 200, 96] },
            { legend: "QA", values: [32, 48, 44, 56, 28] },
          ],
        },
        custom: {
          title: () =>
            Row({
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container({
                  width: 3,
                  height: 16,
                  decoration: new BoxDecoration({
                    color: "#6366f1",
                    borderRadius: BorderRadius.circular(2),
                  }),
                }),
                SizedBox({ width: 8 }),
                Text("Sprint Effort Breakdown", {
                  style: new TextStyle({
                    fontSize: 14,
                    fontWeight: "700",
                    color: "#1e293b",
                  }),
                }),
              ],
            }),
        },
        config: {
          title: { text: "Hours by Phase", visible: true },
          subtitle: { text: "Q4 2025 Sprint Review", visible: true },
          colors: { fills: ["#f59e0b", "#3b82f6", "#10b981"], strokes: ["#f59e0b", "#3b82f6", "#10b981"] },
          grid: { dash: [2, 2] },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
