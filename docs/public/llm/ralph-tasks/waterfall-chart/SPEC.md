# Waterfall Chart — Spec

## Status
headless-only

## Purpose
Use a waterfall chart to show how an initial value is affected by a series of positive and negative changes. Ideal for financial statements, budget analysis, and cumulative effect visualization where intermediate totals matter.

## Data Shape
```typescript
type WaterfallChartData = {
  labels: string[];
  values: number[];
  totalIndices?: number[];
  title?: string;
};

type WaterfallChartScale = {
  min: number;
  max: number;
  step: number;
};
```

## Headless Slots
| Slot | Args | Purpose |
|------|------|---------|
| layout | `{ title, legends, plot }` | Root layout composing title, legends, and plot area |
| plot | `{ xAxis, yAxis, dataView, grid, axisCorner }` | Plot area container with axes and data |
| dataView | `{ bars, connectors }` | Data region containing bars and connector lines |
| bar | `{ value, cumulative, index, label, type }` | Individual waterfall bar (increase/decrease/total) |
| connector | `{ fromCumulative, toCumulative, index }` | Dashed line connecting consecutive bars |
| xAxis | `{ line, labels, tick }` | Full x-axis composition |
| yAxis | `{ line, labels, tick }` | Full y-axis composition |
| xAxisLabel | `{ name, index }` | Individual x-axis category label |
| yAxisLabel | `{ name, index }` | Individual y-axis value label |
| xAxisTick | -- | X-axis tick mark |
| yAxisTick | -- | Y-axis tick mark |
| xAxisLine | -- | X-axis baseline |
| yAxisLine | -- | Y-axis baseline |
| grid | `{ xLine, yLine }` | Grid container |
| gridXLine | -- | Vertical grid line |
| gridYLine | -- | Horizontal grid line |
| axisCorner | -- | Corner fill between axes |
| legend | `{ name, index }` | Legend item (3 fixed: Increase, Decrease, Total) |
| title | `{ name }` | Chart title |
| dataLabel | `{ value, label, type }` | Value label on/near bar |

**Total: 22 slots** (including bar, connector, dataLabel as chart-specific)

## Controller Methods
- `hoverBar(index)` -- highlight a bar, show tooltip with cumulative value
- `unhoverBar()` -- clear hover state
- `setSize(width, height)` -- update chart dimensions
- `cumulativeValues` -- computed cumulative sums array

## Style Presets Needed
- **toast**: colors for increase (green), decrease (red), total (gray); connector line style (dashed, color, thickness); bar gap; axes, grid, legend, title styling; dataLabel formatting

## UX Patterns
- Bars float: increase bars start from the previous cumulative, decrease bars drop down from it, total bars start from zero
- Connector lines: dashed horizontal lines connect the top of one bar to the start of the next
- Color convention: increase=green, decrease=red, total=gray (configurable)
- 3 fixed legend items: Increase, Decrease, Total (not dataset-driven)
- Hover tooltip shows the bar value and the running cumulative total
- Animation: bars grow from their baseline position

## Storybook Stories Required
- Basic (revenue waterfall)
- With total indices
- Custom colors
- With data labels
- Hover interaction
- Negative-heavy dataset
