# Ralph Prompt — Lollipop Chart

You are working on `flitter-chart` in the Flitter monorepo.

## Task
This chart needs **full implementation from scratch**. Follow bar-chart as the golden reference pattern.

Implement Lollipop Chart as a Radix-like headless chart with:
1. Headless layer exported from `flitter-chart/headless`
2. Toast preset with all config options (stem, dot, axes, grid, legend, title)
3. All 21 slots documented with TypeScript types
4. Storybook stories covering: basic, multi-series, horizontal, data labels, custom slot override, interaction, dense data
5. Playwright test that verifies render

## Context Files
- Spec: `docs/public/llm/ralph-tasks/lollipop-chart/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/lollipop-chart/CHECKLIST.md`
- Architecture reference: `docs/public/llm/RADIX_RESTRUCTURE_SPEC.md`
- Golden reference (bar-chart pattern): `packages/chart/src/charts/bar-chart/`

## Convention
Follow the bar-chart pattern exactly:
- `headless/lollipop-chart/` — types.ts, controller.ts, chart.ts, provider.ts, index.ts
- `charts/lollipop-chart/base/` — structural defaults
- `charts/lollipop-chart/styles/toast/` — config.ts, index.ts, parts/
- `charts/lollipop-chart/plugin.ts` — StyleMap
- `charts/lollipop-chart/index.ts` — factory function

## Key Implementation Details
- Very similar to bar-chart but replaces bar rectangle with stem (line) + dot (circle)
- Reuse bar-chart's axis, grid, legend, and layout infrastructure
- Stem is a thin line from baseline to value; dot is a circle at the value end
- lollipopGroup arranges multiple lollipops side-by-side (like barGroup)
- Direction support swaps axis roles (same as bar-chart)
- Animation: stem grows via AnimatedFractionallySizedBox; dot fades in at the end
- Dot scales up on hover for emphasis

## Completion
Check all items in CHECKLIST.md.
Output `<promise>LOLLIPOP_CHART COMPLETE</promise>` when done.
