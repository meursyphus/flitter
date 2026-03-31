"use client";

import Widget from "@flitterjs/react";
import { PieChart } from "shared/chart";

export default function MarketShareAgPieChart() {
  return (
    <Widget
      widget={PieChart({
        data: {
          datasets: [
            { name: "Apple", value: 28 },
            { name: "Samsung", value: 22 },
            { name: "Xiaomi", value: 13 },
            { name: "Oppo", value: 9 },
            { name: "Vivo", value: 8 },
            { name: "Others", value: 20 },
          ],
        },
        config: {},
      })}
      width="100%"
      height="100%"
    />
  );
}
