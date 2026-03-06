# Interaction Patterns

Use this file when the requested chart includes UX behavior, not just static marks.

## Primary rule

Treat interaction as a first-class part of the chart design.

A chart request may imply:

- hover inspection
- tooltip disclosure
- legend filtering
- click selection
- focus state
- annotation reveal
- dense-label fallback

These are not afterthoughts.

## Core interaction primitives

- `GestureDetector`
- `Tooltip`
- `StatefulWidget`
- `State`
- `ChangeNotifier`
- `ChangeNotifierProvider`

## Most common chart UX patterns

### Hover tooltip

Use when:

- the chart is dense
- exact values matter
- labels would clutter the plot if always visible

Typical build:

- wrap a mark with `GestureDetector`
- toggle hover state
- render a `Tooltip` or overlay widget

Best references:

- `dev/storybook/src/stories/Tooltip/example/Basic.ts`
- `packages/chart/src/styles/toast/tooltip.ts`
- `packages/chart/src/styles/ag/tooltip.ts`

### Legend filtering

Use when:

- multiple series share one plot
- the user needs to focus one subset at a time

Typical build:

- keep visible legends in state
- rebuild data marks from visible series only
- update scale if hidden series affect domain

Best references:

- `packages/chart/src/headless/bar-chart/controller.ts`
- other chart controllers in `packages/chart/src/headless/*/controller.ts`

### Mark hover or selection

Use when:

- one bar, point, slice, or cell should be emphasized

Typical build:

- `GestureDetector` on each mark
- store hovered or selected key in state
- change opacity, stroke, z-index, or tooltip content

### Dense label fallback

Use when:

- there are too many labels to render clearly
- long labels would crush the layout

Typical fallback options:

- horizontal bars for rankings
- hide always-on labels and move values into tooltip
- abbreviate on-axis labels, keep full text in tooltip
- filter to top-N plus “other” only if the prompt allows aggregation

## Interaction design checklist

- What is inspect-on-demand versus always visible?
- What state changes when a mark is hovered or clicked?
- Does hiding a series require scale recalculation?
- Will labels remain readable at the requested density?

## Warning

Do not treat all complexity as a new chart type.

Often the right answer is:

- same chart structure
- stronger interaction layer
