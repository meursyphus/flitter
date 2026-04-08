"use client";

export const galleryTitle = "Height vs Weight";

import Widget from "@flitterjs/react";
import { ToastScatterChart } from "shared/chart";

export function createWidget() {
  return ToastScatterChart({
        data: {
          datasets: [
            {
              legend: "Male",
              data: [
                { x: 170, y: 68, label: "A" },
                { x: 175, y: 73, label: "B" },
                { x: 180, y: 78, label: "C" },
                { x: 168, y: 65, label: "D" },
                { x: 183, y: 82, label: "E" },
                { x: 177, y: 76, label: "F" },
                { x: 172, y: 70, label: "G" },
              ],
            },
            {
              legend: "Female",
              data: [
                { x: 158, y: 52, label: "H" },
                { x: 163, y: 57, label: "I" },
                { x: 155, y: 49, label: "J" },
                { x: 167, y: 61, label: "K" },
                { x: 160, y: 55, label: "L" },
                { x: 165, y: 59, label: "M" },
                { x: 162, y: 54, label: "N" },
              ],
            },
          ],
        },
        config: {
          title: { text: "Height vs Weight", visible: true },
        },
      });
}

export default function ScatterChartToast() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
