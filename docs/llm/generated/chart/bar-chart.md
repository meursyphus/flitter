# Bar Chart

Compare discrete categories with grouped or directional bars.

Generated: 2026-03-07

## Surface

Preset chart. Start with `chart-styles BarChart` and choose from `toast`, `ag`.

## Use When

- The x domain is categorical rather than continuous
- The user wants direct comparison between categories or cohorts
- Negative values or horizontal orientation might matter

## Avoid When

- The main story is trend over continuous time
- The main story is part-to-whole at one moment

## Quick Start

```ts
import Widget from "@flitterjs/react";
import { BarChart } from "chart-styles";

const widget = BarChart({
  style: "toast",
  data: {
  labels: ["Jan", "Feb", "Mar", "Apr"],
  datasets: [
    { legend: "Revenue", values: [42, 58, 49, 73] },
    { legend: "Cost", values: [30, 35, 38, 46] }
  ]
},
});

<Widget widget={widget} width="720px" height="420px" />
```

## Data Contract

```ts
{
  labels: ["Jan", "Feb", "Mar", "Apr"],
  datasets: [
    { legend: "Revenue", values: [42, 58, 49, 73] },
    { legend: "Cost", values: [30, 35, 38, 46] }
  ]
}
```

## Ask Before Coding

- Should the chart be vertical or horizontal?
- Is the comparison grouped or should it actually be stacked?
- Do negative values or diverging bars need special treatment?

## Implementation Notes

- Start with chart-styles BarChart and only drop to headless when layout or bar rendering stops fitting.
- Prefer toast for expressive product UI; switch to ag for analyst dashboards.
- If the request asks for custom bar shapes, threshold markers, or label logic, use the custom slot surface before rewriting the chart.

## Override Surface

- bar: draw a fully custom bar body
- barBox: control size and reveal behavior
- barGroup: control grouping layout inside each category
- grid / xAxis / yAxis: tune the structural shell without rewriting the controller

## Escape Hatch

Go headless if categories need non-standard spatial layout, mixed chart layers, or custom interactions that no longer map cleanly to grouped bars.

## Source Paths

- `shared/chart-styles/charts/bar-chart`
- `packages/chart/src/headless/bar-chart`
- `docs/src/app/chart/_data/bar-chart`
