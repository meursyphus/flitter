# Ralph Prompt — Bullet Chart

You are working on `flitter-chart` in the Flitter monorepo.

## Task
This chart needs **full implementation from scratch**. Follow bar-chart as the golden reference pattern.

Implement Bullet Chart as a Radix-like headless chart with:
1. Headless layer exported from `flitter-chart/headless`
2. Toast preset with all config options (actualBar, targetMarker, ranges, label, title)
3. All 8 slots documented with TypeScript types
4. Storybook stories covering: basic, multiple bullets, custom ranges, value labels, custom slot override, interaction
5. Playwright test that verifies render

## Context Files
- Spec: `docs/public/llm/ralph-tasks/bullet-chart/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/bullet-chart/CHECKLIST.md`
- Architecture reference: `docs/public/llm/RADIX_RESTRUCTURE_SPEC.md`
- Golden reference (bar-chart pattern): `packages/chart/src/charts/bar-chart/`

## Convention
Follow the bar-chart pattern exactly:
- `headless/bullet-chart/` — types.ts, controller.ts, chart.ts, provider.ts, index.ts
- `charts/bullet-chart/base/` — structural defaults
- `charts/bullet-chart/styles/toast/` — config.ts, index.ts, parts/
- `charts/bullet-chart/plugin.ts` — StyleMap
- `charts/bullet-chart/index.ts` — factory function

## Key Implementation Details
- Simple linear scale from 0 to max(ranges)
- Qualitative ranges rendered as nested rectangles from largest to smallest
- Actual bar is a narrow bar overlaid on ranges
- Target marker is a thin vertical line at the target position
- Designed to be compact and stackable — multiple bullet charts in a column
- Animation: actual bar grows from 0 to value on mount

## Completion
Check all items in CHECKLIST.md.
Output `<promise>BULLET_CHART COMPLETE</promise>` when done.
