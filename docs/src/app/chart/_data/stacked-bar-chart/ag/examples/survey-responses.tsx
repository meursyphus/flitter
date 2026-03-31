"use client";

import Widget from "@flitterjs/react";
import { StackedBarChart } from "shared/chart";

export default function SurveyResponsesAg() {
  return (
    <Widget
      widget={StackedBarChart({
        direction: "horizontal",
        data: {
          labels: ["Work-Life Balance", "Compensation", "Growth", "Culture", "Leadership"],
          datasets: [
            { legend: "Strongly Agree", values: [45, 28, 38, 52, 35] },
            { legend: "Agree", values: [30, 32, 28, 25, 30] },
            { legend: "Neutral", values: [15, 20, 18, 12, 18] },
            { legend: "Disagree", values: [10, 20, 16, 11, 17] },
          ],
        },
        config: {
          colors: { fills: ["#22c55e", "#86efac", "#fcd34d", "#f87171"], strokes: ["#22c55e", "#86efac", "#fcd34d", "#f87171"] },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
