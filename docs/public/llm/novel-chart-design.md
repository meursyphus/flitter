# Novel Chart Design

Use this file when the prompt describes a chart-like visualization that does not map cleanly to a standard named chart.

## Design method

Do not start by asking "what chart is this?"

Start by asking:

1. what is the data structure?
2. what is the reading task?
3. what must be compared?
4. what must be discovered on hover or interaction?
5. what visual grammar best matches the reading task?

## Break the request into five parts

### 1. Data model

Possible forms:

- categories + values
- ordered sequence
- matrix
- graph or flow
- hierarchy
- events over time

### 2. Spatial model

Possible structures:

- cartesian
- radial
- matrix
- free-positioned nodes
- nested rectangles
- stepwise sequence

### 3. Mark model

Possible marks:

- bars
- points
- lines
- filled areas
- cells
- slices
- rectangles
- links
- connectors

### 4. Interaction model

Possible needs:

- hover tooltip
- filter
- compare
- expand or collapse
- selection
- annotation reveal

### 5. Layout model

Possible composition:

- single chart
- small multiples
- dashboard stack
- chart plus legend and narrative

## Reuse strategy

When designing a novel chart, reuse in this order:

1. `flitter-ui` primitives
2. cartesian skeleton pieces from `packages/chart/src/shared/cartesian`
3. scale logic from shared utils
4. slot boundary ideas from headless or `_todo` types
5. preset ideas only if they help, never as a hard constraint

## Good outputs for novel requests

A good result does not need a library-style chart name.

It does need:

- clear semantics
- stable layout
- readable interaction
- explicit scale or geometry logic

## Bad outputs

- forcing a novel request into the wrong standard chart name
- inventing a fake packaged chart API
- copying a preset look that fights the requested semantics
- adding excessive abstraction before the shape is proven
