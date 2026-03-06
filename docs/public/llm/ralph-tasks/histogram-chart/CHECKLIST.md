# Histogram Chart — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve

## Headless
- [ ] HeadlessHistogramChart exported from flitter-chart/headless
- [ ] All 19 slots typed and documented
- [ ] Controller has hoverBin/unhoverBin methods
- [ ] Controller has setBinCount
- [ ] Controller has setSize
- [ ] Bin computation correctly buckets values into ranges
- [ ] Frequency scale auto-adjusts to max bin count

## Styled Layer
- [ ] Toast preset works with default config
- [ ] Custom slot override works (partial override)
- [ ] bin.gap config applied correctly
- [ ] bin.cornerRadius config applied correctly
- [ ] bin.color config applied correctly

## Storybook
- [ ] Basic story renders
- [ ] Custom bin count story renders
- [ ] Data labels story renders
- [ ] Dense data story renders without overlap
- [ ] Custom slot override story exists
- [ ] Interactive story (hover/tooltip) works
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
