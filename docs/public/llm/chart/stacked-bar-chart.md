# Stacked Bar Chart

Compare totals while preserving contribution by series inside each category.

Generated: 2026-03-30

## Surface

Preset chart. Start with `chart-presets StackedBarChart` and choose from `toast`, `ag`.

## Use When

- The prompt is part-to-whole across categories
- Total height and segment contribution both matter
- The user explicitly says stacked, composition, or contribution

## Avoid When

- Series-to-series comparison must stay easy across categories
- The stack should be normalized to 100% and current preset logic is not enough

## Quick Start

```ts
import Widget from "@flitterjs/react";
import StackedBarChart from "./charts/stacked-bar-chart";

const widget = StackedBarChart({
  style: "toast",
  data: {
  labels: ["Q1", "Q2", "Q3", "Q4"],
  datasets: [
    { legend: "Product", values: [24, 28, 31, 36] },
    { legend: "Services", values: [11, 14, 15, 18] },
    { legend: "Support", values: [4, 5, 6, 7] }
  ]
},
});

<Widget widget={widget} width="720px" height="420px" />
```

## Data Contract

```ts
{
  labels: ["Q1", "Q2", "Q3", "Q4"],
  datasets: [
    { legend: "Product", values: [24, 28, 31, 36] },
    { legend: "Services", values: [11, 14, 15, 18] },
    { legend: "Support", values: [4, 5, 6, 7] }
  ]
}
```

## Ask Before Coding

- Should this be absolute stacked or percent stacked?
- Does series order carry meaning and need to stay fixed?
- Do negative values exist, and if so should they diverge around zero?

## Implementation Notes

- Use chart-presets StackedBarChart first.
- Choose ag when the chart is dense and mostly analytical.
- If segment labeling or stack math gets custom, check the advanced surface before moving to headless.

## Override Surface

- barGroup: own the stack layout for each category
- bar: customize each stacked segment
- dataLabel: place contribution labels selectively
- legend: add filtering or explanatory affordances

## Escape Hatch

Go headless if the request needs normalized stacks, waterfall-like transitions, or hybrid overlays on top of the stack.

## Source Paths

- `shared/chart-presets/charts/stacked-bar-chart`
- `packages/chart/src/headless/bar-chart`
- `docs/src/app/chart/_data/stacked-bar-chart`
