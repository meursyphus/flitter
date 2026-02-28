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

Every chart in `src/charts/{chart-name}/` follows this layout (bar-chart is the reference implementation):

```
src/charts/{chart-name}/
  index.ts              Public entry point (factory function widget)
  plugin.ts             Style registry (StyleConfig + StyleMap types)
  base/                 Structural defaults (wraps headless + non-visual parts)
    index.ts            BaseXxxChart() wrapper + type re-exports
    bar-group.ts        Layout logic (non-visual)
    series.ts, plot.ts  Structural composition
    grid.ts, ...        Other structural parts
    get-scale.ts        Default scale computation
  styles/
    toast/              "toast" style implementation
      config.ts         Style-specific config type + defaults
      index.ts          Exports toastStyleConfig (single StyleConfig object)
      parts/            Chart-specific visual part renderers only
        bar.ts, bar-box.ts, bar-group-box.ts, ...
```

### Three-Layer Flow

```
headless (pure logic, all custom Required)
  ↑
base/ (structural defaults pre-filled, style parts still Required)
  ↑
styles/toast/ (visual style parts filled in)
  ↑
index.ts (public API, merges user overrides)
```

### File Roles

**`index.ts`** - Public widget factory. Resolves style config from the registry, merges user overrides, and delegates to BaseXxxChart.

```typescript
// From bar-chart/index.ts
export default function BarChart<S extends keyof BarChartStyleMap>({
  style, config, data, custom, getScaleOptions, ...rest
}: { ... }): Widget {
  const sc = barChartStyleConfigs[style];
  return BaseBarChart({
    data,
    config: sc.createConfig(config),
    custom: { ...sc.custom, ...custom },
    getScaleOptions: getScaleOptions ?? sc.getScaleOptions,
    ...rest,
  });
}
```

**`base/index.ts`** - Wraps headless with structural (non-visual) defaults. Type re-exports replace the old `headless.ts`.

```typescript
// From bar-chart/base/index.ts
const baseDefaults: Partial<BarChartCustom> = {
  barGroup: BarGroup, barBox: BarBox, barGroupBox: BarGroupBox,
  series: Series, plot: Plot, dataLabel: DataLabel, grid: Grid,
};

export function BaseBarChart<TConfig>({ custom, getScale = defaultGetScale, ...rest }) {
  return HeadlessBarChart({
    ...rest, getScale,
    custom: { ...baseDefaults, ...custom } as BarChartCustom<TConfig>,
  });
}

export type { BarChartCustom, BarChartData, ... } from "@headless/bar-chart/types";
export { BarChartController } from "@headless/bar-chart/controller";
```

**`plugin.ts`** - Defines `StyleConfig<TConfig>` and the style map.

```typescript
// From bar-chart/plugin.ts
import type { BarChartCustom, GetScaleOptionsFn } from "./base";
import { toastStyleConfig, type ToastBarChartConfig } from "./styles/toast";
```

**`styles/toast/index.ts`** - Assembles the `toastStyleConfig` object.

```typescript
// From bar-chart/styles/toast/index.ts
const toastCustom: Partial<BarChartCustom<ToastBarChartConfig>> = {
  layout: toastLayout,
  bar: toastBar,
  barGroupBox: toastBarGroupBox,
  barBox: toastBarBox,
  legend: toastLegend,
  // ... all visual parts
};

export const toastStyleConfig: StyleConfig<ToastBarChartConfig> = {
  custom: toastCustom,
  createConfig: (config) => deepMerge(defaultToastConfig, config),
  getScaleOptions: toastGetScaleOptions,
};
```

**`styles/toast/config.ts`** - Extends `ToastBaseConfig` with chart-specific fields + defaults.

```typescript
// From bar-chart/styles/toast/config.ts
export type ToastBarChartConfig = ToastBaseConfig & {
  bar: { gap: number; cornerRadius: number };
};
```

### Headless Layer

Headless components (`src/headless/{chart}/`) are pure logic with **no defaults**. All `custom` slots and `getScale` are **required** — the base/ layer provides structural defaults, and styles/ provides visual defaults.

