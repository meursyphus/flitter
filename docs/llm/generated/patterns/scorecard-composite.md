# Scorecard Composite Pattern

Build scorecard-like modules from chart parts plus direct Flitter primitives when no canned family fits.

Generated: 2026-04-08

## Use When

- The request sounds like ranked cards, thresholds, and hover detail
- Charts and dashboard modules must coexist tightly
- A canned family would force the wrong abstraction

## Build Path

- Use chart-presets only for sub-parts that still map to a real chart family.
- Use Container, Column, Row, Stack, Text, and GestureDetector for the shell.
- Treat the result as direct composition, not as a disguised preset chart.

## Related Charts

- `bar-chart`

## Source Paths

- `packages/core/src/component`
- `dev/llm-playground`
- `docs/public/llm/critic-checklist.md`
