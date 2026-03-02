# CLAUDE.md — packages/chart

## Overview

Flitter Chart is a declarative charting library built on top of `flitter-core`. It provides 9 production chart types with a plugin-based multi-style system (toast, ag). The architecture strictly separates business logic (headless), reusable visuals (shared), themed styling (styles), and user-facing API (charts).

## Directory Structure

```
src/
├── index.ts                          # Public exports
├── charts/                           # User-facing chart API
│   ├── index.ts
│   ├── bar-chart/
│   │   ├── index.ts                  # BarChart() factory function
│   │   ├── plugin.ts                 # StyleMap & styleConfigs (toast/ag)
│   │   ├── base/
│   │   │   ├── index.ts              # BaseBarChart - structural defaults
│   │   │   └── bar-group.ts          # BarGroup render logic
│   │   └── styles/
│   │       ├── toast/
│   │       │   ├── index.ts          # toastStyleConfig (custom + createConfig + getScaleOptions)
│   │       │   ├── config.ts         # ToastBarChartConfig = ToastBaseConfig + bar-specific
│   │       │   └── parts/            # bar.ts, bar-box.ts, series.ts
│   │       └── ag/                   # Same structure for AG style
│   ├── line-chart/                   # Same pattern
│   ├── stacked-bar-chart/
│   ├── area-chart/
│   ├── stacked-area-chart/
│   ├── scatter-chart/
│   ├── bubble-chart/
│   ├── pie-chart/                    # Simpler: no plugin.ts, toast-only
│   └── radar-chart/                  # Simpler: no plugin.ts, toast-only
│
├── headless/                         # Pure logic layer (no visuals)
│   ├── index.ts
│   ├── bar-chart/
│   │   ├── index.ts                  # HeadlessBarChart entry
│   │   ├── provider.ts              # BarChartProvider (ChangeNotifierProvider)
│   │   ├── chart.ts                 # Component tree: SizeTracker→Layout→Plot→Series
│   │   ├── controller.ts            # BarChartController (state, scale, filtering)
│   │   └── types.ts                 # BarChartCustom, BarChartData, BarChartContext
│   ├── line-chart/                   # Same 5-file pattern
│   ├── pie-chart/
│   ├── radar-chart/
│   ├── scatter-chart/
│   ├── bubble-chart/
│   └── _todo/                        # 8 future charts (box-plot, candlestick, etc.)
│
├── shared/                           # Style-agnostic reusable components
│   ├── cartesian/                    # Base axis/grid components
│   │   ├── types.ts                  # CartesianContext, CartesianCustom
│   │   ├── x-axis.ts, y-axis.ts     # Axis composition (line + ticks + labels)
│   │   ├── x-axis-label.ts          # Text widget with hardcoded defaults
│   │   ├── x-axis-tick.ts           # Container with hardcoded defaults
│   │   ├── x-axis-line.ts, y-axis-line.ts
│   │   ├── grid.ts, grid-x-line.ts, grid-y-line.ts
│   │   ├── layout.ts, plot.ts
│   │   ├── data-label.ts
│   │   ├── legend.ts, title.ts
│   │   ├── axis-corner.ts
│   │   └── getScale.ts              # Scale calculation
│   ├── bar-like/                     # BarBox, Series, Grid for bar-type charts
│   ├── line-like/                    # Series, Grid for line-type charts
│   ├── point-like/                   # Grid for scatter/bubble charts
│   └── utils/
│       ├── scale.ts                  # Scale calculation algorithms
│       └── draw-spline-line.ts       # Spline interpolation
│
└── styles/                           # Global style themes
    ├── toast/                        # Default lightweight theme
    │   ├── index.ts
    │   ├── config.ts                 # defaultToastBaseConfig
    │   ├── cartesian/                # Toast-wrapped cartesian components
    │   │   ├── config.ts             # ToastBaseConfig type definition
    │   │   ├── axis-label.ts         # toastXAxisLabel, toastYAxisLabel
    │   │   ├── axis-tick.ts          # toastXAxisTick, toastYAxisTick
    │   │   ├── axis-line.ts          # toastXAxisLine, toastYAxisLine
    │   │   ├── grid-line.ts          # toastGridXLine, toastGridYLine
    │   │   ├── x-axis.ts, y-axis.ts  # Animated axis wrappers
    │   │   ├── layout.ts
    │   │   └── animated-series.ts
    │   ├── legend.ts, title.ts, tooltip.ts, checkbox.ts
    │   └── utils/colors.ts
    └── ag/                           # Alternative advanced theme (same structure)
```

## Path Aliases (tsconfig.json)

```
@shared/*   → src/shared/*
@styles/*   → src/styles/*
@utils/*    → src/shared/utils/*
@headless/* → src/headless/*
```

Always use these aliases in imports, never relative paths across layers.

## Architecture: Data Flow Pipeline

```
BarChart({ style: "toast", data, config })        ← charts/ (user API)
  ↓ selects barChartStyleConfigs["toast"]
  ↓ createConfig() merges defaults with user config
BaseBarChart({ custom: { ...baseDefaults, ...toastCustom } })  ← charts/*/base/
  ↓
HeadlessBarChart({ custom, data, getScale })       ← headless/
  ↓
BarChartProvider (ChangeNotifierProvider)           ← headless/*/provider.ts
  ↓ BarChartController computes scale, manages state
Chart component tree                                ← headless/*/chart.ts
  ↓ calls custom.layout(), custom.plot(), custom.series(), etc.
Toast renderers apply config styling                ← styles/toast/ + charts/*/styles/toast/parts/
  ↓ extract config values → pass to shared/cartesian components
shared/cartesian base widgets render                ← shared/cartesian/
```

