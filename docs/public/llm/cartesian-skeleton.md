# Cartesian Skeleton

Use this file when building any bar, line, area, scatter, or bubble chart directly with `flitter-ui`.

## Core skeleton

A cartesian chart usually has four visible regions:

1. title / header
2. legend
3. axis lanes
4. plot fill

The plot fill usually contains:

- grid
- data marks
- optional overlays such as hover state or labels

## Recommended composition

### Outer structure

- `Column`
  - title
  - plot area
  - legend

### Plot structure

- `DockLayout`
  - left: y-axis labels
  - bottom: x-axis labels
  - fill: `Stack(grid, dataView, overlays...)`

This is very close to the internal chart-package structure and is a strong default.

## Manual direct-build reference

- `dev/storybook/src/stories/Charts/ManualCartesianBar.stories.tsx`

Read that file first when you need a fresh hand-built cartesian base.

## Internal extraction candidates

These are the chart-package files most worth reading or partially extracting:

- `packages/chart/src/shared/cartesian/layout.ts`
- `packages/chart/src/shared/cartesian/plot.ts`
- `packages/chart/src/shared/cartesian/getScale.ts`
- `packages/chart/src/shared/cartesian/grid.ts`
- `packages/chart/src/shared/cartesian/x-axis.ts`
- `packages/chart/src/shared/cartesian/y-axis.ts`
- `packages/chart/src/shared/utils/scale.ts`

## What to copy as ideas

- `DockLayout` plot composition
- axis lane separation
- `Stack` layering of grid and marks
- snapped scale generation
- label-vs-value axis distinction

## What to keep open-ended

- color system
- typography
- tooltip look
- animation strategy
- exact mark rendering
