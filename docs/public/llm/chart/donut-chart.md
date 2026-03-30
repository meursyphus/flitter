# Donut Chart

Part-to-whole chart with center content and an inner radius.

Generated: 2026-03-30

## Surface

Base-wrapper chart. Start with `chart-presets DonutChart` for structural defaults, but expect to own `custom` and `config` sooner than with fully themed preset charts.

## Use When

- The prompt is pie-like but needs center content
- A KPI or summary belongs in the middle of the chart
- Part-to-whole still matters more than exact comparison

## Avoid When

- There are too many slices for radial labeling
- The center content is doing too much and the chart is becoming a scorecard

## Quick Start

```ts
import Widget from "@flitterjs/react";
import DonutChart from "./charts/donut-chart";

const widget = DonutChart({
  data: {
  datasets: [
    { name: "Completed", value: 64 },
    { name: "In Progress", value: 24 },
    { name: "Blocked", value: 12 }
  ]
},
});
// Add config/custom overrides as the request becomes more specific.

<Widget widget={widget} width="720px" height="420px" />
```

## Data Contract

```ts
{
  datasets: [
    { name: "Completed", value: 64 },
    { name: "In Progress", value: 24 },
    { name: "Blocked", value: 12 }
  ]
}
```

## Ask Before Coding

- What should appear in the center: total, label, KPI, or custom widget?
- How many slices are there, and do tiny slices need grouping?
- Would pie or progress communicate the story more cleanly?

## Implementation Notes

- chart-presets DonutChart already reuses pie-style defaults, including a center-content slot.
- Treat donut as composition plus summary, not only as a decorative pie variant.
- If the center becomes interactive or highly custom, you may need to leave the base wrapper.

## Override Surface

- slice: customize arc rendering
- centerContent: own the center summary widget
- legend / title: clarify denominator and ordering
- dataView: manage arc-plus-center composition

## Escape Hatch

Go headless if the center content becomes a true composite experience or the arc behavior stops resembling a donut chart.

## Source Paths

- `shared/chart-presets/charts/donut-chart`
- `packages/chart/src/headless/donut-chart`
