"use client";

import type { ReactNode } from "react";
import Widget from "@flitterjs/react";
import { ToastBarChart as ToastBarChartWidget } from "shared/chart";

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

type ToastChartExample = {
  label: string;
  component: ReactNode;
};

function ToastBarChart({
  direction,
  title,
  data,
}: {
  direction: "vertical" | "horizontal";
  title: string;
  data: typeof defaultData | typeof negativeData;
}) {
  return (
    <Widget
      widget={ToastBarChartWidget({
        direction,
        data,
        config: {},
      })}
      width="100%"
      height="100%"
    />
  );
}

export function VerticalToastBarChart() {
  return <ToastBarChart direction="vertical" title="Monthly Revenue by Region" data={defaultData} />;
}

export function HorizontalToastBarChart() {
  return (
    <ToastBarChart direction="horizontal" title="Monthly Revenue by Region" data={defaultData} />
  );
}

export function NegativeVerticalToastBarChart() {
  return <ToastBarChart direction="vertical" title="Quarterly Profit / Loss" data={negativeData} />;
}

export function NegativeHorizontalToastBarChart() {
  return (
    <ToastBarChart direction="horizontal" title="Quarterly Profit / Loss" data={negativeData} />
  );
}

export const toastExamples: ToastChartExample[] = [
  { label: "Vertical", component: <VerticalToastBarChart /> },
  { label: "Horizontal", component: <HorizontalToastBarChart /> },
  { label: "Negative Vertical", component: <NegativeVerticalToastBarChart /> },
  { label: "Negative Horizontal", component: <NegativeHorizontalToastBarChart /> },
];
