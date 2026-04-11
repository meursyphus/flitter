"use client";

export const galleryTitle = "City Temperatures by Month";

import Widget from "@flitterjs/react";
import { HeatmapChart } from "shared/chart";

export function createWidget() {
  return HeatmapChart({
    data: {
      xLabels: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
      yLabels: ["Seoul", "Seattle", "Sydney", "Moscow", "Jungfrau"],
      values: [
        [-3.5, -1.1, 4.0, 11.3, 17.2, 22.0, 25.5, 26.1, 21.3, 14.2, 6.1, -0.8],
        [5.4, 6.1, 8.0, 10.3, 13.5, 16.2, 19.4, 19.6, 16.5, 11.8, 7.5, 4.8],
        [25.8, 25.6, 24.0, 21.2, 17.5, 14.6, 13.5, 14.8, 17.4, 20.0, 22.4, 24.6],
        [-9.3, -7.5, -2.0, 6.2, 13.1, 17.5, 19.8, 17.6, 11.8, 5.3, -1.5, -6.8],
        [-8.1, -8.5, -5.8, -2.0, 2.8, 6.4, 8.9, 8.6, 5.8, 1.5, -3.4, -6.9],
      ],
    },
    config: {
      title: { text: "Average Monthly Temperature (\u00B0C)", visible: true },
    },
  });
}

export default function HourlyTraffic() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
