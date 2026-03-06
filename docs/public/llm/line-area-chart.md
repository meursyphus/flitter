# Line, Area, And Stacked Area Logic Reference

Use this file to hand-build continuous cartesian trend charts with `flitter-ui`.

## Intent

- `LineChart` logic: trend and precise change
- `AreaChart` logic: trend plus filled magnitude
- `StackedAreaChart` logic: share or composition over time

## Data shape to preserve

```ts
type LineLikeData = {
  labels: string[];
  datasets: { legend: string; values: number[] }[];
};
```

## Direct-build recipe

1. Compute x positions from ordered labels.
2. Compute y scale from visible values.
3. Build cartesian outer layout from `Column` and `Row`.
4. Use `Stack` for the plot so multiple series can overlay.
5. Draw series with `CustomPaint`.
6. For spline logic, study `draw-spline-line.ts`.
7. For stacked area, accumulate previous series before drawing the next filled path.

## Best reusable internal references

- `packages/chart/src/shared/cartesian/layout.ts`
- `packages/chart/src/shared/cartesian/plot.ts`
- `packages/chart/src/shared/cartesian/getScale.ts`
- `packages/chart/src/shared/line-like/data-view.ts`
- `packages/chart/src/shared/utils/draw-spline-line.ts`
- `packages/chart/src/headless/line-chart/types.ts`
- `docs/src/app/chart/_data/line-chart/advanced.ts`
- `docs/src/app/chart/_data/area-chart/advanced.ts`
- `docs/src/app/chart/_data/stacked-area-chart/advanced.ts`

## What is worth reusing

- overlay pattern from `Stack + Positioned.fill`
- spline path logic
- cartesian axis and grid layout
- stacked accumulation idea