## Key Types & Interfaces

### BarChartCustom (19 customization points)

```typescript
type BarChartCustom<TConfig = {}> = {
  // Structure
  layout, plot, series, barGroup, barBox, bar, dataLabel,
  // Axes
  xAxis, yAxis, xAxisLabel, yAxisLabel, xAxisTick, yAxisTick, xAxisLine, yAxisLine,
  // Decorations
  grid, gridXLine, gridYLine, axisCorner, legend, title,
};
// Each is: (args: T, context: BarChartContext<TConfig>) => Widget
```

### StyleConfig

```typescript
type StyleConfig<TConfig> = {
  custom: Partial<BarChartCustom<TConfig>>;
  createConfig: (config?: Partial<TConfig>, direction?) => TConfig;
  getScaleOptions: GetScaleOptionsFn;
};
```

### ToastBaseConfig (shared across all toast charts)

```typescript
type ToastBaseConfig = {
  colors: string[];
  font: { family, size };
  title: { text, visible, color, fontSize, fontWeight, position, alignment };
  legend: { visible, position, gap };
  axis: { color, thickness, label: { color, fontSize, gap, format }, tick: { size } };
  grid: { color, thickness };
  padding: { top, right, bottom, left };
  animation: { enabled, duration, staggerDelay };
  tooltip: { enabled, backgroundColor, textColor, borderRadius, padding };
};
```

Each chart extends this with chart-specific fields (e.g., `ToastBarChartConfig` adds `bar: { gap, cornerRadius }`).

### BarChartContext (provided via ChangeNotifierProvider)

```typescript
type BarChartContext<TConfig> = BarChartController & { config: TConfig };
// Controller provides: data, legends, direction, width, height, scale, custom
// Methods: toggleSeries(), isSeriesVisible(), hideSeries()
```

## Chart Categories

### Cartesian Charts (multi-style: toast + ag)

bar-chart, stacked-bar-chart, line-chart, area-chart, stacked-area-chart, scatter-chart, bubble-chart

- Have `plugin.ts` with `StyleMap` and `styleConfigs`
- Use `shared/cartesian/` for axes
- Use `shared/bar-like/`, `line-like/`, `point-like/` for chart-specific shared components
- Support vertical/horizontal `direction`

### Polar Charts (toast-only)

pie-chart, radar-chart

- No `plugin.ts`, no AG style
- Custom layout logic in `base/`
- Don't use cartesian shared components

### TODO Charts (`headless/_todo/`)

box-plot, candlestick, funnel, gauge, heatmap, sankey, sunburst, waterfall

- Have headless implementations but not wired to styled layer

## Patterns & Conventions

### Adding a New Chart

1. Create `headless/{chart}/` with: index.ts, provider.ts, chart.ts, controller.ts, types.ts
2. Create `charts/{chart}/base/` with structural defaults
3. Create `charts/{chart}/styles/toast/` with: index.ts (toastStyleConfig), config.ts, parts/
4. Create `charts/{chart}/plugin.ts` with StyleMap (cartesian only)
5. Create `charts/{chart}/index.ts` factory function
6. Export from `charts/index.ts` and `src/index.ts`

### Adding a New Style

1. Create `styles/{style}/` mirroring toast structure
2. Create `charts/{chart}/styles/{style}/` with config + parts
3. Add to chart's `plugin.ts` StyleMap

### Custom Parts Pattern

Toast parts extract config from context and delegate to shared components:

```typescript
// charts/bar-chart/styles/toast/parts/bar.ts
export function toastBar(args, context: BarChartContext<ToastBarChartConfig>) {
  const { colors, bar } = context.config;
  const color = colors[context.legends.indexOf(args.legend) % colors.length];
  return new _HoverableBar({ color, borderRadius: bar.cornerRadius, ... });
}
```

### State Management

- Uses Flutter-style `StatefulWidget` + `State` class — NOT React hooks
- State in class properties, mutated inside `setState()`
- Controller extends `ChangeNotifier` for reactive updates
- Provider via `ChangeNotifierProvider` / `Provider.of(context)`

### Animation

- Controlled by `config.animation.enabled`, `config.animation.duration`
- Toast wraps axes in `_AnimatedXAxis` / `_AnimatedYAxis` StatefulWidgets
- Uses `AnimationController` + `Tween` + `CurvedAnimation`
- Bar height animated via `AnimatedFractionallySizedBox`

### Interaction

- `GestureDetector` for click/hover (onClick, onMouseEnter, onMouseLeave)
- Legend toggles via `controller.toggleSeries()`
- Tooltip positioning: 16-case dispatcher (direction × sign × alignment)
- Tooltips use `ZIndex(zIndex: 9999)` for layering

## Build

- Built with Vite + `vite-plugin-dts`
- External dep: `flitter-core`
- Uses `vite-tsconfig-paths` for alias resolution

## Common Mistakes

- Importing across layers with relative paths instead of `@shared/`, `@styles/`, etc.
- Exporting classes directly instead of factory functions
- Using React hooks instead of StatefulWidget state pattern
- Forgetting to add new charts to `charts/index.ts` and `src/index.ts`
- Modifying headless layer for visual concerns (keep it pure logic)
