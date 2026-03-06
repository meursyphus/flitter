# Ridgeline Chart — Radix-Like Spec

## Status
planned

## Purpose
Use a ridgeline chart (joy plot) to display the distribution of multiple groups as overlapping density plots, stacked vertically. Ideal for comparing distributions over time, across groups, or showing how a distribution changes.

## Data Shape
```typescript
type RidgelineChartData = {
  labels: string[];
  datasets: {
    values: number[];
  }[];
};
```

## Headless Slots
| Slot | Args | Purpose |
|------|------|---------|
| layout | data, size | Root layout (ridges, legend, title) |
| plot | datasets, scales | Plot area with overlapping ridges |
| ridge | datasetIndex, label, distribution | Container for one ridge row |
| densityPath | datasetIndex, path | Filled density curve path |
| ridgeLabel | label, index | Label for each ridge row |
| xAxis | scale | X-axis (shared value axis) |
| xAxisLabel | value, index | Individual x-axis value label |
| xAxisLine | — | X-axis baseline |
| legend | datasets | Legend for ridge groups |
| title | text | Chart title |

## Controller Methods
- `hoverRidge(datasetIndex)` — highlight a ridge, show tooltip
- `unhoverRidge()` — clear hover state
- `setOverlap(fraction)` — control how much ridges overlap (0 = no overlap, 1 = full)
- `setSize(width, height)` — update chart dimensions

## Style Presets
- toast: `ridge: { colors: string[], fillOpacity: number, strokeWidth: number }, overlap: number`, legend, title styling

## UX Patterns
- Hover highlight: hovering a ridge brings it to front and highlights it; dims others
- Overlap control: adjustable overlap between adjacent ridges for density vs clarity tradeoff
- Density computation: kernel density estimation from raw values
- Shared x-axis: all ridges share the same x-scale for comparability
- Animation: ridges grow from flat line to full density curve on mount
- Vertical ordering: ridges ordered top-to-bottom matching label order

## Storybook Stories Required
- Basic
- Many distributions
- Variable overlap
- With ridge labels
- Custom slot override
- With tooltip interaction
