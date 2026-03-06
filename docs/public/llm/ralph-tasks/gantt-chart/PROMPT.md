# Ralph Prompt — Gantt Chart

You are working on `flitter-chart` in the Flitter monorepo.

## Task
This chart needs **full implementation from scratch**. Follow bar-chart as the golden reference pattern.

Implement Gantt Chart as a Radix-like headless chart with:
1. Headless layer exported from `flitter-chart/headless`
2. Toast preset with all config options (taskBar.height, taskBar.cornerRadius, taskBar.progressColor, timeline, grid, title)
3. All 14 slots documented with TypeScript types
4. Storybook stories covering: basic, with progress, grouped tasks, milestones, custom slot override, interaction
5. Playwright test that verifies render

## Context Files
- Spec: `docs/public/llm/ralph-tasks/gantt-chart/SPEC.md`
- Checklist: `docs/public/llm/ralph-tasks/gantt-chart/CHECKLIST.md`
- Architecture reference: `docs/public/llm/RADIX_RESTRUCTURE_SPEC.md`
- Golden reference (bar-chart pattern): `packages/chart/src/charts/bar-chart/`

## Convention
Follow the bar-chart pattern exactly:
- `headless/gantt-chart/` — types.ts, controller.ts, chart.ts, provider.ts, index.ts
- `charts/gantt-chart/base/` — structural defaults
- `charts/gantt-chart/styles/toast/` — config.ts, index.ts, parts/
- `charts/gantt-chart/plugin.ts` — StyleMap
- `charts/gantt-chart/index.ts` — factory function

## Key Implementation Details
- Time-based x-axis using Date objects — compute pixel position from date within time range
- Task rows laid out vertically with fixed row height
- Progress bar is a partial fill within the task bar (0-1 fraction)
- Milestones are zero-duration tasks rendered as diamond markers
- Group headers separate tasks into collapsible sections
- Horizontal scrolling for long timelines
- Tooltip shows task name, start date, end date, duration, progress

## Completion
Check all items in CHECKLIST.md.
Output `<promise>GANTT_CHART COMPLETE</promise>` when done.
