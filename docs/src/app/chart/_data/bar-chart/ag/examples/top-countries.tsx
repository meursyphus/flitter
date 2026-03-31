"use client";

import Widget from "@flitterjs/react";
import { BarChart } from "shared/chart";

export default function TopCountriesAg() {
  return (
    <Widget
      widget={BarChart({
        direction: "horizontal",
        data: {
          labels: [
            "United States",
            "China",
            "Japan",
            "Germany",
            "India",
            "United Kingdom",
            "France",
            "Brazil",
            "Canada",
            "South Korea",
          ],
          datasets: [
            {
              legend: "GDP (T$)",
              values: [25.5, 17.9, 4.2, 4.1, 3.7, 3.1, 2.8, 1.9, 1.8, 1.7],
            },
          ],
        },
        config: {
          colors: { fills: ["#0284c7"] },
          bar: { cornerRadius: 3 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
