# Pie Chart -- Ralph Task Prompt

You are Ralph, an AI agent that builds and validates flitter-chart implementations.

## Task
Implement or audit the **pie chart** for flitter-chart. This is a **non-cartesian, toast-only** chart type. There is no `plugin.ts` and no AG style.

## Context Files to Read

### Spec & Checklist
- `docs/public/llm/ralph-tasks/pie-chart/SPEC.md`
- `docs/public/llm/ralph-tasks/pie-chart/CHECKLIST.md`

### Headless Layer
- `packages/chart/src/headless/pie-chart/types.ts` -- PieChartCustom, PieChartData
- `packages/chart/src/headless/pie-chart/controller.ts` -- PieChartController
- `packages/chart/src/headless/pie-chart/chart.ts` -- headless component tree
- `packages/chart/src/headless/pie-chart/provider.ts` -- ChangeNotifierProvider
- `packages/chart/src/headless/pie-chart/index.ts` -- HeadlessPieChart entry

### Styled Layer (Toast)
- `packages/chart/src/charts/pie-chart/index.ts` -- PieChart factory
- `packages/chart/src/charts/pie-chart/styles/toast/index.ts` -- toastStyleConfig
- `packages/chart/src/charts/pie-chart/styles/toast/config.ts` -- ToastPieChartConfig + defaults
- `packages/chart/src/charts/pie-chart/styles/toast/parts/slice.ts` -- slice renderer
- `packages/chart/src/charts/pie-chart/styles/toast/parts/data-view.ts` -- data view renderer

### Base Layer
- `packages/chart/src/charts/pie-chart/base/index.ts` -- BasePieChart structural defaults
- `packages/chart/src/charts/pie-chart/base/layout.ts` -- layout composition
- `packages/chart/src/charts/pie-chart/base/data-view.ts` -- data view composition

### Shared Styles (Toast Common)
- `packages/chart/src/styles/toast/index.ts` -- defaultToastBaseConfig
- `packages/chart/src/styles/toast/legend.ts` -- toast legend
- `packages/chart/src/styles/toast/title.ts` -- toast title
- `packages/chart/src/styles/toast/tooltip.ts` -- toast tooltip

### Architecture Reference
- `packages/chart/CLAUDE.md` -- full architecture overview

## Key Constraints
1. Pie chart is **toast-only** -- do not create plugin.ts or AG style
2. No cartesian axes -- no x-axis, y-axis, grid, or axisCorner slots
3. Data shape uses `name` (not `legend`) for dataset identifier
4. `innerRadiusRatio` > 0 activates donut mode
5. Sweep angles are computed from value proportions, not from a scale
6. Use `Stack` + `Transform.rotate` for radial slice layout
7. Follow StatefulWidget + setState pattern, not React hooks

## Completion Signal
When finished, verify every checkbox in CHECKLIST.md passes. Report:
```
DONE pie-chart | pass: <count> | fail: <count> | skip: <count>
```
