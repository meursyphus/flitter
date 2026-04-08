# Sunburst Chart

Display hierarchical composition as concentric radial segments.

Generated: 2026-04-08

## Surface

Base-wrapper chart. Start with `chart-presets SunburstChart` for structural defaults, but expect to own `custom` and `config` sooner than with fully themed preset charts.

## Use When

- The data is hierarchical and part-to-whole at multiple depths matters
- The prompt sounds like radial hierarchy rather than flat composition
- Depth and parent-child context are important

## Avoid When

- A treemap would communicate area hierarchy more clearly
- The hierarchy is shallow enough that pie or donut would do

## Quick Start

```ts
import Widget from "@flitterjs/react";
import SunburstChart from "./charts/sunburst-chart";

const widget = SunburstChart({
  data: {
  root: {
    label: "Company",
    children: [
      { label: "Product", children: [{ label: "Core", value: 42 }, { label: "Add-ons", value: 18 }] },
      { label: "Services", children: [{ label: "Support", value: 24 }, { label: "Consulting", value: 16 }] }
    ]
  }
},
});
// Add config/custom overrides as the request becomes more specific.

<Widget widget={widget} width="720px" height="420px" />
```

## Data Contract

```ts
{
  root: {
    label: "Company",
    children: [
      { label: "Product", children: [{ label: "Core", value: 42 }, { label: "Add-ons", value: 18 }] },
      { label: "Services", children: [{ label: "Support", value: 24 }, { label: "Consulting", value: 16 }] }
    ]
  }
}
```

## Ask Before Coding

- How many hierarchy levels need to be visible?
- Do labels belong directly on segments or in legend/hover?
- Would treemap be more readable for this audience?

## Implementation Notes

- Use chart-presets SunburstChart as a base wrapper.
- Label density is the first thing that breaks on sunbursts.
- This is a good candidate for novel label behavior or legend composition.

## Override Surface

- segment: own each radial hierarchy segment
- legend / legendItem: explain depth or grouping
- sunburst: manage segment layering
- layout: make room for legends and hierarchy explanation

## Escape Hatch

Go headless if depth, label routing, or interaction exceed the base wrapper.

## Source Paths

- `shared/chart-presets/charts/sunburst-chart`
- `packages/chart/src/headless/sunburst-chart`
