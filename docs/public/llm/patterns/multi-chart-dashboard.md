# Multi-Chart Dashboard Composition

Compose multiple charts in one screen when one chart family cannot carry the whole story.

Generated: 2026-04-08

## Use When

- The prompt asks for overview plus breakdown plus detail
- A single chart would overload encodings
- Different chart families answer different sub-questions

## Build Path

- Choose one dominant chart per question instead of forcing a combo chart.
- Use Column, Row, Expanded, Padding, and Stack to compose the dashboard.
- Share filters or selection state through ChangeNotifierProvider when linked interactions matter.

## Related Charts

- `bar-chart`
- `line-chart`
- `heatmap-chart`

## Source Paths

- `packages/core/src/component`
- `packages/core/src/provider`
- `shared/chart-presets/charts`
