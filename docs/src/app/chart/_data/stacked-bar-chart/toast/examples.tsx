"use client";

import Widget from "@flitterjs/react";
import { ToastStackedBarChart as ToastStackedBarChartWidget } from "shared/chart";

const defaultData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    { legend: "North America", values: [120, 135, 110, 145, 160, 150, 170] },
    { legend: "Europe", values: [90, 85, 100, 95, 110, 105, 120] },
    { legend: "Asia Pacific", values: [65, 80, 75, 90, 85, 95, 100] },
  ],
};

const negativeData = {
  labels: ["Q1 '24", "Q2 '24", "Q3 '24", "Q4 '24", "Q1 '25", "Q2 '25", "Q3 '25"],
  datasets: [
    { legend: "Product A", values: [-20, 15, -5, 30, -10, 25, 8] },
    { legend: "Product B", values: [10, -12, 22, -8, 18, -15, 30] },
    { legend: "Product C", values: [5, -25, 12, 20, -18, 10, -7] },
  ],
};

function ToastStackedBarChart({
  direction,
  data,
}: {
  direction: "vertical" | "horizontal";
  data: typeof defaultData;
}) {
  return (
    <Widget
      widget={ToastStackedBarChartWidget({
        direction,
        data,
        config: {},
      })}
      width="100%"
      height="100%"
    />
  );
}

export function VerticalToastStackedBarChart() {
  return <ToastStackedBarChart direction="vertical" data={defaultData} />;
}

export function HorizontalToastStackedBarChart() {
  return <ToastStackedBarChart direction="horizontal" data={defaultData} />;
}

export function NegativeVerticalToastStackedBarChart() {
  return <ToastStackedBarChart direction="vertical" data={negativeData} />;
}

export function NegativeHorizontalToastStackedBarChart() {
  return <ToastStackedBarChart direction="horizontal" data={negativeData} />;
}
