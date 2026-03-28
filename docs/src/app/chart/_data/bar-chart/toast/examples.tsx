"use client";

import Widget from "@flitterjs/react";
import { ToastBarChart as ToastBarChartWidget } from "shared/chart";

// ---------------------------------------------------------------------------
// Shared helper
// ---------------------------------------------------------------------------

function ToastBar({
  direction,
  data,
  config = {},
}: {
  direction: "vertical" | "horizontal";
  data: { labels: string[]; datasets: { legend: string; values: number[] }[] };
  config?: Record<string, unknown>;
}) {
  return (
    <Widget
      widget={ToastBarChartWidget({ direction, data, config })}
      width="100%"
      height="100%"
    />
  );
}

// ---------------------------------------------------------------------------
// 1. Monthly Revenue — 3 regions, vertical
// ---------------------------------------------------------------------------

const revenueData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    { legend: "North America", values: [4.2, 4.8, 3.9, 5.1, 5.6, 5.3] },
    { legend: "Europe", values: [3.1, 2.9, 3.4, 3.2, 3.8, 3.6] },
    { legend: "Asia Pacific", values: [2.1, 2.5, 2.3, 2.8, 2.6, 3.0] },
  ],
};

export function MonthlyRevenueToast() {
  return (
    <ToastBar
      direction="vertical"
      data={revenueData}
      config={{ colors: ["#0d9488", "#14b8a6", "#99f6e4"] }}
    />
  );
}

// ---------------------------------------------------------------------------
// 2. Survey Results — horizontal, single dataset
// ---------------------------------------------------------------------------

const surveyData = {
  labels: [
    "Ease of Use",
    "Performance",
    "Documentation",
    "Design Quality",
    "Support",
    "Value for Money",
  ],
  datasets: [{ legend: "Score (%)", values: [92, 87, 78, 95, 71, 84] }],
};

export function SurveyResultsToast() {
  return (
    <ToastBar
      direction="horizontal"
      data={surveyData}
      config={{ colors: ["#f59e0b"] }}
    />
  );
}

// ---------------------------------------------------------------------------
// 3. Budget vs Actual — 2 datasets, vertical
// ---------------------------------------------------------------------------

const budgetData = {
  labels: ["Q1", "Q2", "Q3", "Q4"],
  datasets: [
    { legend: "Budget", values: [120, 135, 140, 150] },
    { legend: "Actual", values: [115, 142, 131, 158] },
  ],
};

export function BudgetVsActualToast() {
  return (
    <ToastBar
      direction="vertical"
      data={budgetData}
      config={{ colors: ["#0d9488", "#d4d4d4"] }}
    />
  );
}

// ---------------------------------------------------------------------------
// 4. Profit & Loss — negative values by quarter
// ---------------------------------------------------------------------------

const plData = {
  labels: ["Q1 '24", "Q2 '24", "Q3 '24", "Q4 '24", "Q1 '25", "Q2 '25"],
  datasets: [
    { legend: "Net Income", values: [32, -18, 45, -7, 28, -12] },
    { legend: "Operating Cash", values: [15, 22, -10, 38, -25, 19] },
  ],
};

export function ProfitLossToast() {
  return (
    <ToastBar
      direction="vertical"
      data={plData}
      config={{ colors: ["#10b981", "#ef4444"] }}
    />
  );
}

// ---------------------------------------------------------------------------
// 5. Population by Age Group — horizontal, demographic
// ---------------------------------------------------------------------------

const populationData = {
  labels: ["0-14", "15-24", "25-34", "35-44", "45-54", "55-64", "65+"],
  datasets: [
    { legend: "Male (M)", values: [9.8, 8.2, 11.4, 10.6, 9.1, 7.8, 6.5] },
    { legend: "Female (M)", values: [9.3, 7.9, 11.1, 10.9, 9.4, 8.1, 7.2] },
  ],
};

export function PopulationByAgeToast() {
  return (
    <ToastBar
      direction="horizontal"
      data={populationData}
      config={{ colors: ["#3b82f6", "#ec4899"] }}
    />
  );
}

// ---------------------------------------------------------------------------
// 6. Weekly Sales Tracker — single series, minimal
// ---------------------------------------------------------------------------

const weeklySalesData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [{ legend: "Units Sold", values: [64, 82, 75, 93, 110, 142, 98] }],
};

export function WeeklySalesTrackerToast() {
  return (
    <ToastBar
      direction="vertical"
      data={weeklySalesData}
      config={{ colors: ["#6366f1"] }}
    />
  );
}

// ---------------------------------------------------------------------------
// 7. Top Performers — single-series ranked comparison
// ---------------------------------------------------------------------------

const topPerformersData = {
  labels: ["Alice", "Bob", "Carol", "Dave", "Eve"],
  datasets: [{ legend: "Sales ($K)", values: [142, 128, 115, 98, 87] }],
};

export function TopPerformersToast() {
  return (
    <ToastBar
      direction="vertical"
      data={topPerformersData}
      config={{ colors: ["#f97316"] }}
    />
  );
}

// ---------------------------------------------------------------------------
// Legacy exports — kept so style detail pages don't break
// ---------------------------------------------------------------------------

export function VerticalToastBarChart() {
  return <MonthlyRevenueToast />;
}

export function HorizontalToastBarChart() {
  return <SurveyResultsToast />;
}

export function NegativeVerticalToastBarChart() {
  return <ProfitLossToast />;
}

export function NegativeHorizontalToastBarChart() {
  return (
    <ToastBar
      direction="horizontal"
      data={plData}
      config={{ colors: ["#10b981", "#ef4444"] }}
    />
  );
}
