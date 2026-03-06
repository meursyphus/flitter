# Lollipop Chart — Radix-Like Spec

## Status
planned

## Purpose
Use a lollipop chart as a cleaner alternative to bar charts, displaying values as dots on stems. Ideal for ranking data, highlighting individual values, and reducing visual clutter compared to filled bars, especially with many categories.

## Data Shape
```typescript
type LollipopChartData = {
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
| lollipopGroup | groupIndex, lollipops | Groups lollipops for one category |
| lollipop | datasetIndex, value, groupIndex | Wrapper around stem + dot |
| stem | datasetIndex, value, groupIndex | The line/stick from baseline to value |
| dot | datasetIndex, value, groupIndex | The circle at the end of the stem |
| dataLabel | datasetIndex, value, groupIndex | Text label on/near dot |
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
| legend | datasets, toggleSeries | Interactive legend |
| title | text | Chart title |

## Controller Methods
- `hoverLollipop(datasetIndex, groupIndex)` — highlight a lollipop, show tooltip
- `unhoverLollipop()` — clear hover state
- `toggleSeries(legend)` — show/hide a dataset
- `direction` — get/set vertical or horizontal orientation
- `setSize(width, height)` — update chart dimensions

## Style Presets
- toast: `stem: { strokeWidth: number, color: string }, dot: { radius: number, color: string }`, axes, grid, legend, title styling

## UX Patterns
- Hover tooltip: shows value; dot scales up on hover for emphasis
- Legend filtering: clicking a legend item toggles dataset visibility
- Direction: supports both vertical (default) and horizontal orientation
- Animation: stems grow from baseline to value; dots appear at the end
- Multi-series: multiple lollipops side-by-side within each category group
- Dense label fallback: same as bar chart label handling

## Storybook Stories Required
- Basic
- Multi-series
- Horizontal
- With data labels
- Custom slot override
- With tooltip interaction
- Dense data
