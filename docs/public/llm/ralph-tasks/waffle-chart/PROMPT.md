# Ralph Prompt — Waffle Chart

You are working on `flitter-chart` in the Flitter monorepo.

## Task
This chart needs **full implementation from scratch**. Follow bar-chart as the golden reference pattern.

Implement Waffle Chart as a Radix-like headless chart with:
1. Headless layer exported from `flitter-chart/headless`
2. Toast preset with all config options (cell.size, cell.gap, cell.cornerRadius, cell.colors, legend, title)
3. All 7 slots documented with TypeScript types
4. Storybook stories covering: basic, multi-category, custom grid size, labels, custom slot override, interaction
5. Playwright test that verifies render

## Context Files
- Spec: `docs/public/llm/ralph-tasks/waffle-chart/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/waffle-chart/CHECKLIST.md`
- Architecture reference: `docs/public/llm/RADIX_RESTRUCTURE_SPEC.md`
- Golden reference (bar-chart pattern): `packages/chart/src/charts/bar-chart/`

## Convention
Follow the bar-chart pattern exactly:
- `headless/waffle-chart/` — types.ts, controller.ts, chart.ts, provider.ts, index.ts
- `charts/waffle-chart/base/` — structural defaults
- `charts/waffle-chart/styles/toast/` — config.ts, index.ts, parts/
- `charts/waffle-chart/plugin.ts` — StyleMap
- `charts/waffle-chart/index.ts` — factory function

## Key Implementation Details
- Grid is NxM (default 10x10 = 100 cells representing 100%)
- Cell allocation: normalize category values to percentages, assign cells proportionally
- Each cell colored by its category; unfilled cells have neutral background
- Wave animation: cells fill in row-by-row or category-by-category on mount
- Hover highlights all cells belonging to the same category
- Legend toggle redistributes cells among visible categories

## Completion
Check all items in CHECKLIST.md.
Output `<promise>WAFFLE_CHART COMPLETE</promise>` when done.
