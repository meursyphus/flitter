"use client";

import Widget from "@flitterjs/react";
import { ToastAreaChart as ToastAreaChartWidget } from "shared/chart";

export default function EnergyConsumptionToastArea() {
  return (
    <Widget
      widget={ToastAreaChartWidget({
        data: {
          labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
          datasets: [
            { legend: "Solar (MWh)", values: [120, 210, 420, 510, 350, 150] },
            { legend: "Wind (MWh)", values: [380, 310, 220, 160, 240, 360] },
            { legend: "Grid (MWh)", values: [500, 440, 320, 280, 370, 470] },
          ],
        },
        config: {
          colors: ["#eab308", "#22c55e", "#64748b"],
          area: {
            strokeWidth: 2,
            opacity: 0.35,
            spline: true,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
