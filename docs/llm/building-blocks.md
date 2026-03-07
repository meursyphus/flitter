# Building Blocks

## `shared/cartesian`

Location: `packages/chart/src/shared/cartesian/`

Use this for any chart that has axes or grid.

Main exports:

- `Layout`
- `Plot`
- `XAxis`
- `YAxis`
- `XAxisLabel`
- `YAxisLabel`
- `XAxisTick`
- `YAxisTick`
- `XAxisLine`
- `YAxisLine`
- `Grid`
- `GridXLine`
- `GridYLine`
- `AxisCorner`
- `DataLabel`
- `getScale`

Typical usage:

```ts
const baseDefaults = {
  plot: (...args) => Cartesian.Plot(args[0]),
  xAxis: (...args) => Cartesian.XAxis(args[0], { type: "label" }),
  yAxis: (...args) => Cartesian.YAxis(args[0], { type: "value" }),
  grid: Grid,
};
```

## `shared/bar-like`

Location: `packages/chart/src/shared/bar-like/`

Use this for:

- bar chart
- stacked bar chart
- histogram
- waterfall
- box plot style grouping

Main exports:

- `BarBox`
- `DataView`
- `Grid`

## `shared/line-like`

Location: `packages/chart/src/shared/line-like/`

Use this for:

- line chart
- area chart
- stacked area chart
- combo chart overlays

Main exports:

- `DataView`
- `Grid`

## `shared/point-like`

Location: `packages/chart/src/shared/point-like/`

Use this for:

- scatter chart
- bubble chart

Main export:

- `Grid`

## `shared/utils`

Location: `packages/chart/src/shared/utils/`

Exports:

- scale helpers from `scale.ts`
- spline helper from `draw-spline-line.ts`
- `interpolateColor`, `interpolateColorStops`
- `degToRad`, `radToDeg`
- `polarToCartesian`, `cartesianToPolar`

Examples:

```ts
const scale = refineScale({ min: 0, max: 187, step: 18.7 });
const color = interpolateColor("#00a9ff", "#ff5a46", 0.65);
const point = polarToCartesian(120, 120, 80, degToRad(-90));
```
