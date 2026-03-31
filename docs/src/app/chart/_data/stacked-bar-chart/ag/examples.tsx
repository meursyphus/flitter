"use client";

import Widget from "@flitterjs/react";
import { StackedBarChart } from "shared/chart";

// ---------------------------------------------------------------------------
// Individual example re-exports
// ---------------------------------------------------------------------------

export { default as RegionalSalesAg } from "./examples/regional-sales";
export { default as DepartmentHeadcountAg } from "./examples/department-headcount";
export { default as VolatileQuarterlyAg } from "./examples/volatile-quarterly";
export { default as RevenueByProductAg } from "./examples/revenue-by-product";
export { default as SurveyResponsesAg } from "./examples/survey-responses";
export { default as SprintEffortAg } from "./examples/sprint-effort";
export { default as ProjectHoursAg } from "./examples/project-hours";

// ---------------------------------------------------------------------------
// Shared helper (for legacy exports)
// ---------------------------------------------------------------------------

function AgStackedBar({
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
      widget={StackedBarChart({ direction, data, config })}
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

export { default as VerticalAgStackedBarChart } from "./examples/regional-sales";
export { default as HorizontalAgStackedBarChart } from "./examples/department-headcount";
export { default as NegativeVerticalAgStackedBarChart } from "./examples/volatile-quarterly";

export function NegativeHorizontalAgStackedBarChart() {
  return <AgStackedBar direction="horizontal" data={negativeData} />;
}

// Aliases for old named exports
export { default as RevenueByProductAgStacked } from "./examples/revenue-by-product";
export { default as SurveyResponsesAgStacked } from "./examples/survey-responses";
export { default as ProjectTimelineAgStacked } from "./examples/sprint-effort";
