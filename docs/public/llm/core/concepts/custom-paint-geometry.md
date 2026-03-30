# Custom Paint And Geometry

Arc, path, link, and other bespoke marks should be painted directly when widgets are not enough.

Generated: 2026-03-30

## Key Points

- Use CustomPaint for slices, arcs, links, and arbitrary vector shapes.
- Keep geometry data outside the painter when the same geometry must drive labels or interaction.
- Let controllers compute reusable layout and let painters render it.

## Source Paths

- `packages/core/src/component/CustomPaint.ts`
- `docs/src/app/advanced/widgets/custom-paint/page.mdx`
- `packages/chart/src/shared/utils`
