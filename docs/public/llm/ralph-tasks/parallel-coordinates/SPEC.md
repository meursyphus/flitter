# Parallel Coordinates — Radix-Like Spec

## Status
planned

## Purpose
Use parallel coordinates to compare multi-dimensional data by plotting each dimension as a vertical axis and connecting each data item's values with polylines. Ideal for exploring relationships, clusters, and outliers across many variables simultaneously.

## Data Shape
```typescript
type ParallelCoordinatesData = {
  axes: {
    name: string;
    min?: number;
    max?: number;
  }[];
  items: {
    values: number[];
    label?: string;
    group?: string;
  }[];
};
```

## Headless Slots
| Slot | Args | Purpose |
|------|------|---------|
| layout | data, size | Root layout (plot, legend, title) |
| plot | axes, items, scales | Plot area containing axes and lines |
| axis | axisIndex, name, scale | Individual vertical axis |
| axisLabel | name, index | Label at top of each axis |
| axisTick | axisIndex, value, position | Tick mark on an axis |
| line | item, itemIndex, points | Polyline connecting values across axes |
| brush | axisIndex, range | Brush selection indicator on an axis |
| brushHandle | axisIndex, position | Draggable handle for brush range |
| legend | groups, toggleGroup | Interactive legend for groups |
| title | text | Chart title |

## Controller Methods
- `hoverLine(itemIndex)` — highlight a line, show tooltip with all values
- `unhoverLine()` — clear hover state
- `brushAxis(axisIndex, range)` — filter items by range on an axis
- `clearBrush(axisIndex)` — clear brush on an axis
- `toggleGroup(group)` — show/hide a group
- `setSize(width, height)` — update chart dimensions

## Style Presets
- toast: `line: { strokeWidth: number, opacity: number, colors: string[] }, axis: { color: string }, brush: { color: string }`, legend, title styling

## UX Patterns
- Line hover: hovering a line highlights it and dims all others; tooltip shows all dimension values
- Axis brushing: click-drag on an axis to select a range; only items within range on that axis are highlighted
- Multi-brush: brushes can be active on multiple axes simultaneously for cross-filtering
- Group coloring: items in the same group share a color
- Legend filtering: toggle groups on/off via legend
- Animation: lines draw from left to right on mount
- Axis reordering: drag axis labels to reorder axes (future)

## Storybook Stories Required
- Basic
- Grouped data
- With axis brushing
- Multi-brush filtering
- Custom slot override
- With tooltip interaction
- Large dataset
