# Core Concepts For Chart Authoring

Generated: 2026-04-08

Use these when presets stop being enough or when you need to compose novel chart experiences directly with Flitter primitives.

## Composition And Layout

Most chart shells are built from standard layout widgets before any custom painting happens.

Doc: `/llm/core/concepts/composition-layout.md`

## Provider And Controller State

Headless charts rely on controllers plus providers rather than local ad hoc state.

Doc: `/llm/core/concepts/provider-controller-state.md`

## Animation Primitives

Chart motion is built from explicit animation controllers, tweens, and animated widgets.

Doc: `/llm/core/concepts/animation-primitives.md`

## Custom Paint And Geometry

Arc, path, link, and other bespoke marks should be painted directly when widgets are not enough.

Doc: `/llm/core/concepts/custom-paint-geometry.md`

## Interaction And Hit Testing

Hover, selection, and tooltip behavior come from explicit hit-testing widgets and shared state.

Doc: `/llm/core/concepts/interaction-and-hit-testing.md`

## Novel Chart Decision

Leave preset land only after proving that the canonical families cannot answer the prompt honestly.

Doc: `/llm/core/concepts/novel-chart-decision.md`
