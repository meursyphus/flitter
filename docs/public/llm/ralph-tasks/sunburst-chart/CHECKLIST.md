# Sunburst Chart — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve (no broken `@headless/`, `@shared/`, `@styles/` paths)

## Headless (move from _todo)
- [ ] `headless/_todo/sunburst-chart/` moved to `headless/sunburst-chart/`
- [ ] HeadlessSunburstChart exported from `headless/index.ts`
- [ ] All 7 slots typed in `types.ts` (layout, sunburst, segment, legend, legendItem, title)
- [ ] Provider works via `Provider.of(context)`
- [ ] `chart.ts` builds component tree (Layout, Sunburst, Segments, Legend)
- [ ] Flat segment list computed correctly from hierarchical root node
- [ ] Angle calculations proportional to values within each parent
- [ ] Depth-based color assignment works for nodes without explicit color

## Styled Layer (new)
- [ ] `charts/sunburst-chart/` directory created
- [ ] `charts/sunburst-chart/index.ts` exports `SunburstChart()` factory function
- [ ] `charts/sunburst-chart/base/index.ts` provides structural defaults for all 7 slots
- [ ] `charts/sunburst-chart/styles/toast/index.ts` exports `toastStyleConfig`
- [ ] `charts/sunburst-chart/styles/toast/config.ts` defines `ToastSunburstChartConfig` extending `ToastBaseConfig`
- [ ] `charts/sunburst-chart/styles/toast/parts/` has segment rendering part
- [ ] Toast preset works with default config (no user config required)
- [ ] Custom slot override works (partial override merges correctly)
- [ ] Arc segments render at correct angles and depths
- [ ] Colors lighten with increasing depth

## Export
- [ ] SunburstChart added to `charts/index.ts`
- [ ] SunburstChart added to `src/index.ts`

## Storybook
- [ ] Basic story renders (organization hierarchy)
- [ ] Deep hierarchy (4+ levels) story renders
- [ ] Custom colors per branch story renders
- [ ] Hover interaction story works (path display)
- [ ] Drill-down interaction story works
- [ ] Many segments (50+) story renders
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
