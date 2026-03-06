# Box Plot Chart — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve (no broken `@headless/`, `@shared/`, `@styles/` paths)

## Headless (move from _todo)
- [ ] `headless/_todo/box-plot-chart/` moved to `headless/box-plot-chart/`
- [ ] HeadlessBoxPlotChart exported from `headless/index.ts`
- [ ] All 18 slots typed in `types.ts`
- [ ] Provider works via `Provider.of(context)`
- [ ] `chart.ts` builds full component tree (Layout, Plot, DataView, BoxPlotGroups, BoxPlots, Outliers, Axes, Grid)
- [ ] Scale computed from min/max across all data points including outliers
- [ ] BoxPlotGroup correctly groups multiple datasets per category label
- [ ] Default files in `default/` render structural placeholders for all slots

## Styled Layer (new)
- [ ] `charts/box-plot-chart/` directory created
- [ ] `charts/box-plot-chart/index.ts` exports `BoxPlotChart()` factory function
- [ ] `charts/box-plot-chart/base/index.ts` provides structural defaults for all 18 slots
- [ ] `charts/box-plot-chart/styles/toast/index.ts` exports `toastStyleConfig`
- [ ] `charts/box-plot-chart/styles/toast/config.ts` defines `ToastBoxPlotChartConfig` extending `ToastBaseConfig`
- [ ] `charts/box-plot-chart/styles/toast/parts/` has boxPlot, outlier parts
- [ ] Toast preset works with default config (no user config required)
- [ ] Custom slot override works (partial override merges correctly)
- [ ] Box renders correctly (Q1-Q3 fill, median line, min-max whiskers)
- [ ] Outlier markers render beyond whiskers

## Export
- [ ] BoxPlotChart added to `charts/index.ts`
- [ ] BoxPlotChart added to `src/index.ts`

## Storybook
- [ ] Basic story renders (single dataset)
- [ ] Multi-dataset comparison story renders
- [ ] With outliers story renders
- [ ] Hover interaction story works (stats tooltip)
- [ ] Legend filtering story works
- [ ] Dense categories (10+) story renders
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
