# Bar Chart — Radix-Like Spec

## Status
production

## Purpose
Use a bar chart to compare discrete categories by encoding values as rectangular bars. Ideal for ranking, distribution, and part-to-whole comparisons across a single dimension.

## Data Shape
```typescript
type BarChartData = {
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
| barGroup | groupIndex, bars | Groups bars for one category |
| barBox | datasetIndex, value, groupIndex | Wrapper around individual bar (for labels) |
| bar | datasetIndex, value, groupIndex | The rendered rectangle |
| dataLabel | datasetIndex, value, groupIndex | Text label on/near bar |
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
- `hoverBar(datasetIndex, groupIndex)` — highlight a bar, show tooltip
- `unhoverBar()` — clear hover state
- `toggleSeries(legend)` — show/hide a dataset
- `direction` — get/set vertical or horizontal orientation
- `setSize(width, height)` — update chart dimensions

## Style Presets
- toast: `bar: { gap: number, cornerRadius: number }`, axes, grid, legend, title styling
- ag: `bar: { gap: number, cornerRadius: number }`, axes, grid, legend, title styling

## UX Patterns
- Hover tooltip: 16-case positioning logic based on bar location relative to chart center; tooltip follows cursor and flips to avoid overflow
- Legend filtering: clicking a legend item calls toggleSeries to hide/show the dataset with animation
- Click selection: not implemented by default; can be added via custom bar slot
- Dense label fallback: when labels overlap, rotation or truncation can be applied via custom xAxisLabel slot
- Animation: bars animate via AnimatedFractionallySizedBox from zero to target fraction on mount and data change
- Direction: supports both vertical (default) and horizontal orientation; swaps x/y axis roles

## Storybook Stories Required
- Basic
- Multi-series
- Horizontal
- Custom slot override
- With tooltip interaction
- Dense data
