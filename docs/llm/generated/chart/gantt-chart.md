# Gantt Chart

Visualize tasks across time with optional dependencies and progress.

Generated: 2026-03-07

## Surface

Base-wrapper chart. Start with `chart-presets GanttChart` for structural defaults, but expect to own `custom` and `config` sooner than with fully themed preset charts.

## Use When

- The data is task start/end over a shared timeline
- Task duration and overlap matter
- Dependencies or milestones may matter

## Avoid When

- The prompt is about aggregated progress only
- There is no real time range per task

## Quick Start

```ts
import Widget from "@flitterjs/react";
import { GanttChart } from "chart-presets";

const widget = GanttChart({
  data: {
  tasks: [
    { id: "design", label: "Design", start: 0, end: 4, progress: 1 },
    { id: "build", label: "Build", start: 3, end: 10, progress: 0.6, dependencies: ["design"] },
    { id: "qa", label: "QA", start: 9, end: 12, progress: 0.2, dependencies: ["build"] }
  ]
},
});
// Add config/custom overrides as the request becomes more specific.

<Widget widget={widget} width="720px" height="420px" />
```

## Data Contract

```ts
{
  tasks: [
    { id: "design", label: "Design", start: 0, end: 4, progress: 1 },
    { id: "build", label: "Build", start: 3, end: 10, progress: 0.6, dependencies: ["design"] },
    { id: "qa", label: "QA", start: 9, end: 12, progress: 0.2, dependencies: ["build"] }
  ]
}
```

## Ask Before Coding

- What time unit should the x-axis use?
- Do we need progress bars, milestones, dependencies, or group rows?
- Should the layout prioritize schedule density or readability?

## Implementation Notes

- Use chart-presets GanttChart as a base wrapper.
- Time scale and dependency rendering are the first constraints to clarify.
- If the layout becomes a true project board, consider direct composition or a novel pattern.

## Override Surface

- taskBar / milestone / dependency: own timeline marks
- xAxis: control time labeling
- yAxisLabel: control task row labeling
- dataView / layout: reshape the entire schedule view

## Escape Hatch

Go headless if scheduling logic, grouped swimlanes, or dependency routing exceed the base wrapper.

## Source Paths

- `shared/chart-presets/charts/gantt-chart`
- `packages/chart/src/headless/gantt-chart`
