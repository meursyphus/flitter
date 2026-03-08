# Histogram Chart

Show numeric distribution by bins rather than individual raw points.

Generated: 2026-03-07

## Surface

Base-wrapper chart. Start with `chart-presets HistogramChart` for structural defaults, but expect to own `custom` and `config` sooner than with fully themed preset charts.

## Use When

- The prompt is about the shape of a numeric distribution
- Continuous numeric values should be aggregated into bins
- Frequency or count by range matters

## Avoid When

- Values are categorical rather than continuous
- The user already has quartiles and wants a box plot instead

## Quick Start

```ts
import Widget from "@flitterjs/react";
import { HistogramChart } from "chart-presets";

const widget = HistogramChart({
  data: {
  values: [12, 14, 14, 18, 21, 24, 24, 25, 27, 31, 33, 36],
  binCount: 6
},
});
// Add config/custom overrides as the request becomes more specific.

<Widget widget={widget} width="720px" height="420px" />
```

## Data Contract

```ts
{
  values: [12, 14, 14, 18, 21, 24, 24, 25, 27, 31, 33, 36],
  binCount: 6
}
```

## Ask Before Coding

- Are raw values provided or are bins already computed?
- How many bins should be used?
- Are we showing count, density, or a normalized frequency?

## Implementation Notes

- Use chart-presets HistogramChart as a base wrapper.
- Bin strategy changes interpretation, so do not guess quietly.
- If the prompt starts asking for KDE curves or multiple distributions, you may need a novel hybrid pattern.

## Override Surface

- bar: own bin appearance
- dataLabel: annotate frequency selectively
- grid / axes: support distribution reading
- layout: keep the chart focused on count semantics

## Escape Hatch

Go headless if binning logic, overlays, or distribution interaction go beyond the base wrapper.

## Source Paths

- `shared/chart-presets/charts/histogram-chart`
- `packages/chart/src/headless/histogram-chart`
