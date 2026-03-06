# Ridgeline Chart — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve

## Headless
- [ ] HeadlessRidgelineChart exported from flitter-chart/headless
- [ ] All 10 slots typed and documented
- [ ] Controller has hoverRidge/unhoverRidge methods
- [ ] Controller has setOverlap
- [ ] Controller has setSize
- [ ] Density computation produces smooth curves from raw values
- [ ] Shared x-scale across all ridges

## Styled Layer
- [ ] Toast preset works with default config
- [ ] Custom slot override works (partial override)
- [ ] ridge.colors config applied correctly
- [ ] ridge.fillOpacity config applied correctly
- [ ] ridge.strokeWidth config applied correctly
- [ ] overlap config applied correctly

## Storybook
- [ ] Basic story renders
- [ ] Many distributions story renders
- [ ] Variable overlap story renders
- [ ] With ridge labels story renders
- [ ] Custom slot override story exists
- [ ] Interactive story (hover/tooltip) works
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
