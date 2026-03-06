# Radar Logic Reference

Use this file to hand-build profile charts on repeated axes with `flitter-ui`.

## Intent

- compare profiles over the same set of dimensions
- emphasize shape across shared labels

## Data shape to preserve

```ts
type RadarLikeData = {
  labels: string[];
  datasets: { legend: string; values: number[] }[];
};
```

## Direct-build recipe

1. Compute radial scale from the maximum value.
2. Convert each label to an angle.
3. Draw radial grid polygons or rings with `CustomPaint`.
4. Draw spokes, labels, and series polygons.
5. Keep legend and title outside the radial plot.

## Best reusable internal references

- `packages/chart/src/headless/radar-chart/types.ts`
- `packages/chart/src/charts/radar-chart/base/`
- `packages/chart/src/charts/radar-chart/styles/toast/`
- `docs/src/app/chart/_data/radar-chart/advanced.ts`

## What is worth reusing

- angle math
- normalized vertex calculation
- radial-axis and angular-axis split
