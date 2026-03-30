# Sankey Chart

Show weighted flow between stages with controller-owned layout.

Generated: 2026-03-30

## Surface

Base-wrapper chart. Start with `chart-presets SankeyChart` for structural defaults, but expect to own `custom` and `config` sooner than with fully themed preset charts.

## Use When

- The prompt is weighted flow from source to target
- Branching matters more than totals alone
- Node and link layout must be computed from the data

## Avoid When

- The flow is strictly sequential dropoff, which may be funnel
- The data is a generic graph rather than weighted stage-to-stage flow

## Quick Start

```ts
import Widget from "@flitterjs/react";
import SankeyChart from "./charts/sankey-chart";

const widget = SankeyChart({
  data: {
  nodes: [
    { id: "visit", label: "Visit" },
    { id: "signup", label: "Sign Up" },
    { id: "paid", label: "Paid" }
  ],
  links: [
    { source: "visit", target: "signup", value: 4800 },
    { source: "signup", target: "paid", value: 840 }
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
    { id: "visit", label: "Visit" },
    { id: "signup", label: "Sign Up" },
    { id: "paid", label: "Paid" }
  ],
  links: [
    { source: "visit", target: "signup", value: 4800 },
    { source: "signup", target: "paid", value: 840 }
  ]
}
```

## Ask Before Coding

- Is stage ordering fixed or derived?
- Should links inherit source color, target color, or a neutral scale?
- How dense can node labels be before truncation or hover is needed?

## Implementation Notes

- Use chart-presets SankeyChart as a base wrapper on top of controller-owned layout.
- This is one of the clearest cases where the controller does real geometry work.
- If the request becomes an interactive flow editor, leave chart framing behind.

## Override Surface

- node / link / nodeLabel: own the visible flow marks
- sankey: control stacking order
- layout: manage title and surrounding shell
- title: explain the denominator or flow context

## Escape Hatch

Go headless if the layout, routing, or interaction model needs to diverge from the default sankey controller.

## Source Paths

- `shared/chart-presets/charts/sankey-chart`
- `packages/chart/src/headless/sankey-chart`
