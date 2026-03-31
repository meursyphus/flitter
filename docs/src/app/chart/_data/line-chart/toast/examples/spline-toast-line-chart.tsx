"use client";

import Widget from "@flitterjs/react";
import { Container, BoxDecoration, EdgeInsets } from "flitter-ui";
import { ToastLineChart as ToastLineChartWidget } from "shared/chart";

export default function SplineToastLineChart() {
  return (
    <Widget
      widget={ToastLineChartWidget({
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            { legend: "Housing starts (MoM %)", values: [0, 12.38, -15.46, 5.56, -4.98, 0.84, -4.67, 9.96, -2.44, -0.37, -4.22, 16.91] },
            { legend: "Unemployment rate \u0394 (pp)", values: [0, 11.2, -8.4, 6.9, -5.8, 7.5, -6.2, 4.9, -4.1, 8.1, -5.6, 7.2] },
            { legend: "CPI MoM (1/10 index pts)", values: [0, 12.69, 13.78, 6.78, 1.52, -1.31, 5.25, 4.93, 6.70, 8.99, 8.97, 10.76] },
          ],
        },
        custom: {
          gridYLine: (_args: any, _ctx: any) => {
            return Container({
              decoration: new BoxDecoration({ color: "#e2e8f0" }),
              height: 1,
              margin: EdgeInsets.symmetric({ vertical: 0 }),
            });
          },
          gridXLine: (_args: any, _ctx: any) => {
            return Container({
              decoration: new BoxDecoration({ color: "#e2e8f0" }),
              width: 1,
            });
          },
        },
        config: {
          colors: ["#6366f1", "#ec4899"],
          grid: { color: "#e2e8f0" },
          line: {
            strokeWidth: 2,
            spline: true,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
