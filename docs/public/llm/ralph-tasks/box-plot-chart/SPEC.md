# Box Plot Chart — Spec

## Status
headless-only

## Purpose
Use a box plot chart to display the distribution of numerical data through quartiles, highlighting median, spread, and outliers. Ideal for statistical analysis, comparing distributions across categories, and identifying data anomalies.

## Data Shape
```typescript
type BoxPlotChartData = {
  labels: string[];
  datasets: {
    legend: string;
    data: BoxPlotDataPoint[];
  }[];
};

type BoxPlotDataPoint = {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers?: number[];
};

type BoxPlotChartScale = {
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
| dataView | `{ boxPlotGroups }` | Data region containing all box plot groups |
| boxPlotGroup | `{ boxPlots, index, label, dataPoints }` | Groups box plots for one category |
| boxPlot | `{ dataPoint, index, legend, label }` | Individual box plot (whiskers + box + median line) |
| outlier | `{ value, index, legend, label }` | Individual outlier point |
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
| legend | `{ name, index }` | Interactive legend item per dataset |
| title | `{ name }` | Chart title |

**Total: 18 slots** (cartesian base + boxPlotGroup, boxPlot, outlier)

## Controller Methods
- `hoverBoxPlot(datasetIndex, groupIndex)` -- highlight a box plot, show stats tooltip
- `unhoverBoxPlot()` -- clear hover state
- `toggleSeries(legend)` -- show/hide a dataset
- `setSize(width, height)` -- update chart dimensions

## Style Presets Needed
- **toast**: box fill color and opacity; median line (color, thickness); whisker line (color, thickness, cap width); outlier marker (shape, size, color); box width and gap; axes, grid, legend, title styling; hover effect (border highlight)

## UX Patterns
- Box anatomy: lower whisker (min), box bottom (Q1), median line, box top (Q3), upper whisker (max)
- Multi-dataset: multiple box plots side-by-side within each category group
- Outlier rendering: points drawn beyond whiskers, optionally with different marker style
- Hover tooltip: shows all five summary statistics (min, Q1, median, Q3, max) plus outlier count
- Legend filtering: hiding a dataset removes its box plots and recalculates group spacing
- Animation: box plots grow from median outward on mount

## Storybook Stories Required
- Basic (single dataset)
- Multi-dataset comparison
- With outliers
- Hover interaction (stats tooltip)
- Legend filtering
- Dense categories (10+)
