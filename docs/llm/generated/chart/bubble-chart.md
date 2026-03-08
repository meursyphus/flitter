# Bubble Chart

Scatter chart with a third numeric value encoded by bubble size.

Generated: 2026-03-07

## Surface

Preset chart. Start with `chart-presets BubbleChart` and choose from `toast`, `ag`.

## Use When

- The request includes x, y, and magnitude/value at once
- Relative point size is part of the story
- The user wants a portfolio, opportunity, or impact matrix

## Avoid When

- The size encoding is decorative rather than meaningful
- Overlap becomes too high and the chart needs a different spatial strategy

## Quick Start

```ts
import Widget from "@flitterjs/react";
import { BubbleChart } from "chart-presets";

const widget = BubbleChart({
  style: "toast",
  data: {
  datasets: [
    {
      legend: "Accounts",
      data: [
        { x: 18, y: 42, value: 240, label: "North" },
        { x: 30, y: 28, value: 160, label: "West" },
        { x: 44, y: 55, value: 320, label: "Enterprise" }
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
      legend: "Accounts",
      data: [
        { x: 18, y: 42, value: 240, label: "North" },
        { x: 30, y: 28, value: 160, label: "West" },
        { x: 44, y: 55, value: 320, label: "Enterprise" }
      ]
    }
  ]
}
```

## Ask Before Coding

- What exactly should bubble size encode?
- How should labels behave when bubbles overlap?
- Will overlap require jitter, transparency, or a different chart family?

## Implementation Notes

- Use chart-presets BubbleChart first.
- Toast works well when the chart is presentation-heavy; ag works well for decision matrices.
- Bubble size semantics should be explained in title, legend, or hover copy if the prompt is ambiguous.

## Override Surface

- bubble: draw the actual bubble body
- dataView: order bubbles and overlays
- dataLabel: handle selective labels for crowded charts
- legend: explain size encoding if required

## Escape Hatch

Go headless if the plot needs collision management, complex labeling, or custom spatial annotations beyond the preset surface.

## Source Paths

- `shared/chart-presets/charts/bubble-chart`
- `packages/chart/src/headless/bubble-chart`
- `docs/src/app/chart/_data/bubble-chart`
