# Authoring Rules

These rules are optimized for generating charts quickly and correctly in this repo.

## Primary workflow

1. Read the user request.
2. Choose the nearest supported chart type.
3. Find the nearest Storybook story.
4. Copy the pattern, then replace only the data and config you need.
5. Validate in Storybook before polishing the prompt guide.

For most chart requests, the desired output is runnable code, not a menu of options.
If the intent is sufficiently clear, generate the chart immediately.

## Default assumptions

- Default renderer: `svg`
- Default style: `toast`
- Default target for experiments: `dev/chart-storybook/src/stories/`
- Default behavior when style is unspecified: use `toast`
- Default behavior when the user wants executive or enterprise visuals: use `ag`

## Data handling

- If the user provides exact numbers, preserve them exactly.
- If the user provides categories and trends but no numbers, synthesize a small illustrative dataset.
- If the user gives only a vague topic, choose a sensible demo dataset and label it as illustrative or mock.
- Keep dataset lengths aligned with label lengths.
- For `HeatmapChart`, remember that `values` is a two-dimensional matrix indexed as `[yIndex][xIndex]`.

## Repo-specific import rules

### Final output path

```tsx
import Widget from "@flitterjs/react";
import {
  Container,
  Row,
  Column,
  Stack,
  Positioned,
  Text,
  CustomPaint,
  LayoutBuilder,
} from "flitter-ui";
```

### Reference-only path

- `packages/chart/src`
- `dev/chart-storybook/src/stories`

Use those to study logic and structure, not as the default import target.

## How to choose style

Use `toast` when the request sounds like:

- friendly
- soft
- colorful
- product demo
- default

Use `ag` when the request sounds like:

- dashboard
- enterprise
- muted
- analytical
- business presentation

## Do not over-engineer

- Do not build a generic chart abstraction layer.
- Do not add reusable wrappers unless the user explicitly asks for them.
- Do not redesign the library API.
- Do not turn a one-off example into a framework.
- Do not make the agent think harder than necessary when an existing story already solves 80 percent of the task.

The repo is being used as a chart-generation reference more than as a polished reusable package surface.

## Avoid unsupported claims

Do not assume support for:

- mixed charts
- combo charts
- dual-axis charts
- treemap
- sankey
- sunburst
- gauge
- candlestick
- waterfall
- box plot

Those areas appear in `_todo` or legacy files, but they are not the first-path APIs for current chart generation unless you verify otherwise on the current branch.

## Config discipline

- Only use config keys you can confirm from Storybook, chart config files, or current docs data.
- Prefer simple `title`, `legend`, chart-specific, and `animation` config sections.
- Do not invent extra nested config objects.

## Branch discipline

- Prefer the branch you were explicitly pointed at.
- If the user says "look at the repo" or "look at the branch", inspect the current checked-out branch instead of assuming `main`.

## When to ask a follow-up

Ask only if the request is blocked by a missing semantic choice you cannot safely infer.

Examples:

- The user says "make it match our AG-style dashboard" and there are two competing house styles in the branch.
- The user provides a matrix but does not say whether rows or columns are categories, and both interpretations are plausible.

In most other cases, choose a reasonable default and proceed.
