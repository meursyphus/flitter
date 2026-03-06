# Ralph Prompt — Parallel Coordinates

You are working on `flitter-chart` in the Flitter monorepo.

## Task
This chart needs **full implementation from scratch**. Follow bar-chart as the golden reference pattern.

Implement Parallel Coordinates as a Radix-like headless chart with:
1. Headless layer exported from `flitter-chart/headless`
2. Toast preset with all config options (line, axis, brush, legend, title)
3. All 10 slots documented with TypeScript types
4. Storybook stories covering: basic, grouped, axis brushing, multi-brush, custom slot override, interaction, large dataset
5. Playwright test that verifies render

## Context Files
- Spec: `docs/public/llm/ralph-tasks/parallel-coordinates/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/parallel-coordinates/CHECKLIST.md`
- Architecture reference: `docs/public/llm/RADIX_RESTRUCTURE_SPEC.md`
- Golden reference (bar-chart pattern): `packages/chart/src/charts/bar-chart/`

## Convention
Follow the bar-chart pattern exactly:
- `headless/parallel-coordinates/` — types.ts, controller.ts, chart.ts, provider.ts, index.ts
- `charts/parallel-coordinates/base/` — structural defaults
- `charts/parallel-coordinates/styles/toast/` — config.ts, index.ts, parts/
- `charts/parallel-coordinates/plugin.ts` — StyleMap
- `charts/parallel-coordinates/index.ts` — factory function

## Key Implementation Details
- Each axis is a vertical line with its own independent linear scale
- Axes are evenly spaced horizontally across the plot width
- Lines are polylines connecting each item's value position on each axis
- Brush is a vertical range selector on an axis — drag to set [min, max] filter
- Multiple brushes can be active simultaneously for cross-dimensional filtering
- Items outside any active brush range are dimmed; items inside all active brushes are highlighted
- CustomPaint for rendering polylines efficiently
- Group colors applied to lines; legend toggles group visibility

## Completion
Check all items in CHECKLIST.md.
Output `<promise>PARALLEL_COORDINATES COMPLETE</promise>` when done.
