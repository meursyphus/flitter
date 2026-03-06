# Progress Chart — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve

## Headless
- [ ] HeadlessProgressChart exported from flitter-chart/headless
- [ ] All 7 slots typed and documented
- [ ] Controller has setValue (animated)
- [ ] Controller has setMax
- [ ] Controller has setSize
- [ ] Fraction correctly computed as value/max
- [ ] Arc angles correctly map fraction to sweep

## Styled Layer
- [ ] Toast preset works with default config
- [ ] Custom slot override works (partial override)
- [ ] track.color config applied correctly
- [ ] track.strokeWidth config applied correctly
- [ ] fill.color config applied correctly
- [ ] fill.lineCap config applied correctly
- [ ] valueLabel.fontSize config applied correctly

## Storybook
- [ ] Basic story renders
- [ ] Percentage label story renders
- [ ] Color thresholds story renders
- [ ] Multiple nested rings story renders
- [ ] Animated value change story renders
- [ ] Custom slot override story exists
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
