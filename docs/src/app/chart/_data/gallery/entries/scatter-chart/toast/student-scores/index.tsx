"use client";

export const galleryTitle = "Student Test Scores";

import Widget from "@flitterjs/react";
import { ToastScatterChart } from "shared/chart";

export function createWidget() {
  return ToastScatterChart({
    data: {
      datasets: [
        {
          legend: "Asia",
          data: [
            { x: 72, y: 68, label: "A1" }, { x: 65, y: 78, label: "A2" }, { x: 80, y: 85, label: "A3" },
            { x: 85, y: 75, label: "A4" }, { x: 70, y: 82, label: "A5" }, { x: 77, y: 70, label: "A6" },
            { x: 63, y: 88, label: "A7" }, { x: 75, y: 60, label: "A8" }, { x: 82, y: 72, label: "A9" },
            { x: 68, y: 90, label: "A10" }, { x: 88, y: 80, label: "A11" }, { x: 58, y: 74, label: "A12" },
            { x: 92, y: 70, label: "A13" }, { x: 74, y: 92, label: "A14" }, { x: 60, y: 65, label: "A15" },
          ],
        },
        {
          legend: "Europe",
          data: [
            { x: 45, y: 52, label: "E1" }, { x: 38, y: 48, label: "E2" }, { x: 55, y: 60, label: "E3" },
            { x: 42, y: 55, label: "E4" }, { x: 50, y: 45, label: "E5" }, { x: 35, y: 42, label: "E6" },
            { x: 48, y: 58, label: "E7" }, { x: 52, y: 50, label: "E8" }, { x: 40, y: 62, label: "E9" },
            { x: 58, y: 40, label: "E10" }, { x: 33, y: 55, label: "E11" }, { x: 62, y: 35, label: "E12" },
            { x: 28, y: 60, label: "E13" }, { x: 46, y: 44, label: "E14" }, { x: 54, y: 68, label: "E15" },
          ],
        },
        {
          legend: "Americas",
          data: [
            { x: 75, y: 18, label: "M1" }, { x: 82, y: 25, label: "M2" }, { x: 68, y: 12, label: "M3" },
            { x: 88, y: 30, label: "M4" }, { x: 72, y: 22, label: "M5" }, { x: 80, y: 15, label: "M6" },
            { x: 65, y: 28, label: "M7" }, { x: 85, y: 20, label: "M8" }, { x: 78, y: 10, label: "M9" },
            { x: 60, y: 32, label: "M10" }, { x: 90, y: 8, label: "M11" }, { x: 95, y: 14, label: "M12" },
            { x: 55, y: 38, label: "M13" }, { x: 70, y: 5, label: "M14" }, { x: 84, y: 35, label: "M15" },
          ],
        },
        {
          legend: "Africa",
          data: [
            { x: 10, y: 75, label: "F1" }, { x: 18, y: 82, label: "F2" }, { x: 25, y: 68, label: "F3" },
            { x: 15, y: 85, label: "F4" }, { x: 8, y: 78, label: "F5" }, { x: 20, y: 70, label: "F6" },
            { x: 12, y: 88, label: "F7" }, { x: 22, y: 65, label: "F8" }, { x: 5, y: 80, label: "F9" },
            { x: 30, y: 72, label: "F10" }, { x: 3, y: 92, label: "F11" }, { x: 16, y: 60, label: "F12" },
            { x: 28, y: 90, label: "F13" }, { x: 7, y: 68, label: "F14" }, { x: 14, y: 95, label: "F15" },
          ],
        },
        {
          legend: "Oceania",
          data: [
            { x: 30, y: 35, label: "O1" }, { x: 22, y: 28, label: "O2" }, { x: 40, y: 45, label: "O3" },
            { x: 35, y: 30, label: "O4" }, { x: 28, y: 40, label: "O5" }, { x: 18, y: 22, label: "O6" },
            { x: 45, y: 50, label: "O7" }, { x: 32, y: 38, label: "O8" }, { x: 25, y: 48, label: "O9" },
            { x: 50, y: 55, label: "O10" }, { x: 15, y: 15, label: "O11" }, { x: 38, y: 25, label: "O12" },
            { x: 42, y: 58, label: "O13" }, { x: 20, y: 42, label: "O14" }, { x: 48, y: 32, label: "O15" },
          ],
        },
      ],
    },
    config: {
      title: {
        text: "Math vs Science Scores by Region",
        visible: true,
      },
      scatter: {
        size: 8,
        fill: false,
        strokeWidth: 2,
      },
    },
  });
}

export default function StudentScores() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
