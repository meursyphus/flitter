# Funnel Chart

Show sequential stage dropoff and conversion through a funnel.

Generated: 2026-10-07

## Surface

Preset chart. Start with `chart-presets FunnelChart`. The wrapper already has a default visual direction, so style switching is not the first decision.

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

- Install funnel-chart with --ag or --toast; the CLI copies an editable styled chart.
- Labels show raw values and percentage of the first stage; tooltips also show conversion from the previous stage.
- Branching flows are not funnel charts; use sankey instead.

## Override Surface

- stage: own segment geometry and labels
- dataLabel: explain conversion semantics
- legend: reinforce stage meaning if colors carry semantics
- layout: reshape the chart for a more product or dashboard tone

## Escape Hatch

Go headless if the funnel needs novel geometry, interactive stage expansion, or hybrid scorecard behavior.

## Source Paths

- `packages/chart/registry/templates/charts/funnel-chart`
- `packages/chart/src/headless/funnel-chart`
