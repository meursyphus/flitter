# Timeline Chart — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve

## Headless
- [ ] HeadlessTimelineChart exported from flitter-chart/headless
- [ ] All 12 slots typed and documented
- [ ] Controller has hoverEvent/unhoverEvent methods
- [ ] Controller has setTimeRange
- [ ] Controller has toggleGroup
- [ ] Controller has setSize
- [ ] Controller has setOrientation (horizontal/vertical)
- [ ] Time scale correctly maps Date objects to pixel positions
- [ ] Alternating label positioning avoids overlap

## Styled Layer
- [ ] Toast preset works with default config
- [ ] Custom slot override works (partial override)
- [ ] marker.radius config applied correctly
- [ ] marker.colors config applied correctly
- [ ] connector.strokeWidth config applied correctly
- [ ] label.fontSize config applied correctly
- [ ] label.maxWidth config applied correctly

## Storybook
- [ ] Basic story renders
- [ ] Grouped events story renders
- [ ] Dense timeline story renders
- [ ] Vertical orientation story renders
- [ ] Custom slot override story exists
- [ ] Interactive story (hover/tooltip) works
- [ ] Zoom/scroll story works
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
