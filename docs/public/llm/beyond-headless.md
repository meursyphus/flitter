# Beyond Headless

Use this file when the requested chart is not cleanly covered by the current headless chart set.

## Primary rule

`packages/chart/src/headless` is not the boundary of what the agent may build.

It is only:

- one set of existing reference implementations
- one vocabulary for reusable slot boundaries
- one source of layout and scale ideas

If a chart is not defined there, the agent should still ask:

- can the semantics be built from `flitter-ui` primitives?
- can chart-package logic be partially extracted?
- what is the minimal structure needed to express the requested chart honestly?

## Three categories

### Category 1: fully covered by current headless references

Examples:

- bar
- stacked bar
- line
- area
- stacked area
- scatter
- bubble
- pie
- radar
- heatmap

### Category 2: partially covered by `_todo` or legacy references

Examples:

- waterfall
- treemap
- sankey
- funnel
- gauge
- sunburst
- candlestick
- box plot

For these, the current branch may still give:

- data shapes
- slot names
- rough layout ideas
- legacy examples

But the final chart may need to be rebuilt directly with core primitives.

### Category 3: not present as a chart-package concept

Examples:

- a hybrid analytic panel
- a custom process diagram with chart semantics
- a radial progress comparison with annotations
- a bespoke scorecard view

These should be designed from first principles.

## Reference sources for beyond-headless work

### Legacy chart stories

- `dev/chart-storybook/src/stories/legacy/WaterfallChart.stories.tsx`
- `dev/chart-storybook/src/stories/legacy/TreemapChart.stories.tsx`
- `dev/chart-storybook/src/stories/legacy/SankeyChart.stories.tsx`
- other files in `dev/chart-storybook/src/stories/legacy/`

### `_todo` headless type references

- `packages/chart/src/headless/_todo/waterfall-chart/types.ts`
- `packages/chart/src/headless/_todo/treemap-chart/types.ts`
- `packages/chart/src/headless/_todo/sankey-chart/types.ts`
- related `_todo` chart type files

## How to work when no finished chart exists

1. Extract the semantic data shape.
2. Identify the minimum visual grammar.
3. Choose the main primitive composition.
4. Add interaction only after the static structure is correct.
5. Keep the chart honest to the requested semantics.

## Examples

### Waterfall

Semantics:

- running cumulative contribution
- increase, decrease, and total states

Useful references:

- `packages/chart/src/headless/_todo/waterfall-chart/types.ts`

Build pattern:

- cartesian skeleton
- bars aligned to cumulative baseline
- connector lines between steps

### Treemap

Semantics:

- area proportional to value
- nested or flat rectangles

Useful references:

- `packages/chart/src/headless/_todo/treemap-chart/types.ts`

Build pattern:

- rectangle layout algorithm
- `Stack` or positioned rectangles
- text labels clipped or conditionally shown

### Sankey

Semantics:

- directional flow between nodes
- link width proportional to value

Useful references:

- `packages/chart/src/headless/_todo/sankey-chart/types.ts`

Build pattern:

- positioned node rectangles
- curved or polygon links via `CustomPaint`
- link hover and label focus

## Safety rule

Do not pretend a chart is supported just because a `_todo` or legacy file exists.

The correct stance is:

- semantics supported by core construction: yes
- ready-made public chart API: maybe not
