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

If browser exploration is needed, `agent-browser` should start from these roots and navigate from there.

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

- [x] `PieChart / Ag`
- [x] `PieChart / Toast`
- [ ] `HeatmapChart / Ag`
- [x] `HeatmapChart / Toast`
- [ ] `BoxPlotBar / Ag`
- [ ] `BoxPlotBar / Toast`
- [ ] `RadarChart / Ag`
- [ ] `RadarChart / Toast`
- [ ] `DonutChart / Ag`
- [ ] `DonutChart / Toast`
- [ ] `PolarAreaChart / Ag`
- [ ] `PolarAreaChart / Toast`
- [ ] `ProgressChart / Ag`
- [ ] `ProgressChart / Toast`
- [ ] `GaugeChart / Ag`
- [ ] `GaugeChart / Toast`
- [ ] `HistogramChart / Ag`
- [ ] `HistogramChart / Toast`
- [ ] `TreemapChart / Ag`
- [ ] `TreemapChart / Toast`
- [ ] `SunburstChart / Ag`
- [ ] `SunburstChart / Toast`
- [ ] `WaterfallChart / Ag`
- [ ] `WaterfallChart / Toast`
- [ ] `CandlestickChart / Ag`
- [ ] `CandlestickChart / Toast`
- [ ] `FunnelChart / Ag`
- [ ] `FunnelChart / Toast`
- [ ] `ComboChart / Ag`
- [ ] `ComboChart / Toast`
- [ ] `SankeyChart / Ag`
- [ ] `SankeyChart / Toast`
- [ ] `GanttChart / Ag`
- [ ] `GanttChart / Toast`
- [ ] `NetworkChart / Ag`
- [ ] `NetworkChart / Toast`

- [ ] `NestedPieChart / Ag`
- [ ] `NestedPieChart / Toast`

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
