"use client";

import Widget from "@flitterjs/react";
import { RadarChart } from "shared/chart";

const skillData = {
  labels: ["JavaScript", "TypeScript", "React", "Node.js", "CSS", "GraphQL", "Testing", "DevOps"],
  datasets: [
    { legend: "Senior Dev", values: [95, 90, 85, 80, 70, 75, 80, 65] },
    { legend: "Junior Dev", values: [70, 50, 60, 40, 65, 30, 35, 20] },
    { legend: "Full Stack", values: [80, 75, 70, 85, 60, 65, 70, 80] },
  ],
};

export function BasicRadarChart() {
  return (
    <Widget
      widget={RadarChart({
        data: skillData,
        config: {},
      })}
      width="100%"
      height="100%"
    />
  );
}
