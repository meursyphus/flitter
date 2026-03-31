"use client";

import Widget from "@flitterjs/react";
import { ScatterChart } from "shared/chart";

export default function CompactCorrelationAg() {
  return (
    <Widget
      widget={ScatterChart({
        data: {
          datasets: [
            {
              legend: "Engagement",
              data: [
                { x: 2.1, y: 34, label: "Email" },
                { x: 4.8, y: 67, label: "Social" },
                { x: 3.2, y: 48, label: "Blog" },
                { x: 6.5, y: 82, label: "Webinar" },
                { x: 1.8, y: 28, label: "Print" },
                { x: 5.1, y: 71, label: "Video" },
                { x: 3.9, y: 55, label: "Podcast" },
              ],
            },
            {
              legend: "Conversion",
              data: [
                { x: 1.5, y: 12, label: "Email" },
                { x: 3.6, y: 29, label: "Social" },
                { x: 2.4, y: 18, label: "Blog" },
                { x: 5.2, y: 41, label: "Webinar" },
                { x: 1.1, y: 8, label: "Print" },
                { x: 4.3, y: 35, label: "Video" },
                { x: 2.8, y: 22, label: "Podcast" },
              ],
            },
            {
              legend: "Retention",
              data: [
                { x: 3.0, y: 58, label: "Email" },
                { x: 2.2, y: 42, label: "Social" },
                { x: 4.1, y: 63, label: "Blog" },
                { x: 5.8, y: 78, label: "Webinar" },
                { x: 1.4, y: 31, label: "Print" },
                { x: 4.6, y: 69, label: "Video" },
                { x: 3.5, y: 52, label: "Podcast" },
              ],
            },
          ],
        },
        config: {
          scatter: { size: 8, strokeWidth: 2 },
          colors: {
            fills: ["#6366f1", "#f43f5e", "#10b981"],
            strokes: ["#6366f1", "#f43f5e", "#10b981"],
          },
          grid: { dash: [3, 3] },
          legend: { position: "right-top" },
          background: "#fafafa",
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
