"use client";

import Widget from "@flitterjs/react";
import { PieChart } from "shared/chart";

const defaultData = {
  datasets: [
    { name: "Chrome", value: 65 },
    { name: "Safari", value: 18 },
    { name: "Firefox", value: 8 },
    { name: "Edge", value: 5 },
    { name: "Other", value: 4 },
  ],
};

export function BasicPieChart() {
  return (
    <Widget
      widget={PieChart({
        data: defaultData,
        config: {},
      })}
      width="100%"
      height="100%"
    />
  );
}

export function DonutPieChart() {
  return (
    <Widget
      widget={PieChart({
        data: defaultData,
        config: {
          pie: {
            innerRadiusRatio: 0.5,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
