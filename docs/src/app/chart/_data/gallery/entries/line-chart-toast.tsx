"use client";

export const galleryTitle = "Monthly User Growth";

import Widget from "@flitterjs/react";
import { ToastLineChart } from "shared/chart";

export function createWidget() {
  return ToastLineChart({
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
          datasets: [
            { legend: "Active Users", values: [12400, 14200, 15800, 17300, 19100, 21500, 24000] },
            { legend: "New Signups", values: [3200, 3800, 4100, 4500, 5200, 5900, 6400] },
            { legend: "Churned", values: [800, 950, 870, 1100, 980, 1050, 900] },
          ],
        },
        config: {
          title: { text: "Monthly User Growth", visible: true },
        },
      });
}

export default function LineChartToast() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
