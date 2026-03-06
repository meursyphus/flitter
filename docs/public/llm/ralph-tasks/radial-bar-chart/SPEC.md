# Radial Bar Chart — Radix-Like Spec

## Status
planned

## Purpose
Use a radial bar chart to display categorical data as bars arranged in a circle, adding visual interest compared to standard bar charts. Ideal for cyclical data (hours, months), ranking with emphasis, and dashboard displays where circular layout enhances aesthetics.

## Data Shape
```typescript
type RadialBarChartData = {
  labels: string[];
  datasets: {
    legend: string;
    values: number[];
  }[];
};
```

## Headless Slots
| Slot | Args | Purpose |
|------|------|---------|
| layout | data, size | Root layout (radialPlot, legend, title) |
| radialPlot | datasets, scales | Circular plot area |
| radialBar | datasetIndex, groupIndex, value, startAngle, endAngle | Arc-shaped bar segment |
| radialBarGroup | groupIndex, bars | Group of bars for one category |
| radialAxis | level, radius | Concentric circular grid line |
| radialAxisLabel | value, level | Value label on radial axis |
| angularLabel | label, angle, index | Category label at angular position |
| radialGridLine | angle, index | Radial line from center to edge |
| dataLabel | datasetIndex, groupIndex, value | Value label on/near bar |
| legend | datasets, toggleSeries | Interactive legend |
| title | text | Chart title |

## Controller Methods
- `hoverBar(datasetIndex, groupIndex)` — highlight a radial bar, show tooltip
- `unhoverBar()` — clear hover state
- `toggleSeries(legend)` — show/hide a dataset
- `setSize(width, height)` — update chart dimensions
- `setInnerRadius(fraction)` — set inner radius (0 = full circle, 0.5 = donut-like)

## Style Presets
- toast: `bar: { cornerRadius: number, gap: number, colors: string[] }, axis: { color: string, count: number }`, legend, title styling

## UX Patterns
- Hover tooltip: shows category, value, and percentage of max
- Angular labels: positioned outside the outermost ring at each category angle
- Concentric grid: circular grid lines at regular value intervals
- Multi-series: bars for same category arranged as concentric arcs or adjacent arcs
- Inner radius: configurable hole in the center (0 = pie-like, >0 = donut-like)
- Animation: bars grow outward from inner radius on mount
- Legend filtering: toggle datasets to show/hide series

## Storybook Stories Required
- Basic
- Multi-series
- With data labels
- Custom inner radius
- Custom slot override
- With tooltip interaction
