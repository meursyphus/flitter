# Dumbbell Chart — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve

## Headless
- [ ] HeadlessDumbbellChart exported from flitter-chart/headless
- [ ] All 17 slots typed and documented
- [ ] Controller has hoverDumbbell/unhoverDumbbell methods
- [ ] Controller has setSize
- [ ] Connector correctly spans between two dot positions
- [ ] Gap calculation is correct (absolute difference)

## Styled Layer
- [ ] Toast preset works with default config
- [ ] Custom slot override works (partial override)
- [ ] connector.strokeWidth config applied correctly
- [ ] connector.color config applied correctly
- [ ] dot.radius config applied correctly
- [ ] dot.colors config applied correctly

## Storybook
- [ ] Basic story renders
- [ ] With gap labels story renders
- [ ] Sorted by gap story renders
- [ ] Custom colors story renders
- [ ] Custom slot override story exists
- [ ] Interactive story (hover/tooltip) works
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
