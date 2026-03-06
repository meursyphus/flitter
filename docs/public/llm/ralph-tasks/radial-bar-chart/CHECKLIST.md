# Radial Bar Chart — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve

## Headless
- [ ] HeadlessRadialBarChart exported from flitter-chart/headless
- [ ] All 11 slots typed and documented
- [ ] Controller has hoverBar/unhoverBar methods
- [ ] Controller has toggleSeries
- [ ] Controller has setSize
- [ ] Controller has setInnerRadius
- [ ] Arc angles correctly computed from data
- [ ] Radial scale correctly maps values to radius

## Styled Layer
- [ ] Toast preset works with default config
- [ ] Custom slot override works (partial override)
- [ ] bar.cornerRadius config applied correctly
- [ ] bar.gap config applied correctly
- [ ] bar.colors config applied correctly
- [ ] axis.color config applied correctly

## Storybook
- [ ] Basic story renders
- [ ] Multi-series story renders
- [ ] With data labels story renders
- [ ] Custom inner radius story renders
- [ ] Custom slot override story exists
- [ ] Interactive story (hover/tooltip) works
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
