# Dumbbell Chart — Radix-Like Spec

## Status
planned

## Purpose
Use a dumbbell chart to compare two related values per category, connected by a line to emphasize the gap. Ideal for showing ranges, before/after comparisons, gender gaps, or any paired data where the difference matters.

## Data Shape
```typescript
type DumbbellChartData = {
  labels: string[];
  datasets: [
    { legend: string; values: number[] },
    { legend: string; values: number[] }
  ];
};
```

## Headless Slots
| Slot | Args | Purpose |
|------|------|---------|
| layout | data, size | Root layout (title, legend, axes, plot) |
| plot | scales, datasets | Plot area container |
| dataView | datasets, scales | Scrollable/clipped data region |
| dumbbell | index, value1, value2 | Wrapper for one connected pair |
| connector | index, startValue, endValue | Line connecting the two dots |
| dot | datasetIndex, value, groupIndex | Circle at each value point |
| gapLabel | index, gap | Text showing the difference between values |
| xAxis | labels, scale | Full x-axis composition |
| yAxis | labels, scale | Full y-axis composition |
| xAxisLabel | label, index | Individual axis label |
| yAxisLabel | value, index | Individual axis value label |
| xAxisLine | — | X-axis baseline |
| yAxisLine | — | Y-axis baseline |
| grid | scales | Grid container |
| gridYLine | index | Horizontal grid line |
| legend | datasets | Interactive legend |
| title | text | Chart title |

## Controller Methods
- `hoverDumbbell(index)` — highlight a dumbbell pair, show tooltip
- `unhoverDumbbell()` — clear hover state
- `setSize(width, height)` — update chart dimensions

## Style Presets
- toast: `connector: { strokeWidth: number, color: string }, dot: { radius: number, colors: [string, string] }, gap: { fontSize: number }`, axes, grid, legend, title styling

## UX Patterns
- Hover tooltip: shows both values and the gap/difference
- Gap emphasis: connector line thickness or color can encode gap magnitude
- Color distinction: each dataset (left dot, right dot) has its own color
- Animation: dots animate from center to final positions; connector stretches
- Horizontal layout: categories on y-axis, values on x-axis (default)
- Sorting: can sort by gap size, value1, or value2

## Storybook Stories Required
- Basic
- With gap labels
- Sorted by gap
- Custom colors
- Custom slot override
- With tooltip interaction
