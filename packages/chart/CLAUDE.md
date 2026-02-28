# @flitter/chart

A styled chart library built on top of Flitter. It provides ready-to-use chart widgets (BarChart, LineChart, etc.) with pluggable visual styles (currently: "toast"). Each chart is a thin styling layer over a headless chart component that handles layout, scales, and data binding.

## Architecture

Three layers, from bottom to top:

```
src/headless/       Headless chart components (layout, scales, controllers)
                    Pure logic, no visual styling. Each chart defines a
                    Custom type with slots for every visual part.

src/shared/toast/   Shared "toast" style parts (axis, grid, legend, title, layout)
                    Reusable across all chart types.

src/charts/         Styled chart entry points. Each chart folder wires a
                    headless component to one or more style implementations.
```

## Chart Folder Structure

Every chart in `src/charts/{chart-name}/` follows this layout:

```
src/charts/{chart-name}/
  index.ts          Public entry point (factory function widget)
  plugin.ts         Style registry (StyleConfig + StyleMap types)
  headless.ts       Re-exports from @headless/{chart-name}
  toast/            "toast" style implementation
    config.ts       Style-specific config type + defaults
    index.ts        Exports toastStyleConfig (single StyleConfig object)
    parts/          Individual visual part renderers
      layout.ts
      {data-part}.ts   Chart-specific data part (bar, line, area, bubble, etc.)
      legend.ts, title.ts, axis-corner.ts
      x-axis.ts, y-axis.ts
      x-axis-label.ts, y-axis-label.ts
      x-axis-tick.ts, y-axis-tick.ts
      x-axis-line.ts, y-axis-line.ts
      grid-x-line.ts, grid-y-line.ts
```

### File Roles

**`index.ts`** - Public widget factory. Resolves style config from the registry, merges user overrides, and delegates to the headless component.

```typescript
// From bar-chart/index.ts
export default function BarChart<S extends keyof BarChartStyleMap>({
  style, config, data, custom, getScaleOptions, ...rest
}: { ... }): Widget {
  const sc = barChartStyleConfigs[style];
  return HeadlessBarChart({
    data,
    config: sc.createConfig(config),
    custom: { ...sc.custom, ...custom },
    getScaleOptions: getScaleOptions ?? sc.getScaleOptions,
    ...rest,
  });
}
```

**`plugin.ts`** - Defines `StyleConfig<TConfig>` and the style map. Each style entry is a `StyleConfig` object.

```typescript
// From bar-chart/plugin.ts
export type StyleConfig<TConfig> = {
  custom: Partial<BarChartCustom<TConfig>>;
  createConfig: (config?: Partial<TConfig>) => TConfig;
  getScaleOptions: GetScaleOptionsFn;
};

export type BarChartStyleMap = {
  toast: ToastBarChartConfig;
};

export const barChartStyleConfigs: {
  [S in keyof BarChartStyleMap]: StyleConfig<BarChartStyleMap[S]>
} = {
  toast: toastStyleConfig,
};
```

**`headless.ts`** - Re-exports the headless component, types, and controller.

```typescript
// From bar-chart/headless.ts
export { default as HeadlessBarChart } from "@headless/bar-chart";
export type { BarChartCustom, BarChartData, ... } from "@headless/bar-chart/types";
export { BarChartController } from "@headless/bar-chart/controller";
```

**`toast/index.ts`** - Assembles the `toastStyleConfig` object. Imports all part renderers and wires them into the custom object.

```typescript
// From bar-chart/toast/index.ts
const toastCustom: Partial<BarChartCustom<ToastBarChartConfig>> = {
  layout: toastLayout,
  bar: toastBar,
  barGroupBox: toastBarGroupBox,
  barBox: toastBarBox,
  legend: toastLegend,
  // ... all parts
};

const toastGetScaleOptions: GetScaleOptionsFn = (ctx) =>
  toastScaleOptions(ctx.direction === "vertical" ? ctx.height : ctx.width);

export const toastStyleConfig: StyleConfig<ToastBarChartConfig> = {
  custom: toastCustom,
  createConfig: (config) => deepMerge(defaultToastConfig, config),
  getScaleOptions: toastGetScaleOptions,
};
```

**`toast/config.ts`** - Extends `ToastBaseConfig` with chart-specific fields + defaults.

```typescript
// From bar-chart/toast/config.ts
export type ToastBarChartConfig = ToastBaseConfig & {
  bar: { gap: number; cornerRadius: number };
};

export const defaultToastConfig: ToastBarChartConfig = {
  colors: TOAST_COLORS,
  font: { family: "Noto Sans JP", size: 11 },
  // ... base config fields
  bar: { gap: 1, cornerRadius: 0 },
  animation: { enabled: true, duration: 300, staggerDelay: 60 },
};
```

