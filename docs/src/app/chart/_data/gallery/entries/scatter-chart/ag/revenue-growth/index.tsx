"use client";

export const galleryTitle = "Revenue vs Growth Rate";

import Widget from "@flitterjs/react";
import { ScatterChart } from "shared/chart";

export function createWidget() {
  return ScatterChart({
    data: {
      datasets: [
        {
          legend: "Asia",
          data: [
            { x: 12, y: 28, label: "A1" }, { x: 18, y: 35, label: "A2" }, { x: 25, y: 42, label: "A3" },
            { x: 31, y: 48, label: "A4" }, { x: 38, y: 55, label: "A5" }, { x: 45, y: 61, label: "A6" },
            { x: 52, y: 67, label: "A7" }, { x: 58, y: 72, label: "A8" }, { x: 15, y: 32, label: "A9" },
            { x: 22, y: 39, label: "A10" }, { x: 35, y: 52, label: "A11" }, { x: 42, y: 58, label: "A12" },
            { x: 48, y: 63, label: "A13" }, { x: 55, y: 69, label: "A14" }, { x: 62, y: 74, label: "A15" },
            { x: 68, y: 78, label: "A16" }, { x: 75, y: 82, label: "A17" }, { x: 82, y: 86, label: "A18" },
          ],
        },
        {
          legend: "Europe",
          data: [
            { x: 8, y: 22, label: "E1" }, { x: 14, y: 30, label: "E2" }, { x: 20, y: 36, label: "E3" },
            { x: 27, y: 43, label: "E4" }, { x: 33, y: 49, label: "E5" }, { x: 40, y: 54, label: "E6" },
            { x: 46, y: 60, label: "E7" }, { x: 53, y: 65, label: "E8" }, { x: 60, y: 71, label: "E9" },
            { x: 66, y: 76, label: "E10" }, { x: 72, y: 80, label: "E11" }, { x: 10, y: 25, label: "E12" },
            { x: 24, y: 40, label: "E13" }, { x: 50, y: 62, label: "E14" }, { x: 78, y: 84, label: "E15" },
          ],
        },
        {
          legend: "Americas",
          data: [
            { x: 5, y: 15, label: "M1" }, { x: 11, y: 24, label: "M2" }, { x: 19, y: 33, label: "M3" },
            { x: 26, y: 41, label: "M4" }, { x: 34, y: 50, label: "M5" }, { x: 41, y: 57, label: "M6" },
            { x: 49, y: 64, label: "M7" }, { x: 56, y: 70, label: "M8" }, { x: 63, y: 75, label: "M9" },
            { x: 70, y: 81, label: "M10" }, { x: 77, y: 85, label: "M11" }, { x: 83, y: 88, label: "M12" },
            { x: 16, y: 29, label: "M13" }, { x: 37, y: 53, label: "M14" }, { x: 88, y: 90, label: "M15" },
          ],
        },
        {
          legend: "Africa",
          data: [
            { x: 3, y: 10, label: "F1" }, { x: 9, y: 18, label: "F2" }, { x: 17, y: 27, label: "F3" },
            { x: 23, y: 34, label: "F4" }, { x: 30, y: 44, label: "F5" }, { x: 36, y: 50, label: "F6" },
            { x: 44, y: 56, label: "F7" }, { x: 50, y: 62, label: "F8" }, { x: 57, y: 68, label: "F9" },
            { x: 64, y: 73, label: "F10" }, { x: 13, y: 21, label: "F11" }, { x: 42, y: 52, label: "F12" },
          ],
        },
      ],
    },
    config: {
      title: { text: "Revenue vs Annual Growth Rate", visible: true },
      subtitle: {
        text: "Regional performance by continent · $M vs %",
        visible: true,
      },
      scatter: {
        size: 7,
      },
    },
  });
}

export default function RevenueGrowth() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
