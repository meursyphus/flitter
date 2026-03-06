# Validation Report

This file is internal.

Date: 2026-03-07

This report records the current Storybook-backed validation state for the `llms.txt`
chart-generation docs.

Method:

- expanded `Charts/LLMEvaluation` to a 28-case golden suite
- matched every Storybook export against `llm/evaluation-cases.json`
- built `chart-storybook`
- ran Playwright smoke coverage across every `LLMEvaluation` story in both `svg` and `canvas`

Command:

```bash
pnpm chart-story:validate
```

## Current status

### Verified

- `evaluation-cases.json` now contains 28 golden cases
- `Charts/LLMEvaluation` now exposes 28 matching Storybook stories
- all 28 stories render in both `svg` and `canvas`
- the suite now covers:
  - core cartesian families (`BarChart`, `LineChart`, `AreaChart`, `StackedBarChart`, `StackedAreaChart`, `ScatterChart`, `BubbleChart`)
  - toast-only/polar families (`PieChart`, `RadarChart`, `HeatmapChart`)
  - legacy/manual semantics (`waterfall`, `sankey`, `funnel`, `gauge`, `candlestick`, `box plot`, `treemap`, `sunburst`, composed scorecard)

### Fixes discovered during verification

- `ToastTreemapChart` was missing the `treemap` slot implementation, which caused runtime failure in Storybook
- the default sunburst canvas painter could attempt to draw with a negative radius during zero-size/early paint; this is now guarded

### Remaining limitations

- the validation loop is currently a render smoke test, not a semantic pixel diff
- `testing-prompts.md` is still broader than the Storybook suite and has not yet been expanded into a one-to-one 28-case prompt ledger
- Storybook build still emits existing chunk-size and circular chunk warnings unrelated to this suite
