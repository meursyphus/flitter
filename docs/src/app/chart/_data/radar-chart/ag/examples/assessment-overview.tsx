"use client";

import Widget from "@flitterjs/react";
import { RadarChart } from "shared/chart";

export default function AssessmentOverviewAg() {
  return (
    <Widget
      widget={RadarChart({
        data: {
          labels: ["Analytics", "Strategy", "Delivery", "Communication", "Leadership"],
          datasets: [
            { legend: "Self", values: [82, 78, 90, 85, 70] },
            { legend: "Manager", values: [75, 88, 85, 80, 82] },
            { legend: "Peer", values: [80, 72, 88, 92, 68] },
          ],
        },
        config: {
          legend: { position: "right-top" },
          background: "#f8fafc",
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
