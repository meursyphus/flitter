# Funnel Chart

Show sequential stage dropoff and conversion through a funnel.

Generated: 2026-04-08

## Surface

Base-wrapper chart. Start with `chart-presets FunnelChart` for structural defaults, but expect to own `custom` and `config` sooner than with fully themed preset charts.

## Use When

- The prompt is stage-by-stage attrition or conversion
- Order is fixed and meaningful
- Relative drop between stages matters more than precise axis comparison

## Avoid When

- Stages are not sequential
- A sankey or waterfall would better explain branching or cumulative change

## Quick Start

```ts
import Widget from "@flitterjs/react";
import FunnelChart from "./charts/funnel-chart";

const widget = FunnelChart({
  data: {
  stages: [
    { label: "Visited", value: 12000 },
    { label: "Signed Up", value: 4800 },
    { label: "Activated", value: 2100 },
    { label: "Paid", value: 840 }
  ]
},
});
// Add config/custom overrides as the request becomes more specific.

<Widget widget={widget} width="720px" height="420px" />
```

## Data Contract

```ts
{
  stages: [
    { label: "Visited", value: 12000 },
    { label: "Signed Up", value: 4800 },
    { label: "Activated", value: 2100 },
    { label: "Paid", value: 840 }
  ]
}
```

## Ask Before Coding

- Is stage order fixed?
- Should values show raw counts, percentages, or both?
- Does the chart need stage-to-stage conversion labels?

## Implementation Notes

- Use chart-presets FunnelChart as a base wrapper.
- Clarify whether this is raw-stage volume, conversion, or both.
- Branching flows are not funnel charts; use sankey instead.

## Override Surface

- stage: own segment geometry and labels
- stageLabel / dataLabel: explain conversion semantics
- legend: reinforce stage meaning if colors carry semantics
- layout: reshape the chart for a more product or dashboard tone

## Escape Hatch

Go headless if the funnel needs novel geometry, interactive stage expansion, or hybrid scorecard behavior.

## Source Paths

- `shared/chart-presets/charts/funnel-chart`
- `packages/chart/src/headless/funnel-chart`
