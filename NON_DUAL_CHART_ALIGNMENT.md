# Non-Dual Chart Alignment

Goal:

- keep the existing dual-style charts as the reference standard
- rebuild every non-dual chart to follow the same overall product model
- move each non-dual chart toward dual-style parity where it is honest to do so

Reference standard:

- see [CHART_STYLE_UX_COMMONS.md](./CHART_STYLE_UX_COMMONS.md)
- gold-standard dual charts:
  - `BarChart`
  - `StackedBarChart`
  - `LineChart`
  - `AreaChart`
  - `StackedAreaChart`
  - `ScatterChart`
  - `BubbleChart`

## Dual UX Contract To Reuse

Use the dual charts as the canonical contract.

### Shared contract

- [ ] same shell model: title, legend, plot, padding, layout
- [ ] same series identity rules: color by legend order, toggle by legend name
- [ ] same tooltip rule: hover a semantic datum, show a tooltip near that datum
- [ ] same storybook rule: if both styles exist, show both styles clearly
- [ ] same regression rule: screenshot review before calling it done

### AG contract

- [ ] uses `_styles/ag`
- [ ] low-motion by default
- [ ] tooltip transition is the main motion cue
- [ ] hover favors comparison / dimming / analytic readout
- [ ] legend behavior is active and consistent

### Toast contract

- [ ] uses `_styles/toast`
- [ ] local hover feels lifted
- [ ] tooltip is anchored near the hovered geometry
- [ ] mount/update animation exists where it helps readability
- [ ] legend uses the shared Toast design language

## Scope

Non-dual charts:

- `BoxPlotChart`
- `CandlestickChart`
- `ComboChart`
- `DonutChart`
- `FunnelChart`
- `GanttChart`
- `GaugeChart`
- `HeatmapChart`
- `HistogramChart`
- `NetworkChart`
- `PieChart`
- `PolarAreaChart`
- `ProgressChart`
- `RadarChart`
- `SankeyChart`
- `SunburstChart`
- `TreemapChart`
- `WaterfallChart`

## Inventory Snapshot

### Toast-only today

- `PieChart`
- `RadarChart`
- `HeatmapChart`

Immediate implication:

- [ ] AG variants are missing
- [ ] storybook only exposes Toast
- [ ] these need to be checked against the AG UX contract if we want true dual-style parity

### AG-only today

- `BoxPlotChart`
- `CandlestickChart`
- `ComboChart`
- `DonutChart`
- `FunnelChart`
- `GanttChart`
- `GaugeChart`
- `HistogramChart`
- `NetworkChart`
- `PolarAreaChart`
- `ProgressChart`
- `SankeyChart`
- `SunburstChart`
- `TreemapChart`
- `WaterfallChart`

Immediate implication:

- [ ] Toast variants are missing
- [ ] storybook only exposes Ag
- [ ] these need to be checked against the Toast UX contract if we want true dual-style parity

## Working Rule

For these 18 charts:

- do not accept “it renders” as done
- do not accept “one style exists” as done if the chart honestly belongs in both styles
- do not add new chart families until these are normalized against the dual reference set

## Browser Audit Loop

This is the required loop for each chart below.

- [ ] open storybook
- [ ] inspect current chart behavior in browser
- [ ] compare against the dual reference standard
- [ ] identify what is missing
  - shell/layout
  - legend behavior
  - tooltip behavior
  - hover behavior
  - motion
  - annotation/readability
- [ ] implement or refactor
- [ ] re-open and re-check
- [ ] capture screenshot
- [ ] mark pass/fail

## Chart Backlog

Use the same checklist shape for each chart.
Do not mark any UX checkbox complete until browser review and screenshot review also pass.

### BoxPlotChart

Current:

- preset styles: `Ag`
- storybook styles: `Ag`

Immediate gap:

- [ ] add Toast implementation
- [ ] add Toast storybook coverage
- [ ] confirm AG implementation actually matches the dual UX contract instead of only existing

Checklist:

- [ ] AG shell / legend / tooltip / hover audited
- [ ] Toast implementation added
- [ ] Toast hover / tooltip / animation model designed
- [ ] `Styles` parity story added
- [ ] screenshot reviewed

### CandlestickChart

Current:

- preset styles: `Ag`
- storybook styles: `Ag`

Immediate gap:

- [ ] add Toast implementation
- [ ] design Toast hover treatment for candle body/wick
- [ ] decide tooltip payload and motion model

Checklist:

- [ ] AG audited against dual UX contract
- [ ] Toast implementation added
- [ ] Toast storybook added
- [ ] `Styles` parity story added
- [ ] screenshot reviewed

### ComboChart

Current:

- preset styles: `Ag`
- storybook styles: `Ag`

Immediate gap:

- [ ] add Toast implementation
- [ ] define Toast rules for mixed-series hover, legend, and tooltip ownership

Checklist:

- [ ] AG audited
- [ ] Toast implementation added
- [ ] combined tooltip / hover model is coherent
- [ ] `Styles` parity story added
- [ ] screenshot reviewed

### DonutChart

Current:

- preset styles: `Ag`-named neutral export, but implementation is pie-style Toast-derived
- storybook styles: `Toast`

Immediate gap:

- [ ] decide whether `DonutChart` should stay Toast-only or gain a real Ag variant
- [ ] if Ag variant is required, add Ag pie-style primitives instead of only reusing Toast internals

Checklist:

- [ ] current neutral export naming is made honest
- [ ] Ag decision made
- [ ] missing variant implemented if needed
- [ ] parity story added if both styles exist
- [ ] screenshot reviewed

### FunnelChart

Current:

- preset styles: `Ag`
- storybook styles: `Ag`

Immediate gap:

