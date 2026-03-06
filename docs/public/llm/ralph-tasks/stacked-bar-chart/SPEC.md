# Stacked Bar Chart — Radix-Like Spec

## Status
production

## Purpose
Use a stacked bar chart to show how sub-categories contribute to a total across discrete categories. Ideal for part-to-whole comparisons where the cumulative total matters.

## Data Shape
```typescript
type StackedBarChartData = {
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
| layout | data, size, direction | Root layout (title, legend, axes, plot) |
| plot | scales, datasets | Plot area container |
| dataView | datasets, scales | Scrollable/clipped data region |
| barGroup | groupIndex, bars | Stacks bars vertically within one category |
| barBox | datasetIndex, value, groupIndex | Wrapper around individual bar segment |
| bar | datasetIndex, value, groupIndex | The rendered rectangle segment |
| dataLabel | datasetIndex, value, groupIndex | Text label on/near bar segment |
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

## Controller Methods
- `hoverBar(datasetIndex, groupIndex)` — highlight a bar segment, show tooltip
- `unhoverBar()` — clear hover state
- `toggleSeries(legend)` — show/hide a dataset
- `direction` — get/set vertical or horizontal orientation
- `setSize(width, height)` — update chart dimensions

## Style Presets
- toast: `bar: { gap: 0 (default), cornerRadius: number }`, axes, grid, legend, title styling
- ag: `bar: { gap: 0 (default), cornerRadius: number }`, axes, grid, legend, title styling

## UX Patterns
- Hover tooltip: highlights individual segment within the stack; tooltip shows segment value and total
- Legend filtering: clicking a legend item removes that dataset from the stack and rescales the y-axis
- Click selection: not implemented by default; can be added via custom bar slot
- Dense label fallback: same as bar chart — rotation or truncation via custom xAxisLabel slot
- Animation: bar segments animate via AnimatedFractionallySizedBox; stack reflows when a series is toggled
- Direction: supports both vertical (default) and horizontal orientation
- Negative values: supported; negative segments extend below the baseline

## Storybook Stories Required
- Basic
- Multi-series
- Horizontal
- Custom slot override
- With tooltip interaction
- Dense data
- Negative values
