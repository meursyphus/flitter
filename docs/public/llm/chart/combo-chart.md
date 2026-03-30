# Combo Chart

Combine bars, lines, and areas, optionally with primary and secondary axes.

Generated: 2026-03-30

## Surface

Base-wrapper chart. Start with `chart-presets ComboChart` for structural defaults, but expect to own `custom` and `config` sooner than with fully themed preset charts.

## Use When

- The request explicitly mixes chart mark types
- Different series need different encodings
- A secondary axis is materially useful

## Avoid When

- A single chart family would explain the data more clearly
- The second axis would obscure rather than clarify interpretation

## Quick Start

```ts
import Widget from "@flitterjs/react";
import ComboChart from "./charts/combo-chart";

const widget = ComboChart({
  data: {
  labels: ["Jan", "Feb", "Mar", "Apr"],
  datasets: [
    { legend: "Revenue", type: "bar", values: [120, 142, 136, 168], yAxisId: "primary" },
    { legend: "Margin", type: "line", values: [28, 31, 30, 34], yAxisId: "secondary" }
  ]
},
});
// Add config/custom overrides as the request becomes more specific.

<Widget widget={widget} width="720px" height="420px" />
```

## Data Contract

```ts
{
  labels: ["Jan", "Feb", "Mar", "Apr"],
  datasets: [
    { legend: "Revenue", type: "bar", values: [120, 142, 136, 168], yAxisId: "primary" },
    { legend: "Margin", type: "line", values: [28, 31, 30, 34], yAxisId: "secondary" }
  ]
}
```

## Ask Before Coding

- Which datasets are bars, lines, or areas?
- Does any dataset truly require a secondary axis?
- Would linked small multiples communicate the story better than one hybrid chart?

## Implementation Notes

- Use chart-presets ComboChart as a composition-ready base wrapper.
- Do not jump to combo unless the prompt genuinely needs mixed marks.
- Secondary axis usage should be justified, not automatic.

## Override Surface

- bar / line / area: customize each mark family independently
- yAxis2: own the secondary-axis shell
- dataView: control layering order
- linePoint / dataLabel: annotate critical hybrid signals

## Escape Hatch

Go headless when the hybrid behavior needs cross-series coordination, novel overlays, or interaction beyond the base wrapper.

## Source Paths

- `shared/chart-presets/charts/combo-chart`
- `packages/chart/src/headless/combo-chart`
