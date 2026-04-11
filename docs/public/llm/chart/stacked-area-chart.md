# Stacked Area Chart

Show total trend over time while preserving how each series contributes.

Generated: 2026-04-08

## Surface

Preset chart. Start with `chart-presets StackedAreaChart` and choose from `toast`, `ag`.

## Use When

- The prompt is part-to-whole over time
- The user wants total trajectory and composition in one view
- The request mentions stacked trend or layered cumulative area

## Avoid When

- Series comparison at each point is more important than total composition
- A normalized 100% stack is required and the preset path is not enough

## Quick Start

```ts
import Widget from "@flitterjs/react";
import StackedAreaChart from "./charts/stacked-area-chart";

const widget = StackedAreaChart({
  style: "toast",
  data: {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  datasets: [
    { legend: "Organic", values: [34, 38, 42, 46] },
    { legend: "Paid", values: [18, 21, 19, 24] },
    { legend: "Referral", values: [6, 8, 9, 11] }
  ]
},
});

<Widget widget={widget} width="720px" height="420px" />
```

## Data Contract

```ts
{
  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  datasets: [
    { legend: "Organic", values: [34, 38, 42, 46] },
    { legend: "Paid", values: [18, 21, 19, 24] },
    { legend: "Referral", values: [6, 8, 9, 11] }
  ]
}
```

## Ask Before Coding

- Is this absolute stacked or normalized 100% stacked?
- Should smaller series stay visible even when buried inside the stack?
- Does the user need totals, contributions, or both labeled?

## Implementation Notes

- Use chart-presets StackedAreaChart first.
- Ag works well for dense operational views; toast works well for presentation surfaces.
- Pay attention to series ordering because it changes readability and perception.

## Override Surface

- area: customize each stacked band
- dataView: control stack ordering and wrappers
- legend: explain contribution order or visibility
- dataLabel: add totals or key contribution callouts

## Escape Hatch

Go headless if you need percent stacking, mixed overlays, or novel stacking semantics not covered by the preset controller.

## Source Paths

- `shared/chart-presets/charts/stacked-area-chart`
- `packages/chart/src/headless/line-chart`
- `docs/src/app/chart/_data/stacked-area-chart`
