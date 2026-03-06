# Ralph Prompt — Progress Chart

You are working on `flitter-chart` in the Flitter monorepo.

## Task
This chart needs **full implementation from scratch**. Follow bar-chart as the golden reference pattern.

Implement Progress Chart (Ring Chart) as a Radix-like headless chart with:
1. Headless layer exported from `flitter-chart/headless`
2. Toast preset with all config options (track, fill, valueLabel, title)
3. All 7 slots documented with TypeScript types
4. Storybook stories covering: basic, percentage label, color thresholds, nested rings, animated value, custom slot override
5. Playwright test that verifies render

## Context Files
- Spec: `docs/public/llm/ralph-tasks/progress-chart/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/progress-chart/CHECKLIST.md`
- Architecture reference: `docs/public/llm/RADIX_RESTRUCTURE_SPEC.md`
- Golden reference (bar-chart pattern): `packages/chart/src/charts/bar-chart/`

## Convention
Follow the bar-chart pattern exactly:
- `headless/progress-chart/` — types.ts, controller.ts, chart.ts, provider.ts, index.ts
- `charts/progress-chart/base/` — structural defaults
- `charts/progress-chart/styles/toast/` — config.ts, index.ts, parts/
- `charts/progress-chart/plugin.ts` — StyleMap
- `charts/progress-chart/index.ts` — factory function

## Key Implementation Details
- Simple circular arc chart: track (background circle) + fill (progress arc)
- CustomPaint for rendering arcs with configurable strokeWidth and lineCap
- Start angle at top (-90 degrees / -PI/2) by default
- Fill sweep angle = fraction * 2 * PI
- AnimationController for smooth value transitions
- Value label centered in the ring showing value, percentage, or custom text
- Color thresholds: fill color changes based on value/max ratio
- Nestable: multiple progress charts can be concentrically nested

## Completion
Check all items in CHECKLIST.md.
Output `<promise>PROGRESS_CHART COMPLETE</promise>` when done.
