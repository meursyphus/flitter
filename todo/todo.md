# AI Guide for Chart Work

## Purpose

This document defines how AI should work on the chart library in this repository.

The goal is not to react immediately and patch files blindly. The goal is to:

- understand the current chart architecture first
- compare the current result against the intended reference UX
- discuss the target chart with the user before making changes
- keep `headless`, template, preset, and Storybook layers aligned

## Current Context

- This repo is building a shadcn-style chart library on top of `flitter`.
- The library currently exposes two style directions:
  - `Ag`
  - `Toast`
- Validation happens through Storybook at `http://127.0.0.1:6007`.
- Only `Ag` and `Toast` story variants matter for review.
- `Styles` stories are intentionally removed and should not be recreated unless the user explicitly asks for them.

## Architecture Map

- `packages/chart/src/headless`
  - headless chart engines
  - non-visual primitive layer
- `packages/chart/registry/templates`
  - chart template source of truth
  - style templates and shared parts live here
- `shared/chart-presets`
  - generated-like concrete chart package used for local development and chart Storybook
  - synchronized from the internal CLI/template system
- `dev/shared/chart.ts`
  - re-exports `chart-presets`
- `dev/chart-storybook`
  - final inspection point for current chart output

## Counting Model

- Headless chart engines: `22`
- Storybook chart families: `25`
- `shared/chart-presets` concrete exports: `25 Ag-neutral exports + 25 Toast exports`

The count differs because some visible chart families reuse an existing headless engine:

- `AreaChart` uses `line-chart` headless
- `StackedAreaChart` uses `line-chart` headless
- `StackedBarChart` uses `bar-chart` headless

Do not assume every Storybook chart family has its own dedicated `headless/<chart>` directory.

## Reference Sites

Use these two roots as the official reference entry points for browser exploration:

- AG Charts: `https://www.ag-grid.com/charts/`
- TOAST UI Chart: `https://nhn.github.io/tui.chart/latest/`

### Agent Workflow

When starting chart work, immediately spawn two agents:

1. **Research Agent** — handles all visual inspection (reference sites and Storybook). Takes screenshots, reports observations. Does NOT modify code.
2. **Working Agent** — handles all code changes. Receives screenshots from the research agent and implements based on them. Does NOT browse.

The main conversation (you) acts as a coordinator: relay screenshots and observations between agents, align on direction with the user, and keep both agents focused on their roles.

This separation ensures that browser exploration and code work never mix in the same agent context.

## Style Intent

Both styles are reference-driven. The purpose is to imitate the UX language of the reference libraries, not to invent a third visual system.

### Ag

- Mimic AG Charts style and interaction tone.
- More structural, restrained, and chart-tool oriented.
- Hover behavior tends to emphasize the active element while de-emphasizing surrounding series with transparency.

### Toast

- Mimic TOAST UI Chart style and interaction tone.
- More lifted, contrasted, and visually separated.
- Hover behavior tends to make the active element feel raised and more explicit.

### BarChart Hover Reference

Use `BarChart` as the baseline example when reasoning about style differences:

- `Ag`
  - when one bar is hovered, non-active bars become more transparent
  - active emphasis is driven by opacity contrast
- `Toast`
  - when one bar is hovered, the active bar gets a white outline and lifted emphasis
  - active emphasis is driven by outline and raised visual weight

## Config And Sync Notes

Before changing any chart, understand how config is layered and reused.

- AG-style cartesian charts inherit shared AG base config
- Toast-style cartesian charts inherit shared Toast base config
- chart-specific config extends those shared bases
- Storybook charts are consuming `shared/chart`, which re-exports `chart-presets`
- `shared/chart-presets` is not the source of truth; it is a synchronized consumer package
- template and CLI changes may require preset sync, not just local edits

Relevant mental model:

- template source: `packages/chart/registry/templates`
- sync target: `shared/chart-presets`
- Storybook surface: `dev/chart-storybook`

### Sync Command

After editing any file under `packages/chart/registry/templates`, run the sync command to regenerate `shared/chart-presets`:

