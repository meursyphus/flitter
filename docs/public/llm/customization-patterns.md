# Customization Patterns

Use this file to decide how deeply the agent should customize a chart.

## Rule of thumb

- If the preset already supports it, use `config`.
- If the render shape needs to change, use `custom`.
- If the scale or chart logic needs to change, use `getScale` or `getScaleOptions`.

## Pattern 1: Preset tweak via `config`

Use this first.

```ts
BarChart({
  style: "toast",
  data,
  config: {
    title: { text: "Revenue", position: "top", alignment: "center" },
    legend: { visible: true, position: "bottom", gap: 12 },
    bar: { gap: 1, cornerRadius: 6 },
  },
});
```

Good for:

- color changes
- typography
- legend placement
- title placement
- chart-specific knobs such as `line.spline`, `pie.innerRadiusRatio`, or `heatmap.segment.gap`

## Pattern 2: Slot override via `custom`

Use this when the preset shape is close but not enough.

```ts
BarChart({
  style: "toast",
  data,
  custom: {
    bar: (args, context) => {
      // args: { value, label, legend, index }
      // context: controller plus config
      // return any Flitter Widget
    },
  },
});
```

Good for:

- replacing a specific rendered part
- custom legend items
- custom slice or segment shapes
- special bar or point visuals

## Pattern 3: Logic override via `getScale` or `getScaleOptions`

Use this only when presentation changes depend on scale behavior.

```ts
BarChart({
  style: "ag",
  data,
  getScaleOptions: (ctx) => ({
    roughStepCount: Math.floor(ctx.height / 60),
  }),
});
```

Good for:

- tick density tuning
- alternative scale behavior
- derived chart logic that still fits the same headless structure

## Chart-specific slot families

### Bar and stacked bar

Representative slots:

- `layout`
- `plot`
- `barGroup`
- `barBox`
- `bar`
- `dataLabel`
- axes and grid slots

### Line, area, stacked area

Representative slots:

- `layout`
- `plot`
- `line` or area-rendering slot
- `dataView`
- axes and grid slots

### Scatter

Representative slots:

- `scatter`
- `dataView`
- axes and grid slots

### Bubble

Representative slots:

- `bubble`
- `dataView`
- axes and grid slots

### Pie

Representative slots:

- `layout`
- `dataView`
- `slice`
- `legend`
- `title`

### Radar

Representative slots:

- `layout`
- `plot`
- `angularAxis`
- `radialAxis`
- `radar`
- `legend`
- `title`

### Heatmap

Representative slots:

- `layout`
- `plot`
- `dataView`
- `segment`
- `legend`
- axes slots

## Fast decision matrix

| Need | Reach for |
| --- | --- |
| move title or legend | `config` |
| change preset colors or radius | `config` |
| make a donut instead of pie | `config` |
| replace how bars, slices, bubbles, or heatmap cells render | `custom` |
| change scale density or scale math | `getScaleOptions` or `getScale` |
| rewrite overall chart semantics | different chart family, not just `custom` |
