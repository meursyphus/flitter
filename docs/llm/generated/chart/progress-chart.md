# Progress Chart

Linear progress track for a single value or segmented completion state.

Generated: 2026-03-07

## Surface

Base-wrapper chart. Start with `chart-presets ProgressChart` for structural defaults, but expect to own `custom` and `config` sooner than with fully themed preset charts.

## Use When

- The prompt is bounded completion or progress
- A simple track reads better than a gauge
- The data is a single KPI or segmented completion breakdown

## Avoid When

- Multiple categorical comparisons are needed
- The user actually needs a gauge with zones or a donut with center summary

## Quick Start

```ts
import Widget from "@flitterjs/react";
import { ProgressChart } from "chart-presets";

const widget = ProgressChart({
  data: {
  segments: [
    { label: "Complete", value: 64, color: "#06d6a0" },
    { label: "In Review", value: 20, color: "#ffd166" },
    { label: "Blocked", value: 16, color: "#ef476f" }
  ],
  max: 100
},
});
// Add config/custom overrides as the request becomes more specific.

<Widget widget={widget} width="720px" height="420px" />
```

## Data Contract

```ts
{
  segments: [
    { label: "Complete", value: 64, color: "#06d6a0" },
    { label: "In Review", value: 20, color: "#ffd166" },
    { label: "Blocked", value: 16, color: "#ef476f" }
  ],
  max: 100
}
```

## Ask Before Coding

- Is this a single value or segmented progress?
- What is the max or target value?
- Do segment labels live on-track, off-track, or only in surrounding text?

## Implementation Notes

- Use chart-presets ProgressChart as a base wrapper.
- Gauge is not the default; choose progress when a linear bounded track is clearer.
- Segmented progress often drifts toward composite scorecards, so watch scope creep.

## Override Surface

- track / fill: own the progress body
- segmentLabel: control per-segment text
- valueLabel: summarize completion clearly
- layout: pair the track with contextual labels or KPIs

## Escape Hatch

Go headless or direct composition if the progress track becomes part of a richer scorecard or dashboard module.

## Source Paths

- `shared/chart-presets/charts/progress-chart`
- `packages/chart/src/headless/progress-chart`
