"use client";

import Widget from "@flitterjs/react";
import { ToastStackedAreaChart as ToastStackedAreaChartWidget } from "shared/chart";

export default function EnergyMixToastStackedArea() {
  return (
    <Widget
      widget={ToastStackedAreaChartWidget({
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            { legend: "Solar", values: [120, 140, 180, 240, 310, 380, 400, 370, 290, 210, 150, 110] },
            { legend: "Wind", values: [280, 260, 240, 220, 200, 180, 170, 190, 230, 270, 290, 300] },
            { legend: "Gas", values: [350, 340, 310, 280, 250, 230, 220, 225, 260, 300, 330, 360] },
            { legend: "Nuclear", values: [400, 400, 395, 405, 400, 410, 405, 400, 398, 402, 400, 405] },
          ],
        },
        config: {
          colors: ["#eab308", "#22c55e", "#64748b", "#a855f7"],
          area: { opacity: 0.55, spline: true },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
