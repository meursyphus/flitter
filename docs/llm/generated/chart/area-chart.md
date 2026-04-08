# Area Chart

Trend chart where filled magnitude and cumulative visual weight matter.

Generated: 2026-04-08

## Surface

Preset chart. Start with `chart-presets AreaChart` and choose from `toast`, `ag`.

## Use When

- The user wants trend plus sense of magnitude
- One or two series should feel softer or more atmospheric than a plain line chart
- The prompt references filled area, coverage, or volume over time

## Avoid When

- Too many overlapping series would make the fill unreadable
- The user mainly wants exact comparison across many categories

## Quick Start

```ts
import Widget from "@flitterjs/react";
import AreaChart from "./charts/area-chart";

const widget = AreaChart({
  style: "toast",
  data: {
  labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  datasets: [
    { legend: "Traffic", values: [120, 148, 142, 176, 190] },
    { legend: "Activated", values: [82, 96, 101, 118, 130] }
  ]
},
});

<Widget widget={widget} width="720px" height="420px" />
```

## Data Contract

```ts
{
  labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  datasets: [
    { legend: "Traffic", values: [120, 148, 142, 176, 190] },
    { legend: "Activated", values: [82, 96, 101, 118, 130] }
  ]
}
```

## Ask Before Coding

- Should the area be overlapped or is this really stacked-area?
- Does opacity need to preserve comparison between multiple fills?
- Are point markers or thresholds required on top of the area?

## Implementation Notes

- Use chart-presets AreaChart for standard filled trend requests.
- Toast is usually the best first pass because the softer visual language fits area charts well.
- If overlays or focus interactions are heavy, consider headless composition after using slots.

## Override Surface

- area: draw the filled region and optional stroke
- dataView: order area layers and labels
- dataLabel: emphasize peaks or endpoints only
- grid / axes: tune readability for dense fills

## Escape Hatch

Go headless if the chart needs custom bands, mixed line-area layering, or annotation systems that exceed the preset surface.

## Source Paths

- `shared/chart-presets/charts/area-chart`
- `packages/chart/src/headless/line-chart`
- `docs/src/app/chart/_data/area-chart`
