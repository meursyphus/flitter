# Slope Chart — Radix-Like Spec

## Status
planned

## Purpose
Use a slope chart to compare values between exactly two time points or categories, emphasizing the direction and magnitude of change. Ideal for before/after comparisons, ranking changes, and showing convergence/divergence patterns.

## Data Shape
```typescript
type SlopeChartData = {
  labels: [string, string]; // two time points/categories
  datasets: {
    name: string;
    values: [number, number]; // value at each point
  }[];
};
```

## Headless Slots
| Slot | Args | Purpose |
|------|------|---------|
| layout | data, size | Root layout (slopes, legend, title) |
| slope | datasets, scales | Container for all slope lines |
| slopeLine | dataset, index, startY, endY | Line connecting two points |
| startDot | dataset, index, value | Dot at the left point |
| endDot | dataset, index, value | Dot at the right point |
| startLabel | dataset, value | Label at the left point |
| endLabel | dataset, value | Label at the right point |
| columnLabel | label, columnIndex | Header label for each column |
| legend | datasets, toggleDataset | Interactive legend |
| title | text | Chart title |

## Controller Methods
- `hoverLine(datasetIndex)` — highlight a slope line, show tooltip
- `unhoverLine()` — clear hover state
- `toggleDataset(name)` — show/hide a dataset
- `setSize(width, height)` — update chart dimensions

## Style Presets
- toast: `line: { strokeWidth: number, colors: string[] }, dot: { radius: number }, label: { fontSize: number }`, legend, title styling

## UX Patterns
- Line hover: highlight a single slope line; dim all others; tooltip shows both values and change
- Rank change: lines that cross indicate rank reversals — visually prominent
- Color coding: each dataset gets a consistent color for line, dots, and labels
- Legend filtering: toggle datasets to reduce clutter
- Animation: lines animate from horizontal (same value) to final slope on mount
- Increase/decrease styling: optionally color lines green for increase, red for decrease

## Storybook Stories Required
- Basic
- Many datasets (rank changes)
- Color-coded increase/decrease
- With value labels
- Custom slot override
- With tooltip interaction
