# Pie Logic Reference

Use this file to hand-build single-snapshot share charts with `flitter-ui`.

## Intent

- one categorical breakdown
- one total
- optional donut hole

## Data shape to preserve

```ts
type PieLikeData = {
  datasets: { name: string; value: number }[];
};
```

## Direct-build recipe

1. Convert raw values to percentages and sweep angles.
2. Build title and legend around a central radial plot.
3. Draw slices with `CustomPaint` or equivalent radial widgets.
4. If a donut is needed, leave an inner radius hole.
5. Use legend and tooltip as separate widgets, not as implicit chart API behavior.

## Best reusable internal references

- `packages/chart/src/headless/pie-chart/types.ts`
- `packages/chart/src/charts/pie-chart/styles/toast/index.ts`
- `docs/src/app/chart/_data/pie-chart/advanced.ts`

## What is worth reusing

- slice angle math
- title and legend placement ideas
- marker shape choices
