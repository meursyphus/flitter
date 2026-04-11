# Treemap Chart

Represent proportional rectangles in a dense area-based map.

Generated: 2026-04-08

## Surface

Base-wrapper chart. Start with `chart-presets TreemapChart` for structural defaults, but expect to own `custom` and `config` sooner than with fully themed preset charts.

## Use When

- Area proportionality matters more than radial context
- The prompt sounds like market-share blocks or dense composition map
- Labelable rectangles are preferable to radial slices

## Avoid When

- The audience needs radial hierarchy context
- There are very few categories and a simpler chart would read better

## Quick Start

```ts
import Widget from "@flitterjs/react";
import TreemapChart from "./charts/treemap-chart";

const widget = TreemapChart({
  data: {
  nodes: [
    { label: "Enterprise", value: 42, color: "#4e79a7" },
    { label: "SMB", value: 26, color: "#f28e2b" },
    { label: "Mid-Market", value: 18, color: "#59a14f" },
    { label: "Channel", value: 14, color: "#e15759" }
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
    { label: "Enterprise", value: 42, color: "#4e79a7" },
    { label: "SMB", value: 26, color: "#f28e2b" },
    { label: "Mid-Market", value: 18, color: "#59a14f" },
    { label: "Channel", value: 14, color: "#e15759" }
  ]
}
```

## Ask Before Coding

- How dense can labels be inside rectangles?
- Do colors carry grouping semantics or only visual distinction?
- Is the data flat or should it behave like hierarchy externally even if the current type is flat?

## Implementation Notes

- Use chart-presets TreemapChart as a base wrapper.
- Current data type is flat node-based, so do not invent deeper hierarchy support without saying so.
- Treemap label density and color semantics are the main design pressure points.

## Override Surface

- node: own rectangle body and in-node label layout
- treemap: control node layering
- legend: explain grouping if colors imply structure
- layout: give labels enough breathing room

## Escape Hatch

Go headless if layout strategy, label routing, or pseudo-hierarchy support need to change materially.

## Source Paths

- `shared/chart-presets/charts/treemap-chart`
- `packages/chart/src/headless/treemap-chart`