- [ ] add Toast implementation
- [ ] define Toast hover and label emphasis for trapezoid stages

Checklist:

- [ ] AG audited
- [ ] Toast implementation added
- [ ] legend / tooltip / label model clarified
- [ ] parity story added
- [ ] screenshot reviewed

### GanttChart

Current:

- preset styles: `Ag`
- storybook styles: `Ag`

Immediate gap:

- [ ] add Toast implementation
- [ ] define Toast interaction model for task bars and dependencies

Checklist:

- [ ] AG audited
- [ ] Toast implementation added
- [ ] tooltip / hover / milestone readability checked
- [ ] parity story added
- [ ] screenshot reviewed

### GaugeChart

Current:

- preset styles: `Ag`
- storybook styles: `Ag`

Immediate gap:

- [ ] add Toast implementation
- [ ] define Toast motion model for arc / needle / value label

Checklist:

- [ ] AG audited
- [ ] Toast implementation added
- [ ] value emphasis and hover semantics clarified
- [ ] parity story added
- [ ] screenshot reviewed

### HeatmapChart

Current:

- preset styles: `Toast`
- storybook styles: `Toast`

Immediate gap:

- [ ] add Ag implementation
- [ ] define Ag hover / tooltip / legend model for segmented cells

Checklist:

- [ ] Toast audited
- [ ] Ag implementation added
- [ ] `Styles` parity story added
- [ ] screenshot reviewed

### HistogramChart

Current:

- preset styles: `Ag`
- storybook styles: `Ag`

Immediate gap:

- [ ] add Toast implementation
- [ ] define Toast contiguous-bar interaction and bin tooltip behavior

Checklist:

- [ ] AG audited
- [ ] Toast implementation added
- [ ] parity story added
- [ ] screenshot reviewed

### NetworkChart

Current:

- preset styles: `Ag`
- storybook styles: `Ag`

Immediate gap:

- [ ] add Toast implementation
- [ ] define Toast hover model for nodes vs edges
- [ ] define motion model if layout is dynamic

Checklist:

- [ ] AG audited
- [ ] Toast implementation added
- [ ] node/edge tooltip model clarified
- [ ] parity story added
- [ ] screenshot reviewed

### PieChart

Current:

- preset styles: `Toast`
- storybook styles: `Toast`

Immediate gap:

- [ ] add Ag implementation
- [ ] define Ag slice hover, tooltip, and legend behavior

Checklist:

- [ ] Toast audited
- [ ] Ag implementation added
- [ ] `Styles` parity story added
- [ ] screenshot reviewed

### PolarAreaChart

Current:

- preset styles: neutral export, but implementation is pie-style Toast-derived
- storybook styles: `Toast`

Immediate gap:

- [ ] decide whether this should gain a real Ag variant
- [ ] if yes, add Ag radial style primitives rather than only reusing Toast internals

Checklist:

- [ ] current export naming is made honest
- [ ] Ag decision made
- [ ] missing variant implemented if needed
- [ ] parity story added if both styles exist
- [ ] screenshot reviewed

### ProgressChart

Current:

- preset styles: `Ag`
- storybook styles: `Ag`

Immediate gap:

- [ ] add Toast implementation
- [ ] define Toast hover, segmented fill, and label emphasis

Checklist:

- [ ] AG audited
- [ ] Toast implementation added
- [ ] parity story added
- [ ] screenshot reviewed

### RadarChart

Current:

- preset styles: `Toast`
- storybook styles: `Toast`

Immediate gap:

- [ ] add Ag implementation
- [ ] define Ag radial tooltip and hover comparison behavior

Checklist:

- [ ] Toast audited
- [ ] Ag implementation added
- [ ] `Styles` parity story added
- [ ] screenshot reviewed

### SankeyChart

Current:

- preset styles: `Ag`
- storybook styles: `Ag`

Immediate gap:

- [ ] add Toast implementation
- [ ] define Toast hover for nodes and links
- [ ] define whether motion is needed for flow readability

Checklist:

- [ ] AG audited
- [ ] Toast implementation added
- [ ] parity story added
- [ ] screenshot reviewed

### SunburstChart

Current:

- preset styles: `Ag`
- storybook styles: `Ag`

Immediate gap:

- [ ] add Toast implementation
- [ ] define Toast hover model for hierarchical ring segments

Checklist:

- [ ] AG audited
- [ ] Toast implementation added
- [ ] parity story added
- [ ] screenshot reviewed

### TreemapChart

Current:

- preset styles: `Ag`
- storybook styles: `Ag`

Immediate gap:

- [ ] add Toast implementation
- [ ] define Toast hover and label treatment for dense rectangles

Checklist:

- [ ] AG audited
- [ ] Toast implementation added
- [ ] parity story added
- [ ] screenshot reviewed

### WaterfallChart

Current:

- preset styles: `Ag`
- storybook styles: `Ag`

Immediate gap:

- [ ] add Toast implementation
- [ ] define Toast hover model for increase/decrease/total bars and connectors

Checklist:

- [ ] AG audited
- [ ] Toast implementation added
- [ ] parity story added
- [ ] screenshot reviewed

## Execution Order

Suggested order:

1. `PieChart`, `RadarChart`, `HeatmapChart`
2. `DonutChart`, `PolarAreaChart`
3. `HistogramChart`, `WaterfallChart`, `BoxPlotChart`, `CandlestickChart`
4. `GaugeChart`, `ProgressChart`, `FunnelChart`
5. `TreemapChart`, `SunburstChart`, `SankeyChart`, `NetworkChart`
6. `ComboChart`, `GanttChart`

Reason:

- first normalize the charts already closest to dual-style treatment
- then fix the charts that currently hide Toast under neutral exports
- then move into the more custom structural charts
