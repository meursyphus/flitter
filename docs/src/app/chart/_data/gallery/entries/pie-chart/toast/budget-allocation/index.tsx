"use client";

export const galleryTitle = "Enterprise Software Market";

import Widget from "@flitterjs/react";
import { ToastPieChart } from "shared/chart";

export function createWidget() {
  return ToastPieChart({
    data: {
      datasets: [
        { name: "CRM", value: 22 },
        { name: "ERP", value: 19 },
        { name: "Security", value: 17 },
        { name: "Collaboration", value: 16 },
        { name: "Analytics", value: 14 },
        { name: "Other", value: 12 },
      ],
    },
    config: {
      title: { text: "Enterprise Software Market Share", visible: true },
      legend: { visible: true, position: "bottom" },
      radial: { visible: true },
      radialLabel: {
        formatter: (args) => args.name,
      },
      dataLabel: {
        visible: true,
        formatter: (args) => `${args.percentage.toFixed(1)}%`,
      },
    },
  });
}

export default function BudgetAllocation() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
