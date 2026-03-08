# Scatter Chart

Plot correlation, spread, clusters, and outliers across two numeric axes.

Generated: 2026-03-07

## Surface

Preset chart. Start with `chart-presets ScatterChart` and choose from `toast`, `ag`.

## Use When

- Both axes are numeric and point position matters
- The user wants correlation, clusters, or outliers
- Labels on individual points may matter more than a continuous series

## Avoid When

- A trend line alone would answer the question
- A third numeric variable needs size encoding, which means bubble chart

## Quick Start

```ts
import Widget from "@flitterjs/react";
import { ScatterChart } from "chart-presets";

const widget = ScatterChart({
  style: "toast",
  data: {
  datasets: [
    {
      legend: "Series A",
      data: [
        { x: 12, y: 24, label: "A1" },
        { x: 18, y: 31, label: "A2" },
        { x: 30, y: 28, label: "A3" }
      ]
    }
  ]
},
});

<Widget widget={widget} width="720px" height="420px" />
```

## Data Contract

```ts
{
  datasets: [
    {
      legend: "Series A",
      data: [
        { x: 12, y: 24, label: "A1" },
        { x: 18, y: 31, label: "A2" },
        { x: 30, y: 28, label: "A3" }
      ]
    }
  ]
}
```

## Ask Before Coding

- Should every point be labeled or only highlighted points?
- Is a trendline, regression, or quadrant annotation expected?
- Are the axes shared units, or do they need custom formatting?

## Implementation Notes

- Use chart-presets ScatterChart first.
- Ag is often a better fit for dense analytical scatter plots.
- If points need custom hit areas, annotations, or overlays, use the custom scatter slot before changing chart architecture.

## Override Surface

- scatter: draw each point body
- dataView: layer points and overlays together
- dataLabel: selectively annotate outliers
- grid / axes: adjust correlation readability

## Escape Hatch

Go headless if the chart becomes a map-like plot, quadrant workspace, or mixed scatter-plus-annotation canvas.

## Source Paths

- `shared/chart-presets/charts/scatter-chart`
- `packages/chart/src/headless/scatter-chart`
- `docs/src/app/chart/_data/scatter-chart`
