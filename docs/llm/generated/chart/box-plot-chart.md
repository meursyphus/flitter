# Box Plot Chart

Show distribution through quartiles, whiskers, and optional outliers.

Generated: 2026-03-07

## Surface

Base-wrapper chart. Start with `chart-presets BoxPlotChart` for structural defaults, but expect to own `custom` and `config` sooner than with fully themed preset charts.

## Use When

- The prompt is about spread, median, quartiles, and outliers
- Category-by-category distribution matters more than individual samples
- You need summary statistics rather than raw scatter points

## Avoid When

- The user needs to see every underlying sample
- The story is mostly trend or composition rather than distribution

## Quick Start

```ts
import Widget from "@flitterjs/react";
import { BoxPlotChart } from "chart-presets";

const widget = BoxPlotChart({
  data: {
  labels: ["Control", "Experiment"],
  datasets: [
    {
      legend: "Latency",
      data: [
        { min: 72, q1: 88, median: 96, q3: 112, max: 140, outliers: [156] },
        { min: 60, q1: 74, median: 85, q3: 99, max: 120, outliers: [132, 138] }
      ]
    }
  ]
},
});
// Add config/custom overrides as the request becomes more specific.

<Widget widget={widget} width="720px" height="420px" />
```

## Data Contract

```ts
{
  labels: ["Control", "Experiment"],
  datasets: [
    {
      legend: "Latency",
      data: [
        { min: 72, q1: 88, median: 96, q3: 112, max: 140, outliers: [156] },
        { min: 60, q1: 74, median: 85, q3: 99, max: 120, outliers: [132, 138] }
      ]
    }
  ]
}
```

## Ask Before Coding

- Are quartiles already computed, or do we need to derive them upstream?
- Should outliers be shown, hidden, or annotated selectively?
- Is the chart vertical or horizontal?

## Implementation Notes

- chart-presets BoxPlotChart gives structural defaults but not a branded preset system.
- Expect to own custom rendering sooner than with bar or line charts.
- Use the base wrapper first before dropping all the way to headless.

## Override Surface

- boxPlot: draw the box, median, and whiskers
- outlier: control how point outliers appear
- boxPlotGroup: manage grouped-category layout
- axes / grid / layout: keep statistical context readable

## Escape Hatch

Go headless if the distribution logic itself, orientation rules, or custom interaction model exceed the base wrapper.

## Source Paths

- `shared/chart-presets/charts/box-plot-chart`
- `packages/chart/src/headless/box-plot-chart`
