"use client";

import Widget from "@flitterjs/react";
import { ToastStackedBarChart as ToastStackedBarChartWidget } from "shared/chart";

export default function EnergySourceToast() {
  return (
    <Widget
      widget={ToastStackedBarChartWidget({
        direction: "vertical",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            { legend: "Solar", values: [120, 140, 180, 220, 280, 320, 340, 310, 260, 200, 150, 110] },
            { legend: "Wind", values: [200, 210, 190, 170, 160, 140, 130, 145, 175, 195, 220, 230] },
            { legend: "Hydro", values: [150, 160, 180, 200, 190, 170, 155, 140, 150, 165, 170, 155] },
            { legend: "Nuclear", values: [300, 300, 295, 305, 300, 310, 305, 300, 298, 302, 300, 305] },
          ],
        },
        config: { colors: ["#eab308", "#22c55e", "#06b6d4", "#a855f7"] },
      })}
      width="100%"
      height="100%"
    />
  );
}
