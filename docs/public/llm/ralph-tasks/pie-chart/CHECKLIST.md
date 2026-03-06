# Pie Chart -- Ralph Validation Checklist

Use this checklist to verify that a pie chart implementation is complete and correct.

## Data
- [ ] Accepts `{ datasets: { name: string; value: number }[] }` data shape
- [ ] Hidden series are excluded from visible data via controller filtering
- [ ] Percentages recompute correctly when series are toggled

## Slots
- [ ] `layout` receives title, legends[], dataView and composes them
- [ ] `dataView` receives slices[] with widget, startAngle, sweepAngle, percentage, index, name, value
- [ ] `slice` receives index, name, value, percentage, sweepAngle
- [ ] `legend` receives name, index
- [ ] `title` receives no args

## Controller
- [ ] `hoverSlice(index)` sets hoveredIndex and triggers rebuild
- [ ] `unhoverSlice()` clears hover state
- [ ] `hoveredIndex` returns current hovered slice index or null
- [ ] `toggleSeries(name)` hides/shows a dataset
- [ ] `isSeriesVisible(name)` returns correct visibility state

## Toast Style
- [ ] `pie.strokeColor` applies white border between slices (default: "white")
- [ ] `pie.strokeWidth` controls border thickness (default: 2)
- [ ] `pie.innerRadiusRatio` = 0 renders full pie
- [ ] `pie.innerRadiusRatio` > 0 renders donut with correct hole size
- [ ] Colors cycle from `config.colors` array
- [ ] Legend defaults to `position: "right-top"`

## Layout
- [ ] Slices arranged radially using Stack + Transform.rotate
- [ ] Title and legend positioned around data view
- [ ] Padding applied from config (default: 20 all sides)

## UX
- [ ] Hovered slice visually highlights (scale, opacity, or offset)
- [ ] Tooltip appears on slice hover with name, value, percentage
- [ ] Legend click toggles slice visibility
- [ ] Hidden slices cause remaining slices to re-proportion to 100%
- [ ] Slices animate sweep angles on mount and data change

## AG Style
- [ ] N/A -- pie chart is toast-only (no AG style)

## Edge Cases
- [ ] Single dataset entry renders full circle
- [ ] All series hidden renders empty state gracefully
- [ ] Very small slices (< 1%) remain visible or collapse cleanly
- [ ] Zero-value entries are handled without errors
