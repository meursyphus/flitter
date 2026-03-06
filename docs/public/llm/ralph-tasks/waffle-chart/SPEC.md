# Waffle Chart — Radix-Like Spec

## Status
planned

## Purpose
Use a waffle chart to show proportional data as a grid of cells, where each cell represents a unit of the whole. Ideal for showing percentages, survey results, and part-to-whole relationships in a more engaging way than pie charts.

## Data Shape
```typescript
type WaffleChartData = {
  categories: {
    name: string;
    value: number;
    color?: string;
  }[];
};
```

## Headless Slots
| Slot | Args | Purpose |
|------|------|---------|
| layout | data, size | Root layout (grid, legend, title) |
| grid | cells, rows, cols | Grid container arranging cells |
| cell | categoryIndex, cellIndex, row, col | Individual grid cell |
| cellLabel | category, percentage | Label showing category percentage |
| legend | categories, toggleCategory | Interactive legend |
| label | category, percentage | Category label with value |
| title | text | Chart title |

## Controller Methods
- `hoverCategory(categoryIndex)` — highlight all cells of a category
- `unhoverCategory()` — clear hover state
- `toggleCategory(name)` — show/hide a category
- `setSize(width, height)` — update chart dimensions
- `setGridSize(rows, cols)` — set grid dimensions (default 10x10)

## Style Presets
- toast: `cell: { size: number, gap: number, cornerRadius: number, colors: string[] }`, legend, title styling

## UX Patterns
- Hover highlight: hovering a category in legend or grid highlights all cells of that category
- Percentage display: tooltip shows category name and exact percentage
- Grid sizing: default 10x10 (100 cells = 100%) but configurable
- Legend filtering: clicking legend item toggles category visibility
- Animation: cells fill in sequentially on mount (wave animation)
- Color mapping: each category gets a distinct color, unfilled cells are neutral

## Storybook Stories Required
- Basic
- Multi-category
- Custom grid size
- With labels
- Custom slot override
- With tooltip interaction
