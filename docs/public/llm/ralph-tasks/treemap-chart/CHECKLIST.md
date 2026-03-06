# Treemap Chart — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve (no broken `@headless/`, `@shared/`, `@styles/` paths)

## Headless (move from _todo)
- [ ] `headless/_todo/treemap-chart/` moved to `headless/treemap-chart/`
- [ ] HeadlessTreemapChart exported from `headless/index.ts`
- [ ] All 6 slots typed in `types.ts` (layout, treemap, node, legend, title + controller generics)
- [ ] `TreemapController` extends `ChangeNotifier` with hover, visibility, and layout state
- [ ] Provider works via `Provider.of(context)`
- [ ] `squarify.ts` algorithm produces correct rectangular packing
- [ ] `controller.ts` recalculates layouts on size change or series toggle
- [ ] `visibleData` correctly filters hidden nodes

## Styled Layer (new)
- [ ] `charts/treemap-chart/` directory created
- [ ] `charts/treemap-chart/index.ts` exports `TreemapChart()` factory function
- [ ] `charts/treemap-chart/base/index.ts` provides structural defaults for all slots
- [ ] `charts/treemap-chart/styles/toast/index.ts` exports `toastStyleConfig`
- [ ] `charts/treemap-chart/styles/toast/config.ts` defines `ToastTreemapChartConfig` extending `ToastBaseConfig`
- [ ] `charts/treemap-chart/styles/toast/parts/` has node rendering part
- [ ] Toast preset works with default config (no user config required)
- [ ] Custom slot override works (partial override merges correctly)
- [ ] Node colors assigned from palette or data
- [ ] Node labels render inside rectangles when space permits

## Export
- [ ] TreemapChart added to `charts/index.ts`
- [ ] TreemapChart added to `src/index.ts`

## Storybook
- [ ] Basic story renders (portfolio allocation)
- [ ] Custom colors story renders
- [ ] Many nodes (20+) story renders without overlap
- [ ] Legend filtering story works
- [ ] Hover with tooltip story works
- [ ] Small values handling story renders
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
