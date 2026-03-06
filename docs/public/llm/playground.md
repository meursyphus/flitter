# Playground Workflow

The chart playground already exists in this repo as Storybook.

## Command

```bash
pnpm chart-story:dev
```

Expected local port: `6007`

## Where to work

Use `dev/chart-storybook/src/stories/`.

This folder already contains the nearest templates for:

- `BarChart.stories.tsx`
- `BarChart.ag.stories.tsx`
- `LineChart.stories.tsx`
- `LineChart.ag.stories.tsx`
- `AreaChart.stories.tsx`
- `AreaChart.ag.stories.tsx`
- `StackedBarChart.stories.tsx`
- `StackedBarChart.ag.stories.tsx`
- `StackedAreaChart.stories.tsx`
- `StackedAreaChart.ag.stories.tsx`
- `ScatterChart.stories.tsx`
- `ScatterChart.ag.stories.tsx`
- `BubbleChart.stories.tsx`
- `BubbleChart.ag.stories.tsx`
- `PieChart.stories.tsx`
- `RadarChart.stories.tsx`
- `HeatmapChart.stories.tsx`

## Recommended edit loop

1. Pick the closest story file.
2. Duplicate the story pattern or add another `export const ...` story in the same file.
3. Change only the data, title, style-specific config, and direction.
4. Verify it in Storybook with `renderer: "svg"` first.
5. Verify `renderer: "canvas"` only after the SVG version is right.

## What counts as a good local test

- The chart matches the user request semantically.
- The data shape matches the selected chart API.
- The title, legend, and style match the intent.
- Negative values, stacking, or bubble sizing behave as expected.
- No made-up config keys were introduced.

## Golden reference stories

Use `Charts/LLMEvaluation` as the first-pass golden suite for complex cases.

It is intended to answer:

- did the agent pick the right chart family
- did it pick the right style
- did it choose the right orientation
- did it preserve tricky data semantics such as negative stacking or matrix orientation

## Preferred file strategy

- For quick experiments, modify the nearest existing story.
- For prompt-based evaluation, add a clearly named story export near the closest existing chart file.
- Avoid creating a new abstraction layer just for a test.

## Docs cross-check

If you want to compare with public documentation snippets, read:

- `docs/src/app/chart/_data/`

If Storybook and docs snippets disagree, trust Storybook and the package source.
