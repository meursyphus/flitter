"use client";

import Widget from "@flitterjs/react";
import { AreaChart } from "shared/chart";
import {
  Row,
  Container,
  BoxDecoration,
  SizedBox,
  Text,
  TextStyle,
  CrossAxisAlignment,
  BorderRadius,
  BoxShadow,
} from "flitter-ui";

const colors = ["#22d3ee", "#a78bfa", "#f87171"];

export default function DarkMonitoringAgArea() {
  return (
    <Widget
      widget={AreaChart({
        data: {
          labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
          datasets: [
            { legend: "Inbound (Gbps)", values: [1.2, 0.4, 3.8, 6.5, 5.1, 2.8] },
            { legend: "Outbound (Gbps)", values: [0.9, 0.3, 2.5, 4.8, 3.9, 2.1] },
            { legend: "Errors (K)", values: [0.1, 0.05, 0.3, 0.8, 0.6, 0.2] },
          ],
        },
        config: {
          colors: { fills: ["#22d3ee", "#a78bfa", "#f87171"], strokes: ["#22d3ee", "#a78bfa", "#f87171"] },
          background: "#111827",
          grid: { dash: [4, 4], color: "rgba(255,255,255,0.1)" },
          axis: { color: "rgba(255,255,255,0.3)", label: { color: "rgba(255,255,255,0.6)" } },
          area: {
            strokeWidth: 1.5,
            opacity: 0.2,
            spline: true,
          },
        },
        custom: {
          legend: ({ name, index }: { name: string; index: number }) =>
            Row({
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container({
                  width: 8,
                  height: 8,
                  decoration: new BoxDecoration({
                    color: colors[index],
                    borderRadius: BorderRadius.circular(4),
                    boxShadow: [
                      new BoxShadow({
                        color: colors[index] + "80",
                        blurRadius: 6,
                      }),
                    ],
                  }),
                }),
                SizedBox({ width: 6 }),
                Text(name, {
                  style: new TextStyle({
                    fontSize: 11,
                    color: "rgba(255,255,255,0.7)",
                  }),
                }),
              ],
            }),
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
