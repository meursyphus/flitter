# Gauge Chart — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve (no broken `@headless/`, `@shared/`, `@styles/` paths)

## Headless (move from _todo)
- [ ] `headless/_todo/gauge-chart/` moved to `headless/gauge-chart/`
- [ ] HeadlessGaugeChart exported from `headless/index.ts`
- [ ] All 6 slots typed in `types.ts` (layout, gauge, needle, valueLabel, scale, title)
- [ ] Provider (`GaugeChartConfigProvider`) works via `Provider.of(context)`
- [ ] `chart.ts` builds component tree (Layout, Gauge, Needle, Scale, ValueLabel)
- [ ] Needle angle computed correctly: ratio = (value - min) / (max - min)
- [ ] Zone color mapping resolves correctly for overlapping/adjacent zones

## Styled Layer (new)
- [ ] `charts/gauge-chart/` directory created
- [ ] `charts/gauge-chart/index.ts` exports `GaugeChart()` factory function
- [ ] `charts/gauge-chart/base/index.ts` provides structural defaults for all 6 slots
- [ ] `charts/gauge-chart/styles/toast/index.ts` exports `toastStyleConfig`
- [ ] `charts/gauge-chart/styles/toast/config.ts` defines `ToastGaugeChartConfig` extending `ToastBaseConfig`
- [ ] `charts/gauge-chart/styles/toast/parts/` has needle, scale, valueLabel parts
- [ ] Toast preset works with default config (no user config required)
- [ ] Custom slot override works (partial override merges correctly)
- [ ] Arc renders with zone coloring when zones provided
- [ ] Needle animates smoothly to target angle

## Export
- [ ] GaugeChart added to `charts/index.ts`
- [ ] GaugeChart added to `src/index.ts`

## Storybook
- [ ] Basic story renders (single value)
- [ ] Colored zones story renders (green/yellow/red)
- [ ] Animated value change story works
- [ ] Custom min/max range story renders
- [ ] Without title story renders
- [ ] Multiple gauges side by side story renders
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
