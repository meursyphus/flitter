# Bar And Stacked Bar Logic Reference

Use this file to hand-build bar-like charts with `flitter-ui` while studying `packages/chart` for structure.

## Intent

Use bar-like charts when:

- categories are the main dimension
- comparison is more important than continuous trend
- ranking or contribution is the message

Use stacked bars when:

- each category is composed of multiple parts
- part-to-whole inside each category matters

## Data shape to preserve

```ts
type BarLikeData = {
  labels: string[];
  datasets: { legend: string; values: number[] }[];
};
```

## Direct-build recipe

1. Compute scale from all visible values.
2. Build outer layout with `Column` and `Row`.
3. Reserve one axis lane for labels.
4. Build the plot with `Stack`:
   - grid behind
   - bar data view above
5. For grouped bars, use `Flex` and `Flexible` across categories.
6. For each bar, use `FractionallySizedBox` or `AnimatedFractionallySizedBox`.
7. Add labels, tooltip, or hover with `Text`, `GestureDetector`, and `Tooltip`.

## Best reusable internal references

### Cartesian skeleton

- `packages/chart/src/shared/cartesian/layout.ts`
- `packages/chart/src/shared/cartesian/plot.ts`
- `packages/chart/src/shared/cartesian/getScale.ts`
- `packages/chart/src/shared/utils/scale.ts`

### Bar-specific structure

- `packages/chart/src/shared/bar-like/data-view.ts`
- `packages/chart/src/shared/bar-like/bar-box.ts`
- `packages/chart/src/charts/bar-chart/base/bar-group.ts`

### Headless slot boundaries

- `packages/chart/src/headless/bar-chart/types.ts`
- `packages/chart/src/headless/bar-chart/chart.ts`
- `docs/src/app/chart/_data/bar-chart/advanced.ts`
- `docs/src/app/chart/_data/stacked-bar-chart/advanced.ts`

## What is worth reusing

- cartesian layout ideas
- scale refinement logic
- grouped-vs-stacked composition patterns
- slot names and argument shapes

## What should stay flexible

- colors
- typography
- tooltip design
- exact legend rendering
- whether the final chart is animated
