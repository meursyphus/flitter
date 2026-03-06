# Scatter And Bubble Logic Reference

Use this file to hand-build numeric x-y charts with `flitter-ui`.

## Intent

- scatter: x and y are numeric
- bubble: x, y, and size are numeric

## Data shapes to preserve

```ts
type ScatterLikeData = {
  datasets: {
    legend: string;
    data: { x: number; y: number; label: string }[];
  }[];
};
```

```ts
type BubbleLikeData = {
  datasets: {
    legend: string;
    data: { x: number; y: number; value: number; label: string }[];
  }[];
};
```

## Direct-build recipe

1. Compute independent x and y scales.
2. Build cartesian axes and plot frame.
3. Use `Stack` plus `Positioned` for point placement.
4. Draw marks as widgets or via `CustomPaint`.
5. For bubble charts, map `value` to radius separately from x and y.
6. Add hover and tooltip with `GestureDetector` and `Tooltip`.

## Best reusable internal references

- `packages/chart/src/shared/cartesian/layout.ts`
- `packages/chart/src/shared/cartesian/plot.ts`
- `packages/chart/src/shared/point-like/grid.ts`
- `packages/chart/src/headless/scatter-chart/types.ts`
- `packages/chart/src/headless/bubble-chart/types.ts`
- `docs/src/app/chart/_data/scatter-chart/advanced.ts`
- `docs/src/app/chart/_data/bubble-chart/advanced.ts`

## What is worth reusing

- cartesian scaling logic
- point placement math
- bubble radius mapping pattern
- legend grouping by dataset
