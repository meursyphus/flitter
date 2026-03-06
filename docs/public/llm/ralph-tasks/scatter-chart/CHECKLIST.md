# Scatter Chart — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve

## Headless
- [ ] HeadlessScatterChart exported from flitter-chart/headless
- [ ] All 18 slots typed and documented
- [ ] Controller has hoverPoint/unhoverPoint methods
- [ ] Controller has toggleSeries
- [ ] Scale auto-detection works (min/max/step inferred from data when not provided)
- [ ] Both x and y axes are numeric (not categorical)

## Styled Layer
- [ ] Toast preset works with default config
- [ ] AG preset works
- [ ] Custom slot override works (partial override)
- [ ] scatter.size config applied correctly
- [ ] scatter.fill config applied correctly (toast: outline by default)
- [ ] scatter.strokeWidth config applied correctly
- [ ] 4 shapes (circle, square, triangle, star) cycle per dataset in toast

## Storybook
- [ ] Basic story renders
- [ ] Multi-series story renders with shape differentiation
- [ ] Interactive story (hover/tooltip) works
- [ ] Custom slot override story exists
- [ ] Dense data story renders without performance issues
- [ ] With labels story shows point labels
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
