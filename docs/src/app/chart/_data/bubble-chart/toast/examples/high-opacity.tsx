"use client";

import Widget from "@flitterjs/react";
import { ToastBubbleChart as ToastBubbleChartWidget } from "shared/chart";

export default function HighOpacityToastBubbleChart() {
  return (
    <Widget
      widget={ToastBubbleChartWidget({
        data: {
          datasets: [
            {
              legend: "Europe",
              data: [
                { x: 23300, y: 79.37, value: 40280780, label: "Spain" },
                { x: 27700, y: 79.54, value: 58057477, label: "Italy" },
                { x: 28700, y: 78.54, value: 22424609, label: "Germany" },
                { x: 28700, y: 79.44, value: 30424213, label: "France" },
                { x: 29600, y: 78.27, value: 60270708, label: "United Kingdom" },
                { x: 33800, y: 80.31, value: 7450867, label: "Switzerland" },
              ],
            },
            {
              legend: "Asia",
              data: [
                { x: 19200, y: 75.58, value: 48598170, label: "Korea, South" },
                { x: 25300, y: 77.06, value: 22749838, label: "Taiwan" },
                { x: 27800, y: 81.53, value: 4353893, label: "Singapore" },
                { x: 29400, y: 81.04, value: 52733300, label: "Japan" },
              ],
            },
          ],
        },
        config: {
          bubble: { opacity: 1.0 },
          colors: ["#dc2626", "#2563eb", "#059669", "#7c3aed", "#d97706"],
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
