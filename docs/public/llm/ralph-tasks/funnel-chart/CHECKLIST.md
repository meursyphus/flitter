# Funnel Chart — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve (no broken `@headless/`, `@shared/`, `@styles/` paths)

## Headless (move from _todo)
- [ ] `headless/_todo/funnel-chart/` moved to `headless/funnel-chart/`
- [ ] HeadlessFunnelChart exported from `headless/index.ts`
- [ ] All 7 slots typed in `types.ts` (layout, funnel, stage, stageLabel, dataLabel, legend, title)
- [ ] Provider (`FunnelChartConfigProvider`) works via `Provider.of(context)`
- [ ] `chart.ts` builds component tree (Layout, Funnel, Stages)
- [ ] Ratio and percentage calculated correctly for each stage
- [ ] Default color palette assigned when stage colors not provided

## Styled Layer (new)
- [ ] `charts/funnel-chart/` directory created
- [ ] `charts/funnel-chart/index.ts` exports `FunnelChart()` factory function
- [ ] `charts/funnel-chart/base/index.ts` provides structural defaults for all 7 slots
- [ ] `charts/funnel-chart/styles/toast/index.ts` exports `toastStyleConfig`
- [ ] `charts/funnel-chart/styles/toast/config.ts` defines `ToastFunnelChartConfig` extending `ToastBaseConfig`
- [ ] `charts/funnel-chart/styles/toast/parts/` has stage, stageLabel, dataLabel parts
- [ ] Toast preset works with default config (no user config required)
- [ ] Custom slot override works (partial override merges correctly)
- [ ] Stages taper progressively from top to bottom
- [ ] Data labels show both value and conversion percentage

## Export
- [ ] FunnelChart added to `charts/index.ts`
- [ ] FunnelChart added to `src/index.ts`

## Storybook
- [ ] Basic story renders (sales funnel)
- [ ] Custom colors story renders
- [ ] Percentage labels story renders
- [ ] Hover interaction story works
- [ ] Many stages (8+) story renders
- [ ] Equal-value stages story renders (rectangular funnel)
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
