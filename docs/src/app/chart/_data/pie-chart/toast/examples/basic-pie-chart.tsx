"use client";

import Widget from "@flitterjs/react";
import { ToastPieChart } from "shared/chart";

export default function BasicPieChart() {
  return (
    <Widget
      widget={ToastPieChart({
        data: {
          datasets: [
            { name: "Chrome", value: 65 },
            { name: "Safari", value: 18 },
            { name: "Firefox", value: 8 },
            { name: "Edge", value: 5 },
            { name: "Other", value: 4 },
          ],
        },
        config: {},
      })}
      width="100%"
      height="100%"
    />
  );
}
