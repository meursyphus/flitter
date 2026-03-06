# Headless Architecture

Use this file when the agent needs to understand how Flitter charts are assembled, not just how to call them.

## Core mental model

Each chart is built from three layers:

1. headless logic
2. structural defaults
3. style preset renderers

That means the same chart factory can keep logic stable while swapping renderers and config presets.

## Actual pipeline

For a cartesian chart such as `BarChart`, the flow is:

1. `packages/chart/src/charts/bar-chart/index.ts`
   Accepts `style`, `data`, `config`, `custom`, `direction`, `getScale`, and `getScaleOptions`.

2. `packages/chart/src/charts/bar-chart/plugin.ts`
   Selects the style preset object from `barChartStyleConfigs`.

3. `packages/chart/src/charts/bar-chart/base/index.ts`
   Fills structural defaults such as `barGroup`, `barBox`, `dataView`, `plot`, and `grid`.

4. `packages/chart/src/headless/bar-chart/`
   Owns provider, controller, and chart tree.

5. `packages/chart/src/charts/bar-chart/styles/*/index.ts`
   Injects preset-specific `custom` renderers and `createConfig`.

## What headless really does

The headless layer is where the chart becomes a widget tree driven by state and context.

Example path:

- `packages/chart/src/headless/bar-chart/chart.ts`
- `packages/chart/src/headless/bar-chart/controller.ts`
- `packages/chart/src/headless/bar-chart/provider.ts`

The controller is responsible for things like:

- filtered data based on legend visibility
- chart size
- scale calculation
- hover state
- direction

The chart tree then calls `ctx.custom.*` at each insertion point.

## Why `custom` works

Because the headless chart calls `ctx.custom.layout`, `ctx.custom.plot`, `ctx.custom.bar`, `ctx.custom.legend`, and so on, the preset layer or the caller can replace those pieces without rewriting chart logic.

This is the real extension surface.

## Three levers

### Lever 1: `config`

Use when:

- you want the preset look with different numbers or colors
- you only need preset-supported knobs

Examples:

- title alignment
- legend position
- bar corner radius
- bubble min and max radius

### Lever 2: `custom`

Use when:

- you need to replace how a slot renders
- you want to inject a different widget at a known insertion point

Examples:

- custom `bar`
- custom `slice`
- custom `segment`
- custom `legend`

### Lever 3: `getScale` or `getScaleOptions`

Use when:

- the visual change depends on different scale logic
- tick density or scale semantics need to change

Examples:

- denser or looser tick generation
- alternative scale rules for a derived chart

## Structural defaults vs preset renderers

`BaseBarChart` does not fully define the final look.
It defines structural defaults.

Then the preset adds visual parts such as:

- `toastBar`
- `agBar`
- `toastLegend`
- `agLegend`
- cartesian axis and grid renderers

So the correct question is not just "which chart?"
It is also:

- which structural base?
- which preset?
- which slots need overriding?

## Where to inspect advanced slot lists

The docs app already encodes chart-specific advanced slot metadata in:

- `docs/src/app/chart/_data/bar-chart/advanced.ts`
- `docs/src/app/chart/_data/line-chart/advanced.ts`
- `docs/src/app/chart/_data/area-chart/advanced.ts`
- `docs/src/app/chart/_data/stacked-bar-chart/advanced.ts`
- `docs/src/app/chart/_data/stacked-area-chart/advanced.ts`
- `docs/src/app/chart/_data/scatter-chart/advanced.ts`
- `docs/src/app/chart/_data/bubble-chart/advanced.ts`
- `docs/src/app/chart/_data/pie-chart/advanced.ts`
- `docs/src/app/chart/_data/radar-chart/advanced.ts`
- `docs/src/app/chart/_data/heatmap-chart/advanced.ts`

Use those files when you need the exact slot names and argument shapes quickly.
