# Bullet Chart — Ralph Validation Checklist

## Build
- [ ] `tsc --noEmit` passes
- [ ] All imports resolve

## Headless
- [ ] HeadlessBulletChart exported from flitter-chart/headless
- [ ] All 8 slots typed and documented
- [ ] Controller has hoverBullet/unhoverBullet methods
- [ ] Controller has setSize
- [ ] Scale correctly maps values to pixel positions
- [ ] Ranges rendered in correct order (largest first)

## Styled Layer
- [ ] Toast preset works with default config
- [ ] Custom slot override works (partial override)
- [ ] actualBar.color config applied correctly
- [ ] actualBar.height config applied correctly
- [ ] targetMarker.color config applied correctly
- [ ] ranges.colors config applied correctly

## Storybook
- [ ] Basic story renders
- [ ] Multiple bullets story renders
- [ ] Custom ranges and colors story renders
- [ ] With value labels story renders
- [ ] Custom slot override story exists
- [ ] Interactive story (hover/tooltip) works
- [ ] Playwright screenshot passes (non-empty render)

## LLM Generation
- [ ] LLM can generate this chart from prompt
- [ ] LLM uses headless slots, not rebuild from scratch
- [ ] LLM handles missing data gracefully (mock data)
