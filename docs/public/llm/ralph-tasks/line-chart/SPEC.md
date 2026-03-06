# Line Chart — Radix-Like Spec

## Status
production

## Purpose
Use a line chart to visualize trends over ordered categories or time. Ideal for showing change over time, comparing multiple series, and spotting patterns in continuous data.

## Data Shape
```typescript
type LineChartData = {
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
| line | datasetIndex, points, legend | The rendered line path |
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
- `toggleSeries(legend)` — show/hide a dataset

## Style Presets
- toast: `line: { strokeWidth: number, spline: boolean }`, axes, grid, legend, title styling
- ag: `line: { strokeWidth: number, spline: boolean }`, axes, grid, legend, title styling

## UX Patterns
- Hover tooltip: nearest-point detection; vertical crosshair snaps to closest x-value; tooltip shows all series values at that x
- Legend filtering: clicking a legend item hides/shows the line with fade animation
- Click selection: not implemented by default
- Dense label fallback: x-axis labels can be thinned or rotated via custom xAxisLabel slot
- Animation: line draws progressively on mount; transitions smoothly on data change
- Spline interpolation: when spline is true, line uses cubic bezier curves between points

## Storybook Stories Required
- Basic
- Multi-series
- Spline
- Custom slot override
- With tooltip interaction
- Dense data
