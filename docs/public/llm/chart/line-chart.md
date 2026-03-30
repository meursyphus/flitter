# Line Chart

Show continuous trends, comparisons over time, and line-based overlays.

Generated: 2026-03-30

## Surface

Preset chart. Start with `chart-presets LineChart` and choose from `toast`, `ag`.

## Use When

- The main signal is trend over ordered labels or time
- The prompt mentions trend, trajectory, baseline, or moving line
- Multiple datasets should remain easy to compare point-by-point

## Avoid When

- Filled magnitude is more important than the line itself
- The request is actually scatter or bubble because both axes are numeric

## Quick Start

```ts
import Widget from "@flitterjs/react";
import LineChart from "./charts/line-chart";

const widget = LineChart({
  style: "toast",
  data: {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  datasets: [
    { legend: "Signups", values: [18, 24, 21, 29, 33] },
    { legend: "Trials", values: [12, 16, 15, 20, 25] }
  ]
},
});

<Widget widget={widget} width="720px" height="420px" />
```

## Data Contract

```ts
{
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  datasets: [
    { legend: "Signups", values: [18, 24, 21, 29, 33] },
    { legend: "Trials", values: [12, 16, 15, 20, 25] }
  ]
}
```

## Ask Before Coding

- Should points, labels, or tooltips show every sample or only key markers?
- Does the user expect smoothing or straight segments?
- Is an overlay line enough, or does the prompt really want area or combo behavior?

## Implementation Notes

- Use chart-presets LineChart first.
- Stay in preset mode when the request is standard line comparison with config-level changes.
- If the user wants bands, thresholds, or bespoke point rendering, push those through custom slots before rewriting the whole chart.

## Override Surface

- line: draw each dataset path
- dataView: wrap and order lines together
- dataLabel: selectively annotate points
- xAxis / yAxis / grid: align the chart with dashboard conventions

## Escape Hatch

Go headless if the chart becomes a composed line system with custom point logic, confidence intervals, or non-standard hover behavior.

## Source Paths

- `shared/chart-presets/charts/line-chart`
- `packages/chart/src/headless/line-chart`
- `docs/src/app/chart/_data/line-chart`
