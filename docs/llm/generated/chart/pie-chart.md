# Pie Chart

Show simple part-to-whole breakdowns with a small number of slices.

Generated: 2026-04-07

## Surface

Preset chart. Start with `chart-presets PieChart`. The wrapper already has a default visual direction, so style switching is not the first decision.

## Use When

- The prompt is a single composition snapshot
- The number of slices is modest and easy to label
- The user explicitly asks for pie or proportion slices

## Avoid When

- There are too many categories or values are close together
- Comparison across multiple groups matters more than one composition

## Quick Start

```ts
import Widget from "@flitterjs/react";
import PieChart from "./charts/pie-chart";

const widget = PieChart({
  data: {
  datasets: [
    { name: "Desktop", value: 42 },
    { name: "Mobile", value: 36 },
    { name: "Tablet", value: 22 }
  ]
},
});

<Widget widget={widget} width="720px" height="420px" />
```

## Data Contract

```ts
{
  datasets: [
    { name: "Desktop", value: 42 },
    { name: "Mobile", value: 36 },
    { name: "Tablet", value: 22 }
  ]
}
```

## Ask Before Coding

- How many slices will there be, and should tiny slices be grouped?
- Does the user want percentages, raw values, or both on labels?
- Would donut or stacked bar communicate the same story more clearly?

## Implementation Notes

- Use chart-presets PieChart for straightforward composition views.
- There is only toast today, so custom visual direction usually starts by overriding slots rather than switching presets.
- Keep the slice count disciplined.

## Override Surface

- slice: draw each arc segment
- dataView: control how slices are layered and wrapped
- legend: change label presentation or ordering
- title: explain denominator or context

## Escape Hatch

Go headless if the prompt really wants a donut, polar area, radial progress, or a novel circular composition pattern.

## Source Paths

- `shared/chart-presets/charts/pie-chart`
- `packages/chart/src/headless/pie-chart`
- `docs/src/app/chart/_data/pie-chart`
