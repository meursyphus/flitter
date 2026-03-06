# Waterfall Chart — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve (no broken `@headless/`, `@shared/`, `@styles/` paths)

## Headless (move from _todo)
- [ ] `headless/_todo/waterfall-chart/` moved to `headless/waterfall-chart/`
- [ ] HeadlessWaterfallChart exported from `headless/index.ts`
- [ ] All 22 slots typed in `types.ts`
- [ ] Provider (`WaterfallChartConfigProvider`) works via `Provider.of(context)`
- [ ] `chart.ts` builds the full component tree (Layout, Plot, DataView, Bars, Connectors, Axes, Grid)
- [ ] Cumulative values computed correctly from data.values and data.totalIndices
- [ ] 3 fixed legends (Increase, Decrease, Total) emitted by Layout

## Styled Layer (new)
- [ ] `charts/waterfall-chart/` directory created
- [ ] `charts/waterfall-chart/index.ts` exports `WaterfallChart()` factory function
- [ ] `charts/waterfall-chart/base/index.ts` provides structural defaults for all 22 slots
- [ ] `charts/waterfall-chart/styles/toast/index.ts` exports `toastStyleConfig`
- [ ] `charts/waterfall-chart/styles/toast/config.ts` defines `ToastWaterfallChartConfig` extending `ToastBaseConfig`
- [ ] `charts/waterfall-chart/styles/toast/parts/` has bar, connector, dataLabel parts
- [ ] Toast preset works with default config (no user config required)
- [ ] Custom slot override works (partial override merges correctly)
- [ ] Bar colors: increase=green, decrease=red, total=gray by default
- [ ] Connector lines render as dashed between consecutive bars

## Export
- [ ] WaterfallChart added to `charts/index.ts`
- [ ] WaterfallChart added to `src/index.ts`

## Storybook
- [ ] Basic story renders (revenue waterfall)
- [ ] Story with total indices renders
- [ ] Custom colors story renders
- [ ] Data labels story renders
- [ ] Hover interaction story works
- [ ] Negative-heavy dataset story renders
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
