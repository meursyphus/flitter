# Candlestick Chart

Represent open-high-low-close movement for each interval.

Generated: 2026-03-07

## Surface

Base-wrapper chart. Start with `chart-styles CandlestickChart` for structural defaults, but expect to own `custom` and `config` sooner than with fully themed preset charts.

## Use When

- The prompt contains OHLC data
- The story is interval-level price movement rather than simple totals
- High/low spread matters, not just close values

## Avoid When

- The user only has one value per interval
- A standard line chart is enough to communicate the trend

## Quick Start

```ts
import Widget from "@flitterjs/react";
import { CandlestickChart } from "chart-styles";

const widget = CandlestickChart({
  data: {
  labels: ["Mon", "Tue", "Wed", "Thu"],
  datasets: [
    {
      legend: "AAPL",
      data: [
        { open: 182, high: 188, low: 179, close: 186 },
        { open: 186, high: 191, low: 184, close: 185 },
        { open: 185, high: 189, low: 180, close: 183 },
        { open: 183, high: 187, low: 181, close: 186 }
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
  labels: ["Mon", "Tue", "Wed", "Thu"],
  datasets: [
    {
      legend: "AAPL",
      data: [
        { open: 182, high: 188, low: 179, close: 186 },
        { open: 186, high: 191, low: 184, close: 185 },
        { open: 185, high: 189, low: 180, close: 183 },
        { open: 183, high: 187, low: 181, close: 186 }
      ]
    }
  ]
}
```

## Ask Before Coding

- What is the aggregation interval: minute, hour, day, or something else?
- Should bullish/bearish colors follow a specific convention?
- Do we need volume, moving averages, or overlays, which may turn this into a combo chart?

## Implementation Notes

- chart-styles CandlestickChart gives a base structural wrapper.
- Treat color semantics and interval labeling as first-class questions.
- Use combo only if the request adds extra layers like moving averages or volume bars.

## Override Surface

- candlestick: own wick/body appearance
- dataView: control grouping and overlays
- dataLabel: annotate unusual intervals only
- axes / grid: tune finance-style readability

## Escape Hatch

Go headless if financial overlays, custom scales, or bespoke interaction rules exceed the base wrapper.

## Source Paths

- `shared/chart-styles/charts/candlestick-chart`
- `packages/chart/src/headless/candlestick-chart`
