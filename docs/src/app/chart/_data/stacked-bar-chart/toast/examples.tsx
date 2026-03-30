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
  config = {},
}: {
  direction: "vertical" | "horizontal";
  data: typeof defaultData;
  config?: Record<string, any>;
}) {
  return (
    <Widget
      widget={ToastStackedBarChartWidget({
        direction,
        data,
        config,
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
  return <ToastStackedBarChart direction="horizontal" data={defaultData} config={{ colors: ["#6366f1", "#ec4899", "#f59e0b"] }} />;
}

export function NegativeVerticalToastStackedBarChart() {
  return <ToastStackedBarChart direction="vertical" data={negativeData} config={{ colors: ["#10b981", "#ef4444", "#3b82f6"] }} />;
}

export function NegativeHorizontalToastStackedBarChart() {
  return <ToastStackedBarChart direction="horizontal" data={negativeData} />;
}

const marketingChannelData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    { legend: "SEO", values: [320, 380, 410, 450, 520, 580] },
    { legend: "Paid Ads", values: [210, 250, 230, 270, 290, 310] },
    { legend: "Social", values: [140, 160, 180, 200, 220, 250] },
    { legend: "Email", values: [90, 100, 110, 120, 130, 145] },
  ],
};

export function MarketingChannelToastStacked() {
  return <ToastStackedBarChart direction="vertical" data={marketingChannelData} config={{ colors: ["#0ea5e9", "#8b5cf6", "#f97316", "#10b981"] }} />;
}

const budgetAllocationData = {
  labels: ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"],
  datasets: [
    { legend: "Engineering", values: [450, 480, 520, 550] },
    { legend: "Marketing", values: [200, 220, 210, 240] },
    { legend: "Sales", values: [180, 190, 200, 210] },
    { legend: "Operations", values: [120, 130, 125, 140] },
  ],
};

export function BudgetAllocationToastStacked() {
  return <ToastStackedBarChart direction="horizontal" data={budgetAllocationData} config={{ colors: ["#2563eb", "#dc2626", "#059669", "#d97706"], bar: { gap: 2 } }} />;
}

const energySourceData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    { legend: "Solar", values: [120, 140, 180, 220, 280, 320, 340, 310, 260, 200, 150, 110] },
    { legend: "Wind", values: [200, 210, 190, 170, 160, 140, 130, 145, 175, 195, 220, 230] },
    { legend: "Hydro", values: [150, 160, 180, 200, 190, 170, 155, 140, 150, 165, 170, 155] },
    { legend: "Nuclear", values: [300, 300, 295, 305, 300, 310, 305, 300, 298, 302, 300, 305] },
  ],
};

export function EnergySourceToastStacked() {
  return <ToastStackedBarChart direction="vertical" data={energySourceData} config={{ colors: ["#eab308", "#22c55e", "#06b6d4", "#a855f7"] }} />;
}

const employeeDistData = {
  labels: ["Engineering", "Marketing", "Sales", "Support", "Design", "Product"],
  datasets: [
    { legend: "Junior", values: [45, 20, 25, 30, 12, 8] },
    { legend: "Mid-Level", values: [60, 25, 30, 20, 15, 12] },
    { legend: "Senior", values: [35, 15, 20, 10, 8, 10] },
  ],
};

export function EmployeeDistToastStacked() {
  return <ToastStackedBarChart direction="horizontal" data={employeeDistData} config={{ colors: ["#3b82f6", "#f59e0b", "#ef4444"], bar: { gap: 1 } }} />;
}
