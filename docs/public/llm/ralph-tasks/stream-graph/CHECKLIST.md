# Stream Graph — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve

## Headless
- [ ] HeadlessStreamGraph exported from flitter-chart/headless
- [ ] All 9 slots typed and documented
- [ ] Controller has hoverLayer/unhoverLayer methods
- [ ] Controller has toggleSeries
- [ ] Controller has setBaseline (wiggle/silhouette/expand/zero)
- [ ] Controller has setSize
- [ ] Baseline algorithms correctly compute layer offsets
- [ ] Smooth interpolation produces organic curves

## Styled Layer
- [ ] Toast preset works with default config
- [ ] Custom slot override works (partial override)
- [ ] layer.colors config applied correctly
- [ ] layer.opacity config applied correctly
- [ ] layer.strokeWidth config applied correctly

## Storybook
- [ ] Basic story renders
- [ ] Different baseline algorithms story renders
- [ ] Many layers story renders
- [ ] With layer labels story renders
- [ ] Custom slot override story exists
- [ ] Interactive story (hover/tooltip) works
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
