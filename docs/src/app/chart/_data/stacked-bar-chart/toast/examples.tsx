"use client";

import Widget from "@flitterjs/react";
import { ToastStackedBarChart as ToastStackedBarChartWidget } from "shared/chart";

// ---------------------------------------------------------------------------
// Individual example re-exports
// ---------------------------------------------------------------------------

export { default as RegionalRevenueToast } from "./examples/regional-revenue";
export { default as HorizontalCategoryToast } from "./examples/horizontal-category";
export { default as ProductPLMixToast } from "./examples/product-pl-mix";
export { default as MarketingChannelToast } from "./examples/marketing-channel";
export { default as BudgetAllocationToast } from "./examples/budget-allocation";
export { default as EnergySourceToast } from "./examples/energy-source";
export { default as EmployeeDistributionToast } from "./examples/employee-distribution";
export { default as DepartmentBudgetToast } from "./examples/department-budget";

// ---------------------------------------------------------------------------
// Shared helper (for legacy exports)
// ---------------------------------------------------------------------------

function ToastStackedBar({
  direction,
  data,
  config = {},
}: {
  direction: "vertical" | "horizontal";
  data: { labels: string[]; datasets: { legend: string; values: number[] }[] };
  config?: Record<string, any>;
}) {
  return (
    <Widget
      widget={ToastStackedBarChartWidget({ direction, data, config })}
      width="100%"
      height="100%"
    />
  );
}

// ---------------------------------------------------------------------------
// Legacy exports — kept so style detail pages don't break
// ---------------------------------------------------------------------------

const negativeData = {
  labels: ["Q1 '24", "Q2 '24", "Q3 '24", "Q4 '24", "Q1 '25", "Q2 '25", "Q3 '25"],
  datasets: [
    { legend: "Product A", values: [-20, 15, -5, 30, -10, 25, 8] },
    { legend: "Product B", values: [10, -12, 22, -8, 18, -15, 30] },
    { legend: "Product C", values: [5, -25, 12, 20, -18, 10, -7] },
  ],
};

export { default as VerticalToastStackedBarChart } from "./examples/regional-revenue";
export { default as HorizontalToastStackedBarChart } from "./examples/horizontal-category";
export { default as NegativeVerticalToastStackedBarChart } from "./examples/product-pl-mix";

export function NegativeHorizontalToastStackedBarChart() {
  return <ToastStackedBar direction="horizontal" data={negativeData} />;
}

// Aliases for old named exports
export { default as MarketingChannelToastStacked } from "./examples/marketing-channel";
export { default as BudgetAllocationToastStacked } from "./examples/budget-allocation";
export { default as EnergySourceToastStacked } from "./examples/energy-source";
export { default as EmployeeDistToastStacked } from "./examples/employee-distribution";
