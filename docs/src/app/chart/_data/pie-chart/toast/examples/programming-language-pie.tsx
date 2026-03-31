"use client";

import Widget from "@flitterjs/react";
import { ToastPieChart } from "shared/chart";

export default function ProgrammingLanguagePie() {
  return (
    <Widget
      widget={ToastPieChart({
        data: {
          datasets: [
            { name: "Python", value: 28 },
            { name: "JavaScript", value: 22 },
            { name: "TypeScript", value: 15 },
            { name: "Java", value: 14 },
            { name: "Go", value: 11 },
            { name: "Rust", value: 10 },
          ],
        },
        config: {
          colors: ["#3572A5", "#f1e05a", "#3178c6", "#b07219", "#00ADD8", "#dea584"],
          legend: { visible: false },
          dataLabel: {
            visible: true,
            fontSize: 12,
            fontColor: "white",
            fontWeight: "bold",
            radiusRatio: 0.6,
            formatter: ({ name, percentage }: any) =>
              `${name} ${percentage.toFixed(0)}%`,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
