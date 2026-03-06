# Histogram Chart — Radix-Like Spec

## Status
planned

## Purpose
Use a histogram to visualize the distribution of continuous numerical data by grouping values into bins. Ideal for understanding frequency distributions, identifying skew, outliers, and modality in datasets.

## Data Shape
```typescript
type HistogramChartData = {
  values: number[];
  binCount?: number;
};
```

## Headless Slots
| Slot | Args | Purpose |
|------|------|---------|
| layout | data, size | Root layout (title, legend, axes, plot) |
| plot | scales, bins | Plot area container |
| dataView | bins, scales | Scrollable/clipped data region |
| binGroup | binIndex, bin | Wrapper around a single bin |
| bin | binIndex, frequency, range | The rendered rectangle for one bin |
| dataLabel | binIndex, frequency | Text label on/near bin (frequency count) |
| xAxis | scale | Full x-axis composition (continuous) |
| yAxis | scale | Full y-axis composition (frequency) |
| xAxisLabel | value, index | Individual x-axis value label |
| yAxisLabel | value, index | Individual y-axis frequency label |
| xAxisTick | index | X-axis tick mark |
| yAxisTick | index | Y-axis tick mark |
| xAxisLine | — | X-axis baseline |
| yAxisLine | — | Y-axis baseline |
| grid | scales | Grid container |
| gridXLine | index | Vertical grid line |
| gridYLine | index | Horizontal grid line |
| legend | — | Legend (for multi-distribution overlay) |
| title | text | Chart title |

## Controller Methods
- `hoverBin(binIndex)` — highlight a bin, show tooltip with range and frequency
- `unhoverBin()` — clear hover state
- `setBinCount(count)` — update number of bins and recompute distribution
- `setSize(width, height)` — update chart dimensions

## Style Presets
- toast: `bin: { gap: number, cornerRadius: number, color: string }`, axes, grid, legend, title styling

## UX Patterns
- Hover tooltip: shows bin range [min, max) and frequency count; tooltip positioned above bin
- Bin count control: adjusting bin count recomputes the distribution with animation
- Animation: bins animate via AnimatedFractionallySizedBox from zero to target height on mount and data change
- Dense label fallback: when bin labels overlap, show every Nth label
- No gap mode: bins can be rendered edge-to-edge (gap: 0) for traditional histogram look

## Storybook Stories Required
- Basic
- Custom bin count
- With data labels
- Dense data (many values)
- Custom slot override
- With tooltip interaction
