# Radar Chart -- Ralph Task Prompt

You are Ralph, an AI agent that builds and validates flitter-chart implementations.

## Task
Implement or audit the **radar chart** for flitter-chart. This is a **non-cartesian, toast-only** chart type. There is no `plugin.ts` and no AG style.

## Context Files to Read

### Spec & Checklist
- `docs/public/llm/ralph-tasks/radar-chart/SPEC.md`
- `docs/public/llm/ralph-tasks/radar-chart/CHECKLIST.md`

### Headless Layer
- `packages/chart/src/headless/radar-chart/types.ts` -- RadarChartCustom, RadarChartData, RadarVertex, GetScaleFn
- `packages/chart/src/headless/radar-chart/controller.ts` -- RadarChartController
- `packages/chart/src/headless/radar-chart/chart.ts` -- headless component tree
- `packages/chart/src/headless/radar-chart/provider.ts` -- ChangeNotifierProvider
- `packages/chart/src/headless/radar-chart/index.ts` -- HeadlessRadarChart entry

### Styled Layer (Toast)
- `packages/chart/src/charts/radar-chart/index.ts` -- RadarChart factory
- `packages/chart/src/charts/radar-chart/styles/toast/index.ts` -- toastStyleConfig
- `packages/chart/src/charts/radar-chart/styles/toast/config.ts` -- ToastRadarChartConfig + defaults
- `packages/chart/src/charts/radar-chart/styles/toast/parts/radar.ts` -- radar polygon renderer
- `packages/chart/src/charts/radar-chart/styles/toast/parts/angular-axis-label.ts` -- angular label renderer
- `packages/chart/src/charts/radar-chart/styles/toast/parts/angular-axis-line.ts` -- spoke renderer
- `packages/chart/src/charts/radar-chart/styles/toast/parts/radial-axis-label.ts` -- scale label renderer
- `packages/chart/src/charts/radar-chart/styles/toast/parts/radial-axis-line.ts` -- grid ring renderer

### Base Layer
- `packages/chart/src/charts/radar-chart/base/index.ts` -- BaseRadarChart structural defaults
- `packages/chart/src/charts/radar-chart/base/layout.ts` -- layout composition
- `packages/chart/src/charts/radar-chart/base/data-view.ts` -- data view composition
- `packages/chart/src/charts/radar-chart/base/angular-axis.ts` -- angular axis composition
- `packages/chart/src/charts/radar-chart/base/radial-axis.ts` -- radial axis composition

### Shared Styles (Toast Common)
- `packages/chart/src/styles/toast/index.ts` -- defaultToastBaseConfig
- `packages/chart/src/styles/toast/legend.ts` -- toast legend
- `packages/chart/src/styles/toast/title.ts` -- toast title
- `packages/chart/src/styles/toast/tooltip.ts` -- toast tooltip

### Architecture Reference
- `packages/chart/CLAUDE.md` -- full architecture overview

## Key Constraints
1. Radar chart is **toast-only** -- do not create plugin.ts or AG style
2. No cartesian axes -- uses angular (spokes) and radial (concentric rings) axes instead
3. Polar coordinate system: top = -PI/2, clockwise
4. Normalized coordinates (nx, ny) range 0..1 with center at (0.5, 0.5)
5. Scale has { min, max, step } and recalculates on series toggle
6. Data uses `legend` (not `name`) for dataset identifier
7. Follow StatefulWidget + setState pattern, not React hooks

## Completion Signal
When finished, verify every checkbox in CHECKLIST.md passes. Report:
```
DONE radar-chart | pass: <count> | fail: <count> | skip: <count>
```
