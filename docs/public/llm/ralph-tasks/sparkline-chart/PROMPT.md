# Ralph Prompt — Sparkline Chart

You are working on `flitter-chart` in the Flitter monorepo.

## Task
This chart needs **full implementation from scratch**. Follow bar-chart as the golden reference pattern.

Implement Sparkline Chart as a Radix-like headless chart with:
1. Headless layer exported from `flitter-chart/headless`
2. Toast preset with all config options (line, area, highlight styling)
3. All 4 slots documented with TypeScript types
4. Storybook stories covering: basic line, area variant, bar variant, highlight points, custom slot override, inline context
5. Playwright test that verifies render

## Context Files
- Spec: `docs/public/llm/ralph-tasks/sparkline-chart/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/sparkline-chart/CHECKLIST.md`
- Architecture reference: `docs/public/llm/RADIX_RESTRUCTURE_SPEC.md`
- Golden reference (bar-chart pattern): `packages/chart/src/charts/bar-chart/`

## Convention
Follow the bar-chart pattern exactly:
- `headless/sparkline-chart/` — types.ts, controller.ts, chart.ts, provider.ts, index.ts
- `charts/sparkline-chart/base/` — structural defaults
- `charts/sparkline-chart/styles/toast/` — config.ts, index.ts, parts/
- `charts/sparkline-chart/plugin.ts` — StyleMap
- `charts/sparkline-chart/index.ts` — factory function

## Key Implementation Details
- Minimal chart: no axes, no labels, no legend, no grid
- Three variants: line (CustomPaint path), area (filled path), bar (mini rectangles)
- Auto-scales to data range — min value at bottom, max at top
- Highlight points for last, min, max values as small dots
- Designed to be very compact — fits inline in text or table cells
- Line draws left-to-right animation on mount

## Completion
Check all items in CHECKLIST.md.
Output `<promise>SPARKLINE_CHART COMPLETE</promise>` when done.
