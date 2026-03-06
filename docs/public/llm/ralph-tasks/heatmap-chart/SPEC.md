# Heatmap Chart -- Radix-Like Spec

## Status
production

## Purpose
Use a heatmap chart to visualize magnitude across two categorical dimensions as colored cells in a matrix. Ideal for correlation matrices, time-based activity grids (weekday x hour), and any data with two categorical axes and a continuous intensity value.

## Data Shape
```typescript
type HeatmapData = {
  xLabels: string[];
  yLabels: string[];
  // IMPORTANT: values[y][x] -- rows map to yLabels, columns map to xLabels
  values: number[][];
};

type HeatmapScale = {
  min: number;
  max: number;
};
```

`values` is indexed as `values[yIndex][xIndex]`. This is a common source of bugs -- row index comes first.

## Headless Slots
| Slot | Args | Purpose |
|------|------|---------|
| layout | title: Widget, legend: Widget (singular!), plot: Widget | Root layout (title, color legend, plot) |
| plot | xAxis: Widget, yAxis: Widget, dataView: Widget, axisCorner: Widget | Plot area with axes and grid |
| xAxis | line: Widget, labels: Widget[], tick: Widget | X-axis composition |
| yAxis | line: Widget, labels: Widget[], tick: Widget | Y-axis composition |
| xAxisLabel | name: string, index: number | Individual x-axis label |
| yAxisLabel | name: string, index: number | Individual y-axis label |
| xAxisTick | -- | X-axis tick mark |
| yAxisTick | -- | Y-axis tick mark |
| xAxisLine | -- | X-axis baseline |
| yAxisLine | -- | Y-axis baseline |
| axisCorner | -- | Corner fill between axes |
| dataView | segments: Widget[][] | 2D grid of cell widgets |
| segment | value: number, xIndex: number, yIndex: number | Individual cell |
| legend | -- | Color scale legend (continuous gradient, not categorical) |
| title | -- | Chart title |

Total: 13 slots (note: some axis slots take no args).

## Controller Methods
- `setHovered({ value, xIndex, yIndex, xLabel, yLabel })` -- set hovered cell info
- `setHovered(null)` -- clear hover
- `hovered` -- current HeatmapHoverInfo or null
- `addHoverListener(fn)` -- register hover change callback (separate from main notifyListeners)
- `removeHoverListener(fn)` -- unregister hover callback
- `scale` -- computed { min, max } from data matrix
- `setSize(width, height)` -- update chart dimensions
- `data` (getter/setter) -- raw HeatmapData

Note: Heatmap uses a **separate hover listener system** to avoid full tree rebuilds on cell hover. Hover events fire via `#hoverListeners`, not `notifyListeners()`.

## Scale
Auto-computed `{ min, max }` from the flat values matrix. No `step` -- the scale is continuous for color interpolation.

## Style Presets
- **toast** only (no AG style, no plugin.ts)

## Config
```typescript
type ToastHeatmapChartConfig = ToastBaseConfig & {
  heatmap: {
    colorRange: [string, string, string]; // default: ["#FDE68A", "#F97316", "#B91C1C"]
    segment: { gap: number };              // default: 0
  };
};
```

Default overrides from ToastBaseConfig:
- `legend.position`: "bottom"
- `padding`: { top: 30, right: 20, bottom: 20, left: 60 }

## Color Interpolation
3-point gradient mapped to `[min, midpoint, max]`:
- `colorRange[0]` = low value color (default: yellow "#FDE68A")
- `colorRange[1]` = mid value color (default: orange "#F97316")
- `colorRange[2]` = high value color (default: red "#B91C1C")

Midpoint is `(min + max) / 2`. Values below midpoint interpolate between colors 0-1; values above interpolate between colors 1-2.

## Layout
- Cartesian-style axes (x-axis on bottom, y-axis on left) but no grid lines
- Data view is a 2D grid of segment widgets
- `segment.gap` controls spacing between cells
- Legend is a continuous color gradient bar (not categorical checkboxes)
- axisCorner fills the empty square at axis intersection

## UX Patterns
- **Cell hover**: `setHovered` provides value, indices, and labels; tooltip appears with 16-case smart positioning based on cell location relative to chart center
- **Color scale legend**: continuous gradient bar showing the min-to-max color mapping
- **Tooltip positioning**: follows cursor and flips to avoid overflow; uses the same 16-case positioning logic as bar chart
- **No legend filtering**: heatmap has no toggleable series -- legend shows color scale only
- **No click selection**: not implemented by default

## Storybook Stories Required
- Basic heatmap
- Custom color range
- With cell gap
- With tooltip interaction
- Large matrix (20x20)
- Custom segment override