## Key Patterns

### Single `toastStyleConfig` Export

Each `toast/index.ts` exports a single `toastStyleConfig` object (not individual custom/config/getScaleOptions). The plugin.ts consumes it directly:

```typescript
// plugin.ts
import { toastStyleConfig } from "./toast";
export const barChartStyleConfigs = { toast: toastStyleConfig };
```

### `toastScaleOptions` Shared Utility

Scale options computation is shared via `@shared/toast`:

```typescript
import { toastScaleOptions } from "@shared/toast";
// Uses axis length to calculate roughStepCount based on DEFAULT_TICK_SPACING (80px)
const toastGetScaleOptions: GetScaleOptionsFn = (ctx) =>
  toastScaleOptions(ctx.direction === "vertical" ? ctx.height : ctx.width);
```

### `deepMerge` for Config

Always use `deepMerge` (from `@utils/index`) instead of spread when merging configs. It preserves nested objects:

```typescript
createConfig: (config) => deepMerge(defaultToastConfig, config),
```

### Shared Toast Parts

Common visual parts (axis labels, ticks, lines, grid, legend, title, layout) are in `src/shared/toast/` and re-exported from `src/shared/toast/index.ts`. Chart-specific `toast/parts/` files can either import and re-export these directly or wrap them with chart-specific logic.

### Stacked-bar-chart Reuses bar-chart Types

`stacked-bar-chart` imports `StyleConfig` and headless types from `bar-chart` rather than defining its own, since it shares the same `BarChartCustom` interface:

```typescript
// stacked-bar-chart/plugin.ts
import type { StyleConfig } from "../bar-chart/plugin";
```

## Special Case: Curried Custom Pattern (stacked-area-chart)

When a headless chart's `Custom` type has no `TConfig` generic (i.e., `StackedAreaChartCustom` instead of `BarChartCustom<TConfig>`), the config cannot be accessed via the custom function signature. In this case, `toast/index.ts` uses a **currying pattern**: `createToastCustom(config)` returns the custom object with config captured in closure.

```typescript
// stacked-area-chart/toast/index.ts
const createToastCustom = (
  config: ToastStackedAreaChartConfig,
): Partial<StackedAreaChartCustom> => ({
  layout: createToastLayout(config),
  area: createToastArea(config),
  // ... all parts are factory functions taking config
});

export const toastStyleConfig: StyleConfig<ToastStackedAreaChartConfig> = {
  custom: createToastCustom,  // function, not object
  createConfig: (config) => deepMerge(defaultToastConfig, config),
};
```

This changes the `StyleConfig` type in the plugin -- `custom` becomes a function:

```typescript
// stacked-area-chart/plugin.ts
export type StyleConfig<TConfig> = {
  custom: (config: TConfig) => Partial<StackedAreaChartCustom>;  // function, not object
  createConfig: (config?: Partial<TConfig>) => TConfig;
};
```

And the entry point calls it differently:

```typescript
// stacked-area-chart/index.ts
const resolvedConfig = sc.createConfig(config);
return HeadlessStackedAreaChart({
  data,
  custom: { ...sc.custom(resolvedConfig), ...custom },  // call custom as function
  ...rest,
});
```

## How to Add a New Style

1. Create `{chart-name}/toast/` (or your style name) with `config.ts`, `index.ts`, and `parts/`.
2. Define your config type extending `ToastBaseConfig` (or your own base) in `config.ts`.
3. Implement part renderers in `parts/`, reusing `@shared/toast/` where possible.
4. Export a single `toastStyleConfig: StyleConfig<YourConfig>` from `index.ts`.
5. Add the style to the `StyleMap` in `plugin.ts`.
6. `index.ts` entry point needs no changes (generic over `StyleMap` keys).

## Available Charts

| Chart | Folder | Headless Source |
|-------|--------|-----------------|
| BarChart | `bar-chart/` | `@headless/bar-chart` |
| StackedBarChart | `stacked-bar-chart/` | `@headless/bar-chart` (shared) |
| LineChart | `line-chart/` | `@headless/line-chart` |
| AreaChart | `area-chart/` | `@headless/line-chart` (shared) |
| ScatterChart | `scatter-chart/` | `@headless/scatter-chart` |
| BubbleChart | `bubble-chart/` | `@headless/bubble-chart` |
| StackedAreaChart | `stacked-area-chart/` | `@headless/stacked-area-chart` |
