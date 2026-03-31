"use client";

import Widget from "@flitterjs/react";
import { ToastBubbleChart as ToastBubbleChartWidget } from "shared/chart";

export default function StartupFundingToastBubble() {
  return (
    <Widget
      widget={ToastBubbleChartWidget({
        data: {
          datasets: [
            {
              legend: "SaaS",
              data: [
                { x: 1, y: 8, value: 25, label: "Seed - TaskFlow" },
                { x: 2, y: 45, value: 80, label: "Series A - DataSync" },
                { x: 3, y: 180, value: 250, label: "Series B - CloudPeak" },
                { x: 4, y: 500, value: 600, label: "Series C - MetricHub" },
              ],
            },
            {
              legend: "Biotech",
              data: [
                { x: 1, y: 12, value: 15, label: "Seed - GeneCure" },
                { x: 2, y: 80, value: 45, label: "Series A - BioNova" },
                { x: 3, y: 350, value: 120, label: "Series B - MediGen" },
                { x: 4, y: 900, value: 300, label: "Series C - NeuroPath" },
              ],
            },
            {
              legend: "Clean Energy",
              data: [
                { x: 1, y: 5, value: 10, label: "Seed - SolarFlux" },
                { x: 2, y: 30, value: 55, label: "Series A - WindCore" },
                { x: 3, y: 120, value: 180, label: "Series B - HydroGen" },
                { x: 4, y: 400, value: 450, label: "Series C - FusionTech" },
              ],
            },
          ],
        },
        config: {
          bubble: { minRadius: 6, maxRadius: 40, opacity: 0.45 },
          colors: ["#10b981", "#f59e0b", "#ef4444"],
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
