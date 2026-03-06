# Sankey Chart — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve (no broken `@headless/`, `@shared/`, `@styles/` paths)

## Headless (move from _todo)
- [ ] `headless/_todo/sankey-chart/` moved to `headless/sankey-chart/`
- [ ] HeadlessSankeyChart exported from `headless/index.ts`
- [ ] All 6 slots typed in `types.ts` (layout, sankey, node, link, nodeLabel, title)
- [ ] Provider (`SankeyChartConfigProvider`) works via `Provider.of(context)`
- [ ] `chart.ts` builds component tree (Layout, Sankey, Nodes, Links, NodeLabels)
- [ ] `compute-layout.ts` correctly positions nodes in columns and computes link paths
- [ ] Node heights proportional to their total flow value
- [ ] Link paths connect correct source/target positions

## Styled Layer (new)
- [ ] `charts/sankey-chart/` directory created
- [ ] `charts/sankey-chart/index.ts` exports `SankeyChart()` factory function
- [ ] `charts/sankey-chart/base/index.ts` provides structural defaults for all 6 slots
- [ ] `charts/sankey-chart/styles/toast/index.ts` exports `toastStyleConfig`
- [ ] `charts/sankey-chart/styles/toast/config.ts` defines `ToastSankeyChartConfig` extending `ToastBaseConfig`
- [ ] `charts/sankey-chart/styles/toast/parts/` has node, link, nodeLabel parts
- [ ] Toast preset works with default config (no user config required)
- [ ] Custom slot override works (partial override merges correctly)
- [ ] Links render as curved bezier paths with proportional width
- [ ] Links inherit source node color with reduced opacity

## Export
- [ ] SankeyChart added to `charts/index.ts`
- [ ] SankeyChart added to `src/index.ts`

## Storybook
- [ ] Basic story renders (energy flow)
- [ ] Multi-column (3+ levels) story renders
- [ ] Custom node colors story renders
- [ ] Hover interaction story works (node and link highlighting)
- [ ] Dense connections story renders
- [ ] Single source to many targets story renders
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
