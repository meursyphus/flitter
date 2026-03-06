# Heatmap Logic Reference

Use this file to hand-build matrix charts with `flitter-ui`.

## Intent

- two categorical axes
- intensity or magnitude in each cell
- weekday-by-month or similar matrix semantics

## Data shape to preserve

```ts
type HeatmapLikeData = {
  xLabels: string[];
  yLabels: string[];
  values: number[][];
};
```

Important:

- `values[y][x]`
- rows map to `yLabels`
- columns map to `xLabels`

## Direct-build recipe

1. Compute min and max from the matrix.
2. Build axes and label lanes separately from cells.
3. Render cells as a 2D grid of widgets or a `CustomPaint` matrix.
4. Map each value to color explicitly.
5. Keep the color legend outside the grid.

## Best reusable internal references

- `packages/chart/src/headless/heatmap-chart/types.ts`
- `packages/chart/src/charts/heatmap-chart/base/`
- `packages/chart/src/charts/heatmap-chart/styles/toast/index.ts`
- `docs/src/app/chart/_data/heatmap-chart/advanced.ts`

## What is worth reusing

- matrix orientation discipline
- cartesian axis placement
- legend placement pattern
