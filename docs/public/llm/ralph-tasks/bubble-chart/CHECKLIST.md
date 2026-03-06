# Bubble Chart — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve

## Headless
- [ ] HeadlessBubbleChart exported from flitter-chart/headless
- [ ] All 18 slots typed and documented
- [ ] Controller has hoverPoint/unhoverPoint methods
- [ ] Controller has toggleSeries
- [ ] Scale auto-detection works for x, y, and value dimensions
- [ ] Both x and y axes are numeric (not categorical)
- [ ] Value-to-radius mapping is correct (linear between minRadius and maxRadius)

## Styled Layer
- [ ] Toast preset works with default config
- [ ] AG preset works
- [ ] Custom slot override works (partial override)
- [ ] bubble.minRadius config applied correctly
- [ ] bubble.maxRadius config applied correctly
- [ ] bubble.opacity config applied correctly
- [ ] Bubble size correctly reflects value dimension

## Storybook
- [ ] Basic story renders
- [ ] Multi-series story renders
- [ ] Interactive story (hover/tooltip) works
- [ ] Custom slot override story exists
- [ ] Dense data story renders without performance issues
- [ ] With labels story shows point labels
- [ ] Size range demonstration story shows min/max radius mapping
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
