# Stacked Area Chart — Radix-Like Spec

## Status
production

## Purpose
Use a stacked area chart to show how multiple series contribute to a cumulative total over time or ordered categories. Ideal for visualizing composition changes and total magnitude simultaneously.

## Data Shape
```typescript
type StackedAreaChartData = {
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
| layout | data, size | Root layout (title, legend, axes, plot) |
| plot | scales, datasets | Plot area container |
| dataView | datasets, scales | Scrollable/clipped data region |
| line | datasetIndex, points, legend | The rendered stacked area path |
| xAxis | labels, scale | Full x-axis composition |
| yAxis | labels, scale | Full y-axis composition |
| xAxisLabel | label, index | Individual x-axis category label |
| yAxisLabel | label, index | Individual y-axis value label |
| xAxisTick | index | X-axis tick mark |
| yAxisTick | index | Y-axis tick mark |
| xAxisLine | — | X-axis baseline |
| yAxisLine | — | Y-axis baseline |
| grid | scales | Grid container |
| gridXLine | index | Vertical grid line |
| gridYLine | index | Horizontal grid line |
| axisCorner | — | Corner fill between axes |
| legend | datasets, toggleSeries | Interactive legend |
| title | text | Chart title |
| point | datasetIndex, pointIndex, value | Individual data point marker |

## Controller Methods
- `hoverPoint(datasetIndex, pointIndex)` — highlight a point, show tooltip
- `unhoverPoint()` — clear hover state
- `toggleSeries(legend)` — show/hide a dataset and recompute cumulative paths

## Style Presets
- toast: `area: { opacity: 0.6, strokeWidth: number, spline: boolean }`, axes, grid, legend, title styling
- ag: `area: { opacity: 0.7, strokeWidth: number, spline: boolean }`, axes, grid, legend, title styling

## UX Patterns
- Hover tooltip: nearest-point detection; tooltip shows individual value and cumulative total at that x
- Legend filtering: toggling a series removes it from the stack and recomputes cumulative paths with animation
- Click selection: not implemented by default
- Dense label fallback: x-axis labels can be thinned or rotated via custom xAxisLabel slot
- Animation: areas fill progressively on mount; cumulative paths transition smoothly on data change or series toggle
- Spline interpolation: when spline is true, cumulative area boundaries use cubic bezier curves

## Storybook Stories Required
- Basic
- Multi-series
- Spline
- Custom slot override
- With tooltip interaction
- Dense data
