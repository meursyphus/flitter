# Ralph Prompt — Slope Chart

You are working on `flitter-chart` in the Flitter monorepo.

## Task
This chart needs **full implementation from scratch**. Follow bar-chart as the golden reference pattern.

Implement Slope Chart as a Radix-like headless chart with:
1. Headless layer exported from `flitter-chart/headless`
2. Toast preset with all config options (line, dot, label, legend, title)
3. All 10 slots documented with TypeScript types
4. Storybook stories covering: basic, many datasets, color-coded, value labels, custom slot override, interaction
5. Playwright test that verifies render

## Context Files
- Spec: `docs/public/llm/ralph-tasks/slope-chart/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/slope-chart/CHECKLIST.md`
- Architecture reference: `docs/public/llm/RADIX_RESTRUCTURE_SPEC.md`
- Golden reference (bar-chart pattern): `packages/chart/src/charts/bar-chart/`

## Convention
Follow the bar-chart pattern exactly:
- `headless/slope-chart/` — types.ts, controller.ts, chart.ts, provider.ts, index.ts
- `charts/slope-chart/base/` — structural defaults
- `charts/slope-chart/styles/toast/` — config.ts, index.ts, parts/
- `charts/slope-chart/plugin.ts` — StyleMap
- `charts/slope-chart/index.ts` — factory function

## Key Implementation Details
- Two vertical axes (left and right) with the same scale
- Lines connect each dataset's value on the left axis to its value on the right axis
- Dots at both endpoints; labels show values and dataset names
- Crossing lines visually indicate rank changes
- Hover highlights one line and dims all others
- Animation: lines start horizontal (midpoint value) and animate to final slope
- Label collision avoidance: nudge overlapping labels apart

## Completion
Check all items in CHECKLIST.md.
Output `<promise>SLOPE_CHART COMPLETE</promise>` when done.
