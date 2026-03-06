# Heatmap Chart -- Ralph Validation Checklist

Use this checklist to verify that a heatmap chart implementation is complete and correct.

## Data
- [ ] Accepts `{ xLabels: string[], yLabels: string[], values: number[][] }` data shape
- [ ] `values[y][x]` indexing is correct -- rows are yLabels, columns are xLabels
- [ ] Scale auto-computes { min, max } from flattened values matrix
- [ ] Empty values array handled gracefully (min = max = 0)

## Slots
- [ ] `layout` receives title, legend (singular Widget, not array!), plot
- [ ] `plot` receives xAxis, yAxis, dataView, axisCorner
- [ ] `xAxis` receives line, labels[], tick
- [ ] `yAxis` receives line, labels[], tick
- [ ] `xAxisLabel` receives name, index
- [ ] `yAxisLabel` receives name, index
- [ ] `xAxisTick` receives no args
- [ ] `yAxisTick` receives no args
- [ ] `xAxisLine` receives no args
- [ ] `yAxisLine` receives no args
- [ ] `axisCorner` receives no args
- [ ] `dataView` receives segments[][] (2D array of widgets)
- [ ] `segment` receives value, xIndex, yIndex
- [ ] `legend` receives no args (renders color scale, not categorical)
- [ ] `title` receives no args

## Controller
- [ ] `setHovered({ value, xIndex, yIndex, xLabel, yLabel })` sets hover info
- [ ] `setHovered(null)` clears hover
- [ ] `hovered` returns current HeatmapHoverInfo or null
- [ ] `addHoverListener(fn)` registers callback for hover changes
- [ ] `removeHoverListener(fn)` unregisters callback
- [ ] Hover uses separate listener system (does NOT call notifyListeners)
- [ ] `scale` getter returns { min, max } computed from data
- [ ] `setSize(width, height)` updates dimensions

## Toast Style
- [ ] `heatmap.colorRange` is a 3-element tuple [low, mid, high] (default: ["#FDE68A", "#F97316", "#B91C1C"])
- [ ] Color interpolation uses 3-point gradient (low-mid-high)
- [ ] Midpoint is (min + max) / 2
- [ ] `heatmap.segment.gap` controls spacing between cells (default: 0)
- [ ] Legend renders as continuous color gradient bar (not checkboxes)
- [ ] Legend defaults to `position: "bottom"`
- [ ] Padding defaults to { top: 30, right: 20, bottom: 20, left: 60 }

## Layout
- [ ] X-axis labels align with columns
- [ ] Y-axis labels align with rows
- [ ] Data view renders as 2D grid
- [ ] axisCorner fills the intersection area of x-axis and y-axis
- [ ] Segment gap applied uniformly between cells

## UX
- [ ] Cell hover triggers setHovered with correct value, indices, and labels
- [ ] Tooltip appears on cell hover with cell information
- [ ] Tooltip uses 16-case smart positioning to avoid overflow
- [ ] Color scale legend shows gradient from min to max
- [ ] No series toggle (heatmap has no toggleable datasets)

## AG Style
- [ ] N/A -- heatmap chart is toast-only (no AG style)

## Edge Cases
- [ ] 1x1 matrix renders single cell
- [ ] Non-square matrix (e.g., 3x7) renders correctly
- [ ] All same values renders uniform color (midpoint of colorRange)
- [ ] Negative values handled correctly in color interpolation
- [ ] Large matrix (50x50) renders without performance issues
- [ ] values[y][x] ordering is NOT accidentally swapped to values[x][y]
