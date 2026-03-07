# Network Chart

Render nodes and edges with controller-owned spatial layout.

Generated: 2026-03-07

## Surface

Base-wrapper chart. Start with `chart-styles NetworkChart` for structural defaults, but expect to own `custom` and `config` sooner than with fully themed preset charts.

## Use When

- The data is a graph of nodes and relationships
- Connectivity matters more than a strict x/y axis
- The request sounds like topology, dependency, or relationship mapping

## Avoid When

- A sankey or treemap would explain weighted flow or area better
- The layout must be editor-like and highly interactive from the start

## Quick Start

```ts
import Widget from "@flitterjs/react";
import { NetworkChart } from "chart-styles";

const widget = NetworkChart({
  data: {
  nodes: [
    { id: "api", label: "API", group: "backend", size: 2 },
    { id: "worker", label: "Worker", group: "backend", size: 1 },
    { id: "db", label: "DB", group: "storage", size: 3 }
  ],
  edges: [
    { source: "api", target: "worker", weight: 2 },
    { source: "worker", target: "db", weight: 1 }
  ]
},
});
// Add config/custom overrides as the request becomes more specific.

<Widget widget={widget} width="720px" height="420px" />
```

## Data Contract

```ts
{
  nodes: [
    { id: "api", label: "API", group: "backend", size: 2 },
    { id: "worker", label: "Worker", group: "backend", size: 1 },
    { id: "db", label: "DB", group: "storage", size: 3 }
  ],
  edges: [
    { source: "api", target: "worker", weight: 2 },
    { source: "worker", target: "db", weight: 1 }
  ]
}
```

## Ask Before Coding

- Should layout be deterministic or force-directed?
- Do node size, group, or edge weight matter visually?
- How dense can labels be before they need hover-only treatment?

## Implementation Notes

- Use chart-styles NetworkChart as a base wrapper.
- This is controller-owned layout territory, so source-path honesty matters.
- If the chart is drifting toward a node editor, stop pretending it is just a chart.

## Override Surface

- node / edge / nodeLabel: own the visible graph marks
- network: control layering order
- legend: explain grouping if group colors matter
- layout: reshape the overall shell around the graph

## Escape Hatch

Go headless or direct-flitter if the graph becomes a full interactive diagram surface.

## Source Paths

- `shared/chart-styles/charts/network-chart`
- `packages/chart/src/headless/network-chart`
