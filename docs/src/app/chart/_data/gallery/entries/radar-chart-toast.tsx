"use client";

export const galleryTitle = "Skill Assessment";

import Widget from "@flitterjs/react";
import { ToastRadarChart } from "shared/chart";

export function createWidget() {
  return ToastRadarChart({
        data: {
          labels: ["Communication", "Problem Solving", "Leadership", "Teamwork", "Creativity", "Technical"],
          datasets: [
            { legend: "Self Assessment", values: [85, 90, 70, 80, 75, 95] },
            { legend: "Peer Review", values: [78, 85, 82, 88, 72, 80] },
          ],
        },
        config: {
          title: { text: "Skill Assessment", visible: true },
        },
      });
}

export default function RadarChartToast() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
