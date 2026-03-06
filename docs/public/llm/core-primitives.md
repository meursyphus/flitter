# Core Primitives

Use this file when constructing charts directly with `flitter-ui`.

## Primary rule

The final chart should be assembled from primitives, not imported from a chart package.

## Most important primitives for chart construction

These are the most useful building blocks visible in the current codebase:

- `Container`
- `Row`
- `Column`
- `Flex`
- `Flexible`
- `Expanded`
- `Stack`
- `Positioned`
- `SizedBox`
- `Padding`
- `EdgeInsets`
- `Text`
- `TextStyle`
- `Alignment`
- `FractionallySizedBox`
- `LayoutBuilder`
- `DockLayout`
- `CustomPaint`
- `GestureDetector`
- `Tooltip`

## What each one is usually for

### Layout

- `Row`, `Column`, `Flex`, `Flexible`, `Expanded`
- use for legend lanes, grouped bars, axis label lanes, and outer scaffolding

### Plot composition

- `Stack`, `Positioned`, `DockLayout`
- use for grid behind data, overlays, axis assembly, and chart plot composition

### Visual blocks

- `Container`, `Padding`, `SizedBox`, `FractionallySizedBox`
- use for bars, spacing, labels, and normalized sizing

### Text

- `Text`, `TextStyle`
- use for title, axis labels, legend text, tooltips

### Rendering

- `CustomPaint`
- use when the mark is easier to paint than to compose from boxes

### Interaction

- `GestureDetector`, `Tooltip`
- use for hover, click, focus, and value inspection

## Best source files

- `dev/storybook/src/stories/CustomPaint/Widget.stories.tsx`
- `dev/storybook/src/stories/Flex/Widget.stories.tsx`
- `dev/storybook/src/stories/Stack/Stack.stories.tsx`
- `dev/storybook/src/stories/Tooltip/Widget.stories.tsx`
- `dev/storybook/src/stories/GestureDetector/Widget.stories.tsx`
- `dev/storybook/src/stories/Charts/ManualCartesianBar.stories.tsx`

## Read order for a new manual chart

1. `ManualCartesianBar.stories.tsx`
2. `Flex` story
3. `Stack` story
4. `CustomPaint` story if the mark needs drawing
5. chart-package reference files only after that
