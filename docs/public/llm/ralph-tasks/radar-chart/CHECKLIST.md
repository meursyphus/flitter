# Radar Chart -- Ralph Validation Checklist

Use this checklist to verify that a radar chart implementation is complete and correct.

## Data
- [ ] Accepts `{ labels: string[], datasets: { legend: string; values: number[] }[] }` data shape
- [ ] Hidden series are excluded from visible data via controller filtering
- [ ] Scale recalculates when series are toggled (via getScale callback)
- [ ] `values` array length matches `labels` array length

## Slots
- [ ] `layout` receives title, legends[], plot and composes them
- [ ] `plot` receives angularAxis, radialAxis, dataView and stacks them
- [ ] `angularAxis` receives line (spokes) and labels[]
- [ ] `angularAxisLine` receives axisCount
- [ ] `angularAxisLabel` receives index, label, angle, nx, ny
- [ ] `radialAxis` receives line (grid rings) and labels[]
- [ ] `radialAxisLine` receives levels, axisCount
- [ ] `radialAxisLabel` receives value, index
- [ ] `dataView` receives radars[]
- [ ] `radar` receives legend, index, vertices[] (each with nx, ny, angle, ratio, value, label, index)
- [ ] `legend` receives name, index
- [ ] `title` receives no args

## Controller
- [ ] `hoverRadar(index, legend)` sets hover state and triggers rebuild
- [ ] `unhoverRadar()` clears hover state
- [ ] `hoveredRadar` returns { index, legend } or null
- [ ] `isRadarHovered(index, legend)` returns correct hover state
- [ ] `toggleSeries(legend)` hides/shows a dataset and recalculates scale
- [ ] `isSeriesVisible(legend)` returns correct visibility state
- [ ] `scale` getter returns computed { min, max, step }

## Toast Style
- [ ] `radar.fillOpacity` controls polygon fill transparency (default: 0.3)
- [ ] `radar.strokeWidth` controls polygon outline width (default: 2)
- [ ] `radar.gridColor` applies to concentric grid polygons (default: "rgba(0, 0, 0, 0.1)")
- [ ] `radar.gridWidth` controls grid line thickness (default: 1)
- [ ] `radar.axisColor` applies to spoke lines (default: "rgba(0, 0, 0, 0.1)")
- [ ] `radar.axisWidth` controls spoke line thickness (default: 1)
- [ ] `radar.labelMargin` adds spacing around plot for axis labels (default: 24)
- [ ] Colors cycle from `config.colors` array
- [ ] Legend defaults to `position: "right-top"`

## Coordinate System
- [ ] Top of chart is angle 0 / -PI/2 radians
- [ ] Angles increase clockwise
- [ ] Normalized positions: nx/ny range 0..1, center = (0.5, 0.5)
- [ ] `ratio` = value / scale.max, correctly clamped to 0..1

## Layout
- [ ] Concentric polygons rendered for radial grid
- [ ] Number of polygon sides matches number of labels
- [ ] Spokes extend from center to each label position
- [ ] Labels positioned outside outermost ring with labelMargin offset
- [ ] Padding applied from config (default: 20 all sides)

## UX
- [ ] Hovered radar polygon visually highlights (opacity, stroke, or both)
- [ ] Legend click toggles series visibility
- [ ] Scale updates when series are toggled
- [ ] Multiple overlapping polygons render with correct z-order
- [ ] Polygons animate on mount and data change

## AG Style
- [ ] N/A -- radar chart is toast-only (no AG style)

## Edge Cases
- [ ] Single dataset renders one polygon correctly
- [ ] All series hidden renders empty plot with grid still visible
- [ ] 3 labels (minimum polygon) renders correctly
- [ ] Large number of labels (12+) renders without overlap issues
- [ ] Zero values place vertex at center
