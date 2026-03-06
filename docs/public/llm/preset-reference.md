# Preset Reference

Use this file when the agent needs to read the actual preset code instead of only the public API.

## Global preset roots

### Toast

- `packages/chart/src/styles/toast/index.ts`
- `packages/chart/src/styles/toast/cartesian/config.ts`

### AG

- `packages/chart/src/styles/ag/index.ts`
- `packages/chart/src/styles/ag/cartesian/config.ts`

These files define the shared preset-level primitives, defaults, and scale-option helpers.

## How to read a preset

For a chart preset, inspect files in this order:

1. chart preset entry `styles/<preset>/index.ts`
2. chart preset config `styles/<preset>/config.ts`
3. chart preset parts in `styles/<preset>/parts/`
4. shared preset helpers in `packages/chart/src/styles/<preset>/`

That reading order shows:

- which slots are overridden
- how config is merged
- which shared preset helpers are reused

## Cartesian chart preset references

### Bar chart

- `packages/chart/src/charts/bar-chart/styles/toast/index.ts`
- `packages/chart/src/charts/bar-chart/styles/toast/config.ts`
- `packages/chart/src/charts/bar-chart/styles/toast/parts/`
- `packages/chart/src/charts/bar-chart/styles/ag/index.ts`
- `packages/chart/src/charts/bar-chart/styles/ag/config.ts`
- `packages/chart/src/charts/bar-chart/styles/ag/parts/`

### Stacked bar chart

- `packages/chart/src/charts/stacked-bar-chart/styles/toast/index.ts`
- `packages/chart/src/charts/stacked-bar-chart/styles/toast/config.ts`
- `packages/chart/src/charts/stacked-bar-chart/styles/toast/parts/`
- `packages/chart/src/charts/stacked-bar-chart/styles/ag/index.ts`
- `packages/chart/src/charts/stacked-bar-chart/styles/ag/config.ts`
- `packages/chart/src/charts/stacked-bar-chart/styles/ag/parts/`

### Line chart

- `packages/chart/src/charts/line-chart/styles/toast/index.ts`
- `packages/chart/src/charts/line-chart/styles/toast/config.ts`
- `packages/chart/src/charts/line-chart/styles/toast/parts/`
- `packages/chart/src/charts/line-chart/styles/ag/index.ts`
- `packages/chart/src/charts/line-chart/styles/ag/config.ts`
- `packages/chart/src/charts/line-chart/styles/ag/parts/`

### Area chart

- `packages/chart/src/charts/area-chart/styles/toast/index.ts`
- `packages/chart/src/charts/area-chart/styles/toast/config.ts`
- `packages/chart/src/charts/area-chart/styles/toast/parts/`
- `packages/chart/src/charts/area-chart/styles/ag/index.ts`
- `packages/chart/src/charts/area-chart/styles/ag/config.ts`
- `packages/chart/src/charts/area-chart/styles/ag/parts/`

### Stacked area chart

- `packages/chart/src/charts/stacked-area-chart/styles/toast/index.ts`
- `packages/chart/src/charts/stacked-area-chart/styles/toast/config.ts`
- `packages/chart/src/charts/stacked-area-chart/styles/toast/parts/`
- `packages/chart/src/charts/stacked-area-chart/styles/ag/index.ts`
- `packages/chart/src/charts/stacked-area-chart/styles/ag/config.ts`
- `packages/chart/src/charts/stacked-area-chart/styles/ag/parts/`

### Scatter chart

- `packages/chart/src/charts/scatter-chart/styles/toast/index.ts`
- `packages/chart/src/charts/scatter-chart/styles/toast/config.ts`
- `packages/chart/src/charts/scatter-chart/styles/toast/parts/`
- `packages/chart/src/charts/scatter-chart/styles/ag/index.ts`
- `packages/chart/src/charts/scatter-chart/styles/ag/config.ts`
- `packages/chart/src/charts/scatter-chart/styles/ag/parts/`

### Bubble chart

- `packages/chart/src/charts/bubble-chart/styles/toast/index.ts`
- `packages/chart/src/charts/bubble-chart/styles/toast/config.ts`
- `packages/chart/src/charts/bubble-chart/styles/toast/parts/`
- `packages/chart/src/charts/bubble-chart/styles/ag/index.ts`
- `packages/chart/src/charts/bubble-chart/styles/ag/config.ts`
- `packages/chart/src/charts/bubble-chart/styles/ag/parts/`

## Toast-only chart preset references

### Pie chart

- `packages/chart/src/charts/pie-chart/styles/toast/index.ts`
- `packages/chart/src/charts/pie-chart/styles/toast/config.ts`
- `packages/chart/src/charts/pie-chart/styles/toast/parts/`

### Radar chart

- `packages/chart/src/charts/radar-chart/styles/toast/index.ts`
- `packages/chart/src/charts/radar-chart/styles/toast/config.ts`
- `packages/chart/src/charts/radar-chart/styles/toast/parts/`

### Heatmap chart

- `packages/chart/src/charts/heatmap-chart/styles/toast/index.ts`
- `packages/chart/src/charts/heatmap-chart/styles/toast/config.ts`
- `packages/chart/src/charts/heatmap-chart/styles/toast/parts/`

## What the preset entry usually tells you

A preset `index.ts` usually reveals:

- the `custom` slot overrides
- the `createConfig` merge path
- preset-specific scale option helpers
- direction-aware axis behavior for cartesian charts

That file is the best first stop when the agent needs to understand how the preset is actually assembled.
