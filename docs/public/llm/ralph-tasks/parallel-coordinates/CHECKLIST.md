# Parallel Coordinates — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve

## Headless
- [ ] HeadlessParallelCoordinates exported from flitter-chart/headless
- [ ] All 10 slots typed and documented
- [ ] Controller has hoverLine/unhoverLine methods
- [ ] Controller has brushAxis/clearBrush methods
- [ ] Controller has toggleGroup
- [ ] Controller has setSize
- [ ] Each axis has independent scale (min/max)
- [ ] Brush filtering correctly filters items across axes

## Styled Layer
- [ ] Toast preset works with default config
- [ ] Custom slot override works (partial override)
- [ ] line.strokeWidth config applied correctly
- [ ] line.opacity config applied correctly
- [ ] line.colors config applied correctly
- [ ] brush.color config applied correctly

## Storybook
- [ ] Basic story renders
- [ ] Grouped data story renders
- [ ] Axis brushing story renders
- [ ] Multi-brush filtering story renders
- [ ] Custom slot override story exists
- [ ] Interactive story (hover/tooltip) works
- [ ] Large dataset story renders
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
