"use client";

import Widget from "@flitterjs/react";
import { ToastScatterChart as ToastScatterChartWidget } from "shared/chart";

export default function SalesVsMarketingToast() {
  return (
    <Widget
      widget={ToastScatterChartWidget({
        data: {
          datasets: [
            {
              legend: "Electronics",
              data: [
                { x: 12, y: 85, label: "Q1" },
                { x: 18, y: 120, label: "Q2" },
                { x: 25, y: 155, label: "Q3" },
                { x: 30, y: 190, label: "Q4" },
                { x: 22, y: 140, label: "Q5" },
              ],
            },
            {
              legend: "Apparel",
              data: [
                { x: 8, y: 45, label: "Q1" },
                { x: 15, y: 78, label: "Q2" },
                { x: 20, y: 95, label: "Q3" },
                { x: 28, y: 130, label: "Q4" },
                { x: 35, y: 160, label: "Q5" },
              ],
            },
            {
              legend: "Food & Beverage",
              data: [
                { x: 5, y: 60, label: "Q1" },
                { x: 10, y: 90, label: "Q2" },
                { x: 14, y: 105, label: "Q3" },
                { x: 18, y: 125, label: "Q4" },
                { x: 24, y: 150, label: "Q5" },
                { x: 30, y: 180, label: "Q6" },
              ],
            },
            {
              legend: "Home & Garden",
              data: [
                { x: 6, y: 30, label: "Q1" },
                { x: 11, y: 55, label: "Q2" },
                { x: 16, y: 72, label: "Q3" },
                { x: 21, y: 88, label: "Q4" },
                { x: 27, y: 110, label: "Q5" },
              ],
            },
          ],
        },
        config: {
          scatter: { fill: true, size: 10, strokeWidth: 0 },
          colors: ["#3b82f6", "#f97316", "#8b5cf6", "#10b981"],
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
