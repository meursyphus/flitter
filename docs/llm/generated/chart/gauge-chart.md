# Gauge Chart

Display a single KPI against a bounded range and optional zones.

Generated: 2026-03-07

## Surface

Base-wrapper chart. Start with `chart-presets GaugeChart` for structural defaults, but expect to own `custom` and `config` sooner than with fully themed preset charts.

## Use When

- The prompt is one bounded KPI with qualitative thresholds
- A radial scale communicates status clearly
- Zones or ranges matter as much as the absolute value

## Avoid When

- A linear progress track would be clearer
- The user wants multi-dimensional comparison, not one KPI

## Quick Start

```ts
import Widget from "@flitterjs/react";
import { GaugeChart } from "chart-presets";

const widget = GaugeChart({
  data: {
  value: 72,
  min: 0,
  max: 100,
  zones: [
    { min: 0, max: 50, color: "#ff6b6b" },
    { min: 50, max: 80, color: "#ffd166" },
    { min: 80, max: 100, color: "#06d6a0" }
  ]
},
});
// Add config/custom overrides as the request becomes more specific.

<Widget widget={widget} width="720px" height="420px" />
```

## Data Contract

```ts
{
  value: 72,
  min: 0,
  max: 100,
  zones: [
    { min: 0, max: 50, color: "#ff6b6b" },
    { min: 50, max: 80, color: "#ffd166" },
    { min: 80, max: 100, color: "#06d6a0" }
  ]
}
```

## Ask Before Coding

- Is the min/max fixed or derived?
- Do threshold zones need explicit colors and labels?
- Would a progress chart communicate the same KPI more cleanly?

## Implementation Notes

- Use chart-presets GaugeChart as a base wrapper.
- Gauge charts are easy to misuse; confirm the bounded-range story first.
- Zones are often the real reason to choose gauge over progress.

## Override Surface

- gauge / scale: own the arc and zone rendering
- needle: control the pointer treatment
- valueLabel: change how the KPI is expressed
- layout: reposition title, gauge, and value stack

## Escape Hatch

Go headless if the gauge becomes a composite radial dashboard or needs non-standard arc behavior.

## Source Paths

- `shared/chart-presets/charts/gauge-chart`
- `packages/chart/src/headless/gauge-chart`
