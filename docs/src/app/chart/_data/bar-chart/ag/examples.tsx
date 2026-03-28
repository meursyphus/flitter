"use client";

import Widget from "@flitterjs/react";
import { BarChart } from "shared/chart";

// ---------------------------------------------------------------------------
// Shared helper
// ---------------------------------------------------------------------------

function AgBar({
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
      widget={BarChart({ direction, data, config })}
      width="100%"
      height="100%"
    />
  );
}

// ---------------------------------------------------------------------------
// 1. Quarterly Earnings — professional financial data
// ---------------------------------------------------------------------------

const earningsData = {
  labels: ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"],
  datasets: [
    { legend: "Revenue", values: [28.5, 31.2, 29.8, 34.1] },
    { legend: "EBITDA", values: [8.4, 9.7, 8.9, 11.2] },
  ],
};

export function QuarterlyEarningsAg() {
  return (
    <AgBar
      direction="vertical"
      data={earningsData}
      config={{ colors: { fills: ['#2563eb', '#7c3aed'] }, bar: { cornerRadius: 4 } }}
    />
  );
}

// ---------------------------------------------------------------------------
// 2. Product Comparison — multiple products across metrics
// ---------------------------------------------------------------------------

const productData = {
  labels: ["Reliability", "Speed", "Design", "Support", "Price"],
  datasets: [
    { legend: "Product A", values: [88, 76, 92, 65, 70] },
    { legend: "Product B", values: [72, 91, 68, 82, 85] },
    { legend: "Product C", values: [81, 84, 79, 90, 62] },
  ],
};

export function ProductComparisonAg() {
  return (
    <AgBar
      direction="vertical"
      data={productData}
      config={{ colors: { fills: ['#0ea5e9', '#f97316', '#8b5cf6'] }, bar: { cornerRadius: 3 } }}
    />
  );
}

// ---------------------------------------------------------------------------
// 3. Year over Year Growth — 2 years compared
// ---------------------------------------------------------------------------

const yoyData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    { legend: "2024", values: [340, 380, 420, 395, 450, 470] },
    { legend: "2025", values: [410, 445, 480, 460, 520, 540] },
  ],
};

export function YearOverYearAg() {
  return (
    <AgBar
      direction="vertical"
      data={yoyData}
      config={{ colors: { fills: ['#64748b', '#0d9488'] }, bar: { cornerRadius: 4 } }}
    />
  );
}

// ---------------------------------------------------------------------------
// 4. Top 10 Countries — horizontal, sorted descending
// ---------------------------------------------------------------------------

const countriesData = {
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
};

export function TopCountriesAg() {
  return (
    <AgBar
      direction="horizontal"
      data={countriesData}
      config={{ colors: { fills: ['#0284c7'] }, bar: { cornerRadius: 3 } }}
    />
  );
}

// ---------------------------------------------------------------------------
// 5. Customer Segments — grouped bars with business metrics
// ---------------------------------------------------------------------------

const segmentData = {
  labels: ["Enterprise", "Mid-Market", "SMB", "Startup"],
  datasets: [
    { legend: "New ARR ($K)", values: [480, 320, 190, 85] },
    { legend: "Expansion ($K)", values: [210, 145, 70, 32] },
    { legend: "Churn ($K)", values: [-95, -68, -42, -28] },
  ],
};

export function CustomerSegmentsAg() {
  return (
    <AgBar
      direction="vertical"
      data={segmentData}
      config={{ colors: { fills: ['#10b981', '#3b82f6', '#ef4444'] }, bar: { cornerRadius: 4 } }}
    />
  );
}

// ---------------------------------------------------------------------------
// 6. Negative P&L Swings — showing positive/negative
// ---------------------------------------------------------------------------

const plSwingsData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
  datasets: [
    {
      legend: "Monthly P&L ($K)",
      values: [120, -45, 85, -20, 150, -80, 65, 110],
    },
  ],
};

export function NegativePLAg() {
  return (
    <AgBar
      direction="vertical"
      data={plSwingsData}
      config={{ colors: { fills: ['#6366f1'] }, bar: { cornerRadius: 3 } }}
    />
  );
}

// ---------------------------------------------------------------------------
// Legacy exports — kept so style detail pages don't break
// ---------------------------------------------------------------------------

export function VerticalAgBarChart() {
  return <QuarterlyEarningsAg />;
}

export function HorizontalAgBarChart() {
  return <TopCountriesAg />;
}

export function NegativeVerticalAgBarChart() {
  return <NegativePLAg />;
}

export function NegativeHorizontalAgBarChart() {
  return <CustomerSegmentsAg />;
}
