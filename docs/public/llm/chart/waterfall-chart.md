# Waterfall Chart

Show cumulative change through increases, decreases, and totals.

Generated: 2026-04-07

## Surface

Base-wrapper chart. Start with `chart-presets WaterfallChart` for structural defaults, but expect to own `custom` and `config` sooner than with fully themed preset charts.

## Use When

- The story is stepwise cumulative change
- Interim increases and decreases matter before a final total
- The prompt sounds like bridge chart or variance walk

## Avoid When

- Plain category comparison is enough
- The data is not cumulative or sequential

## Quick Start

```ts
import Widget from "@flitterjs/react";
import WaterfallChart from "./charts/waterfall-chart";

const widget = WaterfallChart({
  data: {
  labels: ["Start", "Upsell", "Churn", "Expansion", "End"],
  values: [120, 24, -18, 12, 0],
  totals: [
    { totalType: "total", index: 0 },
    { totalType: "total", index: 4 }
  ]
},
});
// Add config/custom overrides as the request becomes more specific.

<Widget widget={widget} width="720px" height="420px" />
```

## Data Contract

```ts
{
  labels: ["Start", "Upsell", "Churn", "Expansion", "End"],
  values: [120, 24, -18, 12, 0],
  totals: [
    { totalType: "total", index: 0 },
    { totalType: "total", index: 4 }
  ]
}
```

## Ask Before Coding

- Which indices are totals?
- Do positive, negative, and total bars require distinct semantics?
- Should connectors be visible or subdued?

## Implementation Notes

- Use chart-presets WaterfallChart as a base wrapper.
- Total indices are not optional semantics; clarify them early.
- This is a cumulative story, not just a signed bar chart.

## Override Surface

- bar: own increase/decrease/total rendering
- connector: explain cumulative linkage
- dataLabel: surface type-aware labels
- axes / grid / layout: reinforce cumulative context

## Escape Hatch

Go headless if cumulative rules, subtotals, or hybrid overlays exceed the base wrapper.

## Source Paths

- `shared/chart-presets/charts/waterfall-chart`
- `packages/chart/src/headless/waterfall-chart`
