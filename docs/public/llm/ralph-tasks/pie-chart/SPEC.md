# Pie Chart — Radix-Like Spec

## Status
production

## Purpose
Use a pie chart to show proportional composition of a whole. Each slice represents a category's share of the total. Ideal for part-to-whole comparisons across a single categorical dimension. Set `innerRadiusRatio > 0` for donut mode.

## Data Shape
```typescript
type PieChartData = {
  datasets: { name: string; value: number }[];
};
```

No labels array -- each dataset entry is both the label and the value. No multi-series; there is exactly one ring of slices.

## Headless Slots
| Slot | Args | Purpose |
|------|------|---------|
| layout | title: Widget, legends: Widget[], dataView: Widget | Root layout (title, legend, data view) |
| dataView | slices: { widget, startAngle, sweepAngle, percentage, index, name, value }[] | Container for all slices; handles radial arrangement |
| slice | index, name, value, percentage, sweepAngle | Individual pie slice wedge |
| legend | name, index | Single legend item |
| title | -- | Chart title |

Total: 5 slots.

## Controller Methods
- `hoverSlice(index)` -- highlight a slice, show tooltip
- `unhoverSlice()` -- clear hover state
- `hoveredIndex` -- currently hovered slice index (number | null)
- `isSliceHovered(index)` -- check if a specific slice is hovered
- `toggleSeries(name)` -- show/hide a dataset by name
- `showSeries(name)` / `hideSeries(name)` / `showAllSeries()` -- explicit series visibility
- `isSeriesVisible(name)` -- check visibility
- `setSize(width, height)` -- update chart dimensions
- `data` (getter) -- returns filtered data (hidden series excluded)
- `legends` (getter) -- all dataset names (including hidden)

## Scale
No explicit scale. Headless computes each slice's percentage and sweep angle from the value relative to the visible total.

## Style Presets
- **toast** only (no AG style, no plugin.ts)

## Config
```typescript
type ToastPieChartConfig = ToastBaseConfig & {
  pie: {
    strokeColor: string;    // default: "white"
    strokeWidth: number;    // default: 2
    innerRadiusRatio: number; // default: 0 (0 = pie, >0 = donut)
  };
};
```

Default overrides from ToastBaseConfig:
- `legend.position`: "right-top"
- `padding`: { top: 20, right: 20, bottom: 20, left: 20 }

## Layout
- Stack + Transform.rotate for arranging slices radially
- Column/Row for title + legend placement around the data view
- `innerRadiusRatio` controls donut hole size (0 = full pie, 0.5 = half-radius hole)

## UX Patterns
- **Slice hover**: highlights the hovered slice (scale or opacity change) and shows tooltip with name, value, percentage
- **Legend filter**: clicking a legend item calls `toggleSeries` to hide/show slices; remaining slices re-proportion to fill the circle
- **Donut mode**: set `innerRadiusRatio > 0` for a donut chart; center area can host a label or summary widget
- **Click selection**: not implemented by default; can be added via custom slice slot
- **Animation**: slices animate sweep angles on mount and data change

## Storybook Stories Required
- Basic pie
- Donut (innerRadiusRatio > 0)
- With legend interaction
- Custom slice override
- With tooltip interaction
- Many categories (10+)