```typescript
// headless/bar-chart/index.ts
export default function BarChart<TConfig>(props: {
  custom: BarChartCustom<TConfig>;  // Required, not optional
  getScale: GetScaleFn;              // Required, not optional
  data: BarChartData;
  ...
}): Widget;
```

## Key Patterns

### Single `toastStyleConfig` Export

Each `styles/toast/index.ts` exports a single `toastStyleConfig` object (not individual custom/config/getScaleOptions). The plugin.ts consumes it directly:

```typescript
// plugin.ts
import { toastStyleConfig } from "./styles/toast";
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

Common visual parts (axis labels, ticks, lines, grid, legend, title, layout) are in `src/shared/toast/` and re-exported from `src/shared/toast/index.ts`. Chart-specific `styles/toast/parts/` files can either import and re-export these directly or wrap them with chart-specific logic.

### Stacked-bar-chart Reuses bar-chart Types

`stacked-bar-chart` imports `StyleConfig` and headless types from `bar-chart` rather than defining its own, since it shares the same `BarChartCustom` interface:

```typescript
// stacked-bar-chart/plugin.ts
import type { StyleConfig } from "../bar-chart/plugin";
```

## Special Case: Curried Custom Pattern (stacked-area-chart)

When a headless chart's `Custom` type has no `TConfig` generic (i.e., `StackedAreaChartCustom` instead of `BarChartCustom<TConfig>`), the config cannot be accessed via the custom function signature. In this case, `styles/toast/index.ts` uses a **currying pattern**: `createToastCustom(config)` returns the custom object with config captured in closure.

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

1. Create `{chart-name}/styles/{style-name}/` with `config.ts`, `index.ts`, and `parts/`.
2. Define your config type extending `ToastBaseConfig` (or your own base) in `config.ts`.
3. Implement part renderers in `parts/`, reusing `@shared/toast/` where possible.
4. Export a single `toastStyleConfig: StyleConfig<YourConfig>` from `index.ts`.
5. Add the style to the `StyleMap` in `plugin.ts`.
6. `index.ts` entry point needs no changes (generic over `StyleMap` keys).

## Available Charts

| Chart | Folder | Headless Source | Refactored? |
|-------|--------|-----------------|-------------|
| BarChart | `bar-chart/` | `@headless/bar-chart` | Done (base/ + styles/toast/) |
| StackedBarChart | `stacked-bar-chart/` | `@headless/bar-chart` (shared) | TODO |
| LineChart | `line-chart/` | `@headless/line-chart` | TODO |
| AreaChart | `area-chart/` | `@headless/line-chart` (shared) | TODO |
| ScatterChart | `scatter-chart/` | `@headless/scatter-chart` | TODO |
| BubbleChart | `bubble-chart/` | `@headless/bubble-chart` | TODO |
| StackedAreaChart | `stacked-area-chart/` | `@headless/stacked-area-chart` | TODO |

## TODO: Refactor Remaining Charts

Each chart listed as TODO above needs the same refactoring applied to bar-chart:

1. **Create `base/` folder** — Move structural (non-visual) default implementations from `headless/{chart}/default/` into `charts/{chart}/base/`. Create `base/index.ts` that wraps the headless component with structural defaults pre-filled and re-exports types.
2. **Move `toast/` → `styles/toast/`** — Move the toast style folder under `styles/` for clarity. Update import paths in `plugin.ts` and `charts/index.ts`.
3. **Delete `headless.ts`** — Replace with imports from `./base` in `index.ts` and `plugin.ts`.
4. **Update headless provider** — Remove `default/` folder from `headless/{chart}/`, make `custom` and `getScale` Required (not optional) in the headless layer.
5. **For stacked-bar-chart specifically** — Also move `stacked-bar-group.ts` and `stacked-get-scale.ts` into `base/`, create `BaseStackedBarChart` that wraps `BaseBarChart` with stacked defaults.

Reference: See `bar-chart/base/index.ts` for the pattern to follow.
