# Area Chart — Radix-Like Spec

## Status
production

## Purpose
Use an area chart to visualize trends with emphasis on volume or magnitude. The filled region between the line and the baseline communicates quantity more strongly than a line chart alone.

## Data Shape
```typescript
type AreaChartData = {
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
| line | datasetIndex, points, legend | The rendered filled area path |
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
- toast: `area: { strokeWidth: number, opacity: number, spline: boolean }`, axes, grid, legend, title styling
- ag: `area: { strokeWidth: number, opacity: number, spline: boolean }`, axes, grid, legend, title styling

## UX Patterns
- Hover tooltip: same nearest-point detection as line chart; vertical crosshair snaps to closest x-value
- Legend filtering: clicking a legend item hides/shows the area with fade animation
- Click selection: not implemented by default
- Dense label fallback: x-axis labels can be thinned or rotated via custom xAxisLabel slot
- Animation: area fills progressively on mount; opacity and shape transition on data change
- Spline interpolation: when spline is true, area boundary uses cubic bezier curves

## Storybook Stories Required
- Basic
- Multi-series
- Spline
- Custom slot override
- With tooltip interaction
- Dense data
