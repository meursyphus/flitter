"use client";

import Widget from "@flitterjs/react";
import {
  Text,
  TextStyle,
} from "flitter-ui";
import { ToastBubbleChart as ToastBubbleChartWidget } from "shared/chart";

export default function CityComparisonToastBubble() {
  return (
    <Widget
      widget={ToastBubbleChartWidget({
        data: {
          datasets: [
            {
              legend: "North America",
              data: [
                { x: 82, y: 7.8, value: 8300000, label: "New York" },
                { x: 75, y: 7.5, value: 3900000, label: "Los Angeles" },
                { x: 70, y: 8.1, value: 2700000, label: "Toronto" },
                { x: 78, y: 8.3, value: 680000, label: "San Francisco" },
              ],
            },
            {
              legend: "Europe",
              data: [
                { x: 88, y: 8.5, value: 9000000, label: "London" },
                { x: 76, y: 8.8, value: 2200000, label: "Paris" },
                { x: 72, y: 8.2, value: 3600000, label: "Berlin" },
                { x: 85, y: 8.9, value: 1400000, label: "Zurich" },
              ],
            },
            {
              legend: "Asia Pacific",
              data: [
                { x: 95, y: 7.6, value: 13960000, label: "Tokyo" },
                { x: 55, y: 7.0, value: 7500000, label: "Bangkok" },
                { x: 90, y: 8.0, value: 5450000, label: "Singapore" },
              ],
            },
          ],
        },
        custom: {
          xAxisLabel: ({ name }: { name: string }) => {
            const cost = Number(name);
            // Red for expensive (80+), amber for moderate (70-79), green for affordable (<70)
            const color = cost >= 80 ? "#dc2626" : cost >= 70 ? "#d97706" : "#059669";
            return Text(name, {
              style: new TextStyle({
                fontSize: 11,
                color,
                fontWeight: cost >= 80 ? "bold" : "normal",
              }),
            });
          },
        },
        config: {
          title: { text: "Global City Comparison", visible: true, alignment: "center" },
          bubble: { minRadius: 10, maxRadius: 55, opacity: 0.65 },
          colors: ["#6366f1", "#ec4899", "#06b6d4"],
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
