# Advanced Patterns

Use this file when the prompt implies a more complex visualization than a basic chart example.

## Think in patterns, not only in chart names

Complex requests are usually built from a combination of:

- one structural family
- one or more interaction patterns
- one or more complexity patterns

If a request still does not fit, continue with:

- `beyond-headless.md`
- `novel-chart-design.md`

## Common complexity patterns

### Negative values

Needed for:

- profit and loss
- deltas
- contribution above and below baseline

Pattern:

- baseline at zero
- positive and negative space split explicitly
- bars or marks align differently above and below zero

Best reference:

- `packages/chart/src/charts/bar-chart/base/bar-group.ts`

### Stacking

Needed for:

- composition inside each category
- share over time

Pattern:

- accumulate previous series
- preserve reading order
- ensure tooltip can still resolve per segment

### Overlay layers

Needed for:

- grid behind marks
- annotations above marks
- highlight or hover layer
- threshold line or benchmark line

Pattern:

- `Stack`
- separate background, data, and overlay layers

### Derived scales

Needed for:

- multiple densities
- unusual ranges
- compressed or expanded ticks

Pattern:

- separate raw data domain from rendered scale domain
- snap ticks to readable values

Best reference:

- `packages/chart/src/shared/cartesian/getScale.ts`
- `packages/chart/src/shared/utils/scale.ts`

### Small multiples

Needed for:

- compare many similar series without overloading one chart

Pattern:

- repeated chart skeleton
- shared style tokens
- optionally shared scale

### Dashboard composition

Needed for:

- one prompt describing several related views

Pattern:

- break into cards or panels
- keep each panel structurally simple
- share data language and visual tokens

## Unsupported but possible with core

Because the target is `flitter-ui`, some advanced visuals may still be hand-built even if `packages/chart` does not expose a ready-made public API.

That does not mean you should improvise recklessly.

Use this rule:

- if the structure is understandable and can be built from core primitives, you may build it directly
- if the semantics are unclear, do not fake a known chart family

## Escalation rule

When a prompt sounds advanced, classify it on three axes:

1. structure
2. interaction
3. complexity

That is usually more reliable than reaching for a chart name first.
