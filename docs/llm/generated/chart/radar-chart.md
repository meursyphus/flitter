# Radar Chart

Compare multivariate profiles across shared radial axes.

Generated: 2026-03-07

## Surface

Preset chart. Start with `chart-styles RadarChart`. The wrapper already has a default visual direction, so style switching is not the first decision.

## Use When

- The prompt compares profiles across repeated dimensions
- The user references capability, competency, balance, or spider-web comparisons
- Each dataset should share the same labeled axes around a center

## Avoid When

- The dimensions are too many to read on radial axes
- Precise numeric comparison is more important than profile shape

## Quick Start

```ts
import Widget from "@flitterjs/react";
import { RadarChart } from "chart-styles";

const widget = RadarChart({
  data: {
  labels: ["Speed", "Quality", "Adoption", "Reliability", "Cost"],
  datasets: [
    { legend: "Current", values: [72, 81, 66, 88, 54] },
    { legend: "Target", values: [80, 84, 74, 92, 62] }
  ]
},
});

<Widget widget={widget} width="720px" height="420px" />
```

## Data Contract

```ts
{
  labels: ["Speed", "Quality", "Adoption", "Reliability", "Cost"],
  datasets: [
    { legend: "Current", values: [72, 81, 66, 88, 54] },
    { legend: "Target", values: [80, 84, 74, 92, 62] }
  ]
}
```

## Ask Before Coding

- How many axes are there, and are their units genuinely comparable?
- Should the scale be fixed, derived, or explicitly provided?
- Does the chart need filled polygons, outline-only polygons, or highlighted vertices?

## Implementation Notes

- Use chart-styles RadarChart when the request clearly maps to shared radial dimensions.
- There is only toast today, so novel visual direction usually means slot overrides.
- The scale choice changes interpretation; do not guess when the prompt hints at a fixed benchmark.

## Override Surface

- radar: draw each dataset polygon
- angularAxisLabel: control category labeling
- radialAxisLabel: control scale labeling
- layout / plot: manage legends and profile density

## Escape Hatch

Go headless if the chart needs custom radial geometry, non-polygon profiles, or heavy annotation logic.

## Source Paths

- `shared/chart-styles/charts/radar-chart`
- `packages/chart/src/headless/radar-chart`
- `docs/src/app/chart/_data/radar-chart`
