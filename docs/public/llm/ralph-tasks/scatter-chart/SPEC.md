# Scatter Chart — Radix-Like Spec

## Status
production

## Purpose
Use a scatter chart to visualize the relationship between two numeric variables. Ideal for spotting correlations, clusters, and outliers across datasets.

## Data Shape
```typescript
type ScatterChartData = {
  datasets: {
    legend: string;
    data: {
      x: number;
      y: number;
      label?: string;
    }[];
  }[];
};

type ScatterChartScale = {
  x: { min?: number; max?: number; step?: number };
  y: { min?: number; max?: number; step?: number };
};
```

## Headless Slots
| Slot | Args | Purpose |
|------|------|---------|
| layout | data, size | Root layout (title, legend, axes, plot) |
| plot | scales, datasets | Plot area container |
| dataView | datasets, scales | Scrollable/clipped data region |
| scatter | label, legend, index, x, y | Individual scatter point |
| xAxis | scale | Full x-axis composition (numeric) |
| yAxis | scale | Full y-axis composition (numeric) |
| xAxisLabel | label, index | Individual x-axis value label |
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

## Controller Methods
- `hoverPoint(datasetIndex, pointIndex)` — highlight a point, show tooltip with x, y, label
- `unhoverPoint()` — clear hover state
- `toggleSeries(legend)` — show/hide a dataset

## Style Presets
- toast: `scatter: { size: 10, fill: false, strokeWidth: 2 }`, 4 shapes per series (circle, square, triangle, star), axes, grid, legend, title styling
- ag: `scatter: { size: 10, strokeWidth: 2 }`, axes, grid, legend, title styling

## UX Patterns
- Hover tooltip: point highlight on hover; tooltip shows x, y values and optional label
- Legend filtering: clicking a legend item hides/shows all points for that dataset
- Click selection: not implemented by default; can be added via custom scatter slot
- Dense label fallback: numeric axis labels auto-step based on available space
- Animation: points animate in on mount (scale from 0 to target size); transition on data change
- Shape differentiation: toast preset assigns different shapes (circle, square, triangle, star) per dataset for accessibility

## Storybook Stories Required
- Basic
- Multi-series
- Custom slot override
- With tooltip interaction
- Dense data
- With labels
