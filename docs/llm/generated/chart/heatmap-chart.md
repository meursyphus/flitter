# Heatmap Chart

Show matrix patterns by mapping numeric intensity onto a cell grid.

Generated: 2026-04-07

## Surface

Preset chart. Start with `chart-presets HeatmapChart`. The wrapper already has a default visual direction, so style switching is not the first decision.

## Use When

- The prompt is naturally x by y matrix data
- The user wants pattern, concentration, seasonality, or occupancy
- A color scale communicates the story better than discrete marks

## Avoid When

- Exact numeric comparison per cell matters more than pattern recognition
- The grid is sparse and another chart family would be clearer

## Quick Start

```ts
import Widget from "@flitterjs/react";
import HeatmapChart from "./charts/heatmap-chart";

const widget = HeatmapChart({
  data: {
  xLabels: ["Jan", "Feb", "Mar", "Apr"],
  yLabels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  values: [
    [4, 6, 9, 12],
    [3, 7, 10, 14],
    [2, 5, 8, 11],
    [4, 8, 12, 16],
    [5, 9, 13, 18]
  ]
},
});

<Widget widget={widget} width="720px" height="420px" />
```

## Data Contract

```ts
{
  xLabels: ["Jan", "Feb", "Mar", "Apr"],
  yLabels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  values: [
    [4, 6, 9, 12],
    [3, 7, 10, 14],
    [2, 5, 8, 11],
    [4, 8, 12, 16],
    [5, 9, 13, 18]
  ]
}
```

## Ask Before Coding

- Should the color scale domain be fixed or derived from the data?
- Do cells need values, labels, or only hover detail?
- Are missing cells real zeros or truly missing data?

## Implementation Notes

- Use chart-presets HeatmapChart first.
- Because only toast exists today, custom direction usually means slot overrides rather than preset switching.
- Always explain the scale and legend semantics if the prompt is not explicit.

## Override Surface

- segment: draw each heatmap cell
- legend: customize the color scale explanation
- dataView: manage cell wrappers or overlays
- xAxis / yAxis: tighten labels for dense matrices

## Escape Hatch

Go headless if the chart becomes a calendar grid, timetable, or matrix with rich cell widgets and custom interactions.

## Source Paths

- `shared/chart-presets/charts/heatmap-chart`
- `packages/chart/src/headless/heatmap-chart`
- `docs/src/app/chart/_data/heatmap-chart`
