# Bubble Chart — Radix-Like Spec

## Status
production

## Purpose
Use a bubble chart to visualize the relationship between three numeric variables: x-position, y-position, and bubble size (value). Ideal for comparing entities across three dimensions simultaneously.

## Data Shape
```typescript
type BubbleChartData = {
  datasets: {
    legend: string;
    data: {
      x: number;
      y: number;
      value: number;
      label?: string;
    }[];
  }[];
};

type BubbleChartScale = {
  x: { min?: number; max?: number; step?: number };
  y: { min?: number; max?: number; step?: number };
  value: { min?: number; max?: number; step?: number };
};
```

## Headless Slots
| Slot | Args | Purpose |
|------|------|---------|
| layout | data, size | Root layout (title, legend, axes, plot) |
| plot | scales, datasets | Plot area container |
| dataView | datasets, scales | Scrollable/clipped data region |
| scatter | label, legend, index, x, y, value | Individual bubble (same slot name as scatter) |
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
- `hoverPoint(datasetIndex, pointIndex)` — highlight a bubble, show tooltip with x, y, value, label
- `unhoverPoint()` — clear hover state
- `toggleSeries(legend)` — show/hide a dataset

## Style Presets
- toast: `bubble: { minRadius: 5, maxRadius: 50, opacity: 0.6 }`, axes, grid, legend, title styling
- ag: `bubble: { minRadius: 3, maxRadius: 25, opacity: 0.7 }`, axes, grid, legend, title styling

## UX Patterns
- Hover tooltip: bubble highlight on hover; tooltip shows x, y, value, and optional label
- Legend filtering: clicking a legend item hides/shows all bubbles for that dataset
- Click selection: not implemented by default; can be added via custom scatter slot
- Dense label fallback: numeric axis labels auto-step based on available space
- Animation: bubbles animate in on mount (scale from 0 to target radius); transition on data change
- Size mapping: value is linearly mapped between minRadius and maxRadius based on the value scale domain

## Storybook Stories Required
- Basic
- Multi-series
- Custom slot override
- With tooltip interaction
- Dense data
- With labels
- Size range demonstration
