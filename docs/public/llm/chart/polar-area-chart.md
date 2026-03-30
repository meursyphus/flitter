# Polar Area Chart

Use equal-angle sectors with radial magnitude rather than slice angle for value.

Generated: 2026-03-30

## Surface

Base-wrapper chart. Start with `chart-presets PolarAreaChart` for structural defaults, but expect to own `custom` and `config` sooner than with fully themed preset charts.

## Use When

- Categories share equal angular space but differ by radial magnitude
- The request sounds like pie-like categories with varying radius
- Relative category magnitude matters more than exact proportion angle

## Avoid When

- A pie or donut would better communicate pure composition
- A radar chart would better communicate multi-axis profiles

## Quick Start

```ts
import Widget from "@flitterjs/react";
import PolarAreaChart from "./charts/polar-area-chart";

const widget = PolarAreaChart({
  data: {
  datasets: [
    { name: "North", value: 18 },
    { name: "South", value: 12 },
    { name: "West", value: 22 },
    { name: "East", value: 15 }
  ]
},
});
// Add config/custom overrides as the request becomes more specific.

<Widget widget={widget} width="720px" height="420px" />
```

## Data Contract

```ts
{
  datasets: [
    { name: "North", value: 18 },
    { name: "South", value: 12 },
    { name: "West", value: 22 },
    { name: "East", value: 15 }
  ]
}
```

## Ask Before Coding

- Is radial magnitude really more meaningful than angle-based composition?
- Do we need explicit scale rings or only the sectors?
- Would pie or radar be easier to read for this audience?

## Implementation Notes

- Use chart-presets PolarAreaChart as a base wrapper that reuses pie-style visuals.
- Explain why this is not a pie chart; otherwise the user may just want donut or pie.
- Keep the scale semantics explicit.

## Override Surface

- sector: own the radial sector rendering
- scale: add or refine radial guide rings
- legend / title: explain category meaning
- dataView: manage sector layering with scale backdrop

## Escape Hatch

Go headless if the radial scale, layering, or composite interaction exceeds the base wrapper.

## Source Paths

- `shared/chart-presets/charts/polar-area-chart`
- `packages/chart/src/headless/polar-area-chart`
