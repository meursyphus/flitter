"use client";

import Widget from "@flitterjs/react";
import { ScatterChart } from "shared/chart";

export default function StudentScoresAg() {
  return (
    <Widget
      widget={ScatterChart({
        data: {
          datasets: [
            {
              legend: "Class A",
              data: [
                { x: 85, y: 78, label: "Student 1" },
                { x: 92, y: 88, label: "Student 2" },
                { x: 76, y: 82, label: "Student 3" },
                { x: 68, y: 65, label: "Student 4" },
                { x: 95, y: 91, label: "Student 5" },
                { x: 80, y: 75, label: "Student 6" },
              ],
            },
            {
              legend: "Class B",
              data: [
                { x: 70, y: 85, label: "Student 1" },
                { x: 88, y: 92, label: "Student 2" },
                { x: 65, y: 70, label: "Student 3" },
                { x: 78, y: 80, label: "Student 4" },
                { x: 90, y: 95, label: "Student 5" },
                { x: 72, y: 76, label: "Student 6" },
              ],
            },
            {
              legend: "Class C",
              data: [
                { x: 60, y: 55, label: "Student 1" },
                { x: 75, y: 70, label: "Student 2" },
                { x: 82, y: 78, label: "Student 3" },
                { x: 90, y: 85, label: "Student 4" },
                { x: 55, y: 60, label: "Student 5" },
                { x: 68, y: 72, label: "Student 6" },
              ],
            },
          ],
        },
        config: {
          scatter: { size: 9 },
          colors: {
            fills: ["#f59e0b", "#8b5cf6", "#06b6d4"],
            strokes: ["#f59e0b", "#8b5cf6", "#06b6d4"],
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
