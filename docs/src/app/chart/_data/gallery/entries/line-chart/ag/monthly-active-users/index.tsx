"use client";

export const galleryTitle = "Average Monthly Temperature by City";

import Widget from "@flitterjs/react";
import { LineChart } from "shared/chart";

export function createWidget() {
  return LineChart({
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        { legend: "Seoul", values: [-3.5, -1.1, 4.0, 11.3, 17.5, 21.5, 25.9, 27.2, 24.4, 13.9, 6.6, -0.6] },
        { legend: "Seattle", values: [3.8, 5.6, 7.0, 9.1, 12.4, 15.3, 17.5, 17.8, 15.0, 10.6, 6.6, 3.7] },
        { legend: "Sydney", values: [22.1, 22.0, 20.9, 18.3, 15.2, 12.8, 11.8, 13.0, 15.2, 17.6, 19.4, 21.2] },
      ],
    },
    config: {
      title: { text: "Average Monthly Temperature", visible: true },
      subtitle: { text: "Celsius degrees by city (2024)", visible: true },
    },
  });
}

export default function SocialMediaUsers() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
