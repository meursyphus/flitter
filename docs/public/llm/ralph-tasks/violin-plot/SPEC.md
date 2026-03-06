# Violin Plot — Radix-Like Spec

## Status
planned

## Purpose
Use a violin plot to visualize the distribution shape of numerical data across categories, combining a density plot with box plot statistics. Ideal for comparing distributions, identifying multimodality, and understanding data spread beyond simple summary statistics.

## Data Shape
```typescript
type ViolinPlotData = {
  labels: string[];
  datasets: {
    legend: string;
    distributions: {
      value: number;
      density: number;
    }[][];  // one distribution per label
  }[];
};
```

## Headless Slots
| Slot | Args | Purpose |
|------|------|---------|
| layout | data, size | Root layout (plot, legend, title) |
| plot | labels, datasets, scales | Plot area container |
| dataView | datasets, scales | Scrollable/clipped data region |
| violin | datasetIndex, labelIndex, distribution | Container for one violin shape |
| densityPath | datasetIndex, labelIndex, side, path | One side of the mirrored density curve |
| median | datasetIndex, labelIndex, value | Median line/marker within violin |
| quartiles | datasetIndex, labelIndex, q1, q3 | Quartile box within violin |
| xAxis | labels, scale | Full x-axis composition |
| yAxis | scale | Full y-axis composition (value axis) |
| xAxisLabel | label, index | Individual x-axis category label |
| yAxisLabel | value, index | Individual y-axis value label |
| xAxisLine | — | X-axis baseline |
| yAxisLine | — | Y-axis baseline |
| grid | scales | Grid container |
| gridYLine | index | Horizontal grid line |
| legend | datasets, toggleSeries | Interactive legend |
| title | text | Chart title |

## Controller Methods
- `hoverViolin(datasetIndex, labelIndex)` — highlight a violin, show tooltip with stats
- `unhoverViolin()` — clear hover state
- `toggleSeries(legend)` — show/hide a dataset
- `setSize(width, height)` — update chart dimensions

## Style Presets
- toast: `violin: { colors: string[], opacity: number }, median: { color: string, width: number }, quartiles: { color: string, width: number }`, axes, grid, legend, title styling

## UX Patterns
- Hover tooltip: shows median, mean, Q1, Q3, min, max for the distribution
- Density mirroring: distribution is mirrored on both sides of the center axis
- Box plot overlay: optional quartile box and median line within the violin
- Legend filtering: toggle datasets to compare specific distributions
- Animation: violins grow from center line outward on mount
- Width scaling: violin widths can be normalized (same max width) or proportional to sample size

## Storybook Stories Required
- Basic
- Multi-series comparison
- With box plot overlay
- With statistics tooltip
- Custom slot override
- With tooltip interaction
