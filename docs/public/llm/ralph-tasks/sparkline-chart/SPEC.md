# Sparkline Chart — Radix-Like Spec

## Status
planned

## Purpose
Use a sparkline for compact, inline data visualization without axes or labels. Ideal for embedding in tables, dashboards, or text to show trends, patterns, and relative changes at a glance.

## Data Shape
```typescript
type SparklineChartData = {
  values: number[];
};
```

## Headless Slots
| Slot | Args | Purpose |
|------|------|---------|
| sparkline | data, size | Root container for the sparkline |
| line | values, scale | The rendered line/area/bar path |
| highlightPoint | value, index, type | Highlighted point (last, min, max) |
| tooltip | value, index | Hover tooltip content |

## Controller Methods
- `hoverPoint(index)` — highlight a data point, show tooltip
- `unhoverPoint()` — clear hover state
- `setSize(width, height)` — update chart dimensions
- `setVariant(variant)` — switch between line, area, bar

## Style Presets
- toast: `line: { color: string, strokeWidth: number }, area: { fillOpacity: number }, highlight: { color: string, radius: number }` styling

## UX Patterns
- Hover tooltip: shows value at the hovered position; lightweight overlay
- Highlight points: last value, min, and max can be highlighted with colored dots
- Variant modes: line (default), area (filled below line), bar (mini bar chart)
- No axes: sparklines intentionally omit axes for compactness
- Animation: line draws from left to right on mount
- Responsive: scales to fill container width

## Storybook Stories Required
- Basic line
- Area variant
- Bar variant
- With highlight points
- Custom slot override
- Inline in text/table context