```bash
# Sync a specific chart (both styles)
pnpm --dir shared/chart-presets run sync -- --chart <chart-name>

# Sync a specific chart and style
pnpm --dir shared/chart-presets run sync -- --chart <chart-name> --style <toast|ag>

# Sync only charts that have git changes
pnpm --dir shared/chart-presets run sync -- --changed

# Full sync (all charts)
pnpm --dir shared/chart-presets run sync
```

**IMPORTANT**: Never edit `shared/chart-presets` files directly. Always edit `packages/chart/registry/templates` first, then run sync.

When in doubt, inspect shared config first, then the chart-specific style implementation, then the preset output.

## Completed Charts

The following 8 chart families are already considered done for current feedback purposes:

- `AreaChart`
- `BarChart`
- `BoxPlotChart`
- `BubbleChart`
- `LineChart`
- `ScatterChart`
- `StackedAreaChart`
- `StackedBarChart`

Do not ask the user for new visual feedback on these 8 unless the user explicitly reopens them.

## Feedback Scope

Current feedback should cover only the remaining 17 chart families.

Each style must be checked separately.

Do not treat a chart as complete just because one style is complete.

## Feedback Checklist

- [ㅅ] `PieChart / Ag`
- [ㅅ] `PieChart / Toast`
ㄴ 데이터 라벨 표시를 각각 하면 됨, 
- [x] `HeatmapChart / Ag`
- [x] `HeatmapChart / Toast`
- [![](screenshots/treemap-ag.png)](https://www.ag-grid.com/charts/gallery/simple-treemap/) `TreemapChart / Ag`
- [![](screenshots/treemap-toast.png)](https://nhn.github.io/tui.chart/latest/tutorial-example12-01-treemap-chart-basic) `TreemapChart / Toast`
- [![](screenshots/boxplotbar-ag.png)](https://www.ag-grid.com/charts/gallery/horizontal-box-plot/) `BoxPlotBar / Ag`
- [![](screenshots/boxplotbar-toast.png)](https://nhn.github.io/tui.chart/latest/tutorial-example03-01-boxPlot-chart-basic) `BoxPlotBar / Toast`
ㄴ 하다 말았음, 겁나 BoxPlot 쪽 위젯구조와 어케 배치할지를 직접 컨트롤 해야할듯,
ㄴ Toast BoxPlot은 vertical만 있음 (horizontal 별도 없음)
- [![](screenshots/radar-ag.png)](https://www.ag-grid.com/charts/gallery/simple-radar-area/) `RadarChart / Ag`
- [ㅅ] [![](screenshots/radar-toast.png)](https://nhn.github.io/tui.chart/latest/tutorial-example10-01-radar-chart-basic) `RadarChart / Toast`
- [![](screenshots/candlestick-ag.png)](https://www.ag-grid.com/charts/gallery/candlestick/) `CandlestickChart / Ag`
- N/A `CandlestickChart / Toast` (Toast UI에 없음)
- [![](screenshots/donut-ag.png)](https://www.ag-grid.com/charts/gallery/simple-donut/) `DonutChart / Ag`
- [![](screenshots/donut-toast.png)](https://nhn.github.io/tui.chart/latest/tutorial-example09-05-pie-chart-donut) `DonutChart / Toast`
- [![](screenshots/polararea-ag.png)](https://www.ag-grid.com/charts/gallery/multiple-nightingale-series/) `PolarAreaChart / Ag`
- [![](screenshots/polararea-toast.png)](https://nhn.github.io/tui.chart/latest/tutorial-example18-01-radialBar-chart-basic) `PolarAreaChart / Toast`
ㄴ Toast에서는 RadialBarChart로 불림
- [![](screenshots/progress-ag.png)](https://www.ag-grid.com/charts/gallery/simple-linear-gauge/) `ProgressChart / Ag`
- N/A `ProgressChart / Toast` (Toast UI에 없음)
ㄴ AG에는 bullet chart도 있음: https://www.ag-grid.com/charts/gallery/simple-bullet/
- [![](screenshots/gauge-ag.png)](https://www.ag-grid.com/charts/gallery/simple-radial-gauge/) `GaugeChart / Ag`
- [![](screenshots/gauge-toast.png)](https://nhn.github.io/tui.chart/latest/tutorial-example20-01-gauge-chart-basic) `GaugeChart / Toast`
- [![](screenshots/histogram-ag.png)](https://www.ag-grid.com/charts/gallery/histogram-with-specified-bins/) `HistogramChart / Ag`
- N/A `HistogramChart / Toast` (Toast UI에 없음)
- [![](screenshots/sunburst-ag.png)](https://www.ag-grid.com/charts/gallery/simple-sunburst/) `SunburstChart / Ag`
- N/A `SunburstChart / Toast` (Toast UI에 없음)
- [![](screenshots/waterfall-ag.png)](https://www.ag-grid.com/charts/gallery/simple-waterfall/) `WaterfallChart / Ag`
- N/A `WaterfallChart / Toast` (Toast UI에 없음)
- [![](screenshots/funnel-ag.png)](https://www.ag-grid.com/charts/gallery/simple-funnel/) `FunnelChart / Ag`
- N/A `FunnelChart / Toast` (Toast UI에 없음)
- [![](screenshots/combo-ag.png)](https://www.ag-grid.com/charts/gallery/bar-line-combination/) `ComboChart / Ag`
- [![](screenshots/combo-toast.png)](https://nhn.github.io/tui.chart/latest/tutorial-example13-01-columnLine-chart-basic) `ComboChart / Toast`
ㄴ Toast에는 LineArea, LineScatter 콤보도 있음
- [![](screenshots/sankey-ag.png)](https://www.ag-grid.com/charts/gallery/sankey/) `SankeyChart / Ag`
- N/A `SankeyChart / Toast` (Toast UI에 없음)
- N/A `GanttChart / Ag` (AG Charts에 없음)
- N/A `GanttChart / Toast` (Toast UI에 없음)
- N/A `NetworkChart / Ag` (AG Charts에 없음)
- N/A `NetworkChart / Toast` (Toast UI에 없음)

- [![](screenshots/nestedpie-ag.png)](https://www.ag-grid.com/charts/gallery/pie-in-a-donut/) `NestedPieChart / Ag`
- [![](screenshots/nestedpie-toast.png)](https://nhn.github.io/tui.chart/latest/tutorial-example16-01-NestedPie-chart-basic) `NestedPieChart / Toast`

Notes for `NestedPieChart`:

- This is not part of the current flat `PieChart` implementation.
- This should be treated as a future chart to build from the headless layer first.
- Before any style work begins, define the headless data model, widget structure, hover model, legend behavior, and ring hierarchy strategy.
- It may be conceptually close to a shallow `SunburstChart`, but it should not be assumed to be the same chart without explicit agreement.

## Working Rules For AI

Before doing implementation work on any target chart, follow this order:

1. Identify the target chart.
2. Explain the target chart's current headless structure to the user.
3. Explain the target chart's `datasets` type to the user.
4. Explain how the widget tree is composed.
5. Explain where hover, tooltip, label, legend, and config state are handled.
6. Explain where shared config and chart-specific config are merged.
7. Discuss this with the user until the direction is clear.
8. Only after that, inspect reference behavior and compare against Storybook.
9. Only after that, propose or implement changes.

The explanation step is mandatory. Do not skip directly to code changes.

## What To Explain Before Editing

At minimum, before editing a chart, explain all of the following:

- which `headless` engine is being used
- whether the chart is a direct engine match or a derived template
- what the `datasets` shape looks like
- what the widget structure looks like
- where style parts are injected
- where tooltip behavior lives
- where hover state lives
- where shared base config comes from
- whether the chart output is synced into `shared/chart-presets`

## Expected Conversation Style

When discussing a target chart with the user:

- lead with explanation, not implementation
- use the current code structure as the basis of the explanation
- verify that the user agrees with your reading before changing code
- if the reference behavior is ambiguous, show the ambiguity and ask the user to choose
- prefer a short back-and-forth over a premature implementation

## Storybook Rule

For chart review in this repo, Storybook should be interpreted as:

- one chart family
- two relevant review tracks: `Ag` and `Toast`
- no `Styles` review track

If a future change reintroduces `Styles` stories, treat that as a separate request, not as the default review workflow.
