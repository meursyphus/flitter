# Marimekko Chart — Radix-Like Spec

## Status
planned

## Purpose
Use a Marimekko (Mekko) chart to show data across two categorical dimensions where both the width and height of segments encode values. Ideal for market share analysis, portfolio composition, and any scenario where both category size and internal composition matter.

## Data Shape
```typescript
type MarimekkoChartData = {
  categories: {
    name: string;
    width: number; // determines column width proportion
    segments: {
      name: string;
      value: number;
    }[];
  }[];
};
```

## Headless Slots
| Slot | Args | Purpose |
|------|------|---------|
| layout | data, size | Root layout (plot, legend, title) |
| plot | categories, scales | Plot area container |
| dataView | categories, scales | Scrollable/clipped data region |
| column | categoryIndex, category, x, width | Variable-width column |
| segment | categoryIndex, segmentIndex, value, height | Segment within a column |
| segmentLabel | categoryIndex, segmentIndex, value, percentage | Text label on a segment |
| xLabel | category, x, width | Category label below column |
| yLabel | value, index | Y-axis percentage label |
| yAxisLine | — | Y-axis baseline |
| grid | scales | Grid container |
| gridYLine | index, percentage | Horizontal percentage grid line |
| legend | segmentNames, toggleSegment | Interactive legend for segment types |
| title | text | Chart title |

## Controller Methods
- `hoverSegment(categoryIndex, segmentIndex)` — highlight a segment, show tooltip
- `unhoverSegment()` — clear hover state
- `toggleSegment(name)` — show/hide a segment type across all columns
- `setSize(width, height)` — update chart dimensions

## Style Presets
- toast: `segment: { colors: string[], gap: number }, column: { gap: number }`, grid, legend, title styling

## UX Patterns
- Hover tooltip: shows segment name, value, percentage within column, and percentage of total
- Variable width: column widths proportional to category width values
- Percentage stacking: segments within each column sum to 100% height
- Legend filtering: toggling a segment type removes it from all columns and rescales
- Animation: columns grow from left; segments stack from bottom
- Edge labels: percentage labels on y-axis; category labels with widths on x-axis

## Storybook Stories Required
- Basic
- Many categories
- With segment labels
- With percentage display
- Custom slot override
- With tooltip interaction
