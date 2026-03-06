# Sparkline Chart — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve

## Headless
- [ ] HeadlessSparklineChart exported from flitter-chart/headless
- [ ] All 4 slots typed and documented
- [ ] Controller has hoverPoint/unhoverPoint methods
- [ ] Controller has setSize
- [ ] Controller has setVariant (line/area/bar)
- [ ] Scale auto-fits to data range

## Styled Layer
- [ ] Toast preset works with default config
- [ ] Custom slot override works (partial override)
- [ ] line.color config applied correctly
- [ ] line.strokeWidth config applied correctly
- [ ] highlight.color config applied correctly

## Storybook
- [ ] Basic line story renders
- [ ] Area variant story renders
- [ ] Bar variant story renders
- [ ] Highlight points story renders
- [ ] Custom slot override story exists
- [ ] Inline context story renders
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
