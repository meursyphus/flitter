# Interaction And Hit Testing

Hover, selection, and tooltip behavior come from explicit hit-testing widgets and shared state.

Generated: 2026-03-30

## Key Points

- Use GestureDetector for hover and click behavior.
- Use Tooltip and ZIndex when focus detail must float above chart content.
- Coordinate interaction state through providers when multiple marks must respond together.

## Source Paths

- `packages/core/src/component/GestureDetector.ts`
- `packages/core/src/component/Tooltip.ts`
- `packages/core/src/component/ZIndex.ts`
- `docs/src/app/advanced/widgets/gesture-detector/page.mdx`
- `docs/src/app/advanced/widgets/tooltip/page.mdx`
