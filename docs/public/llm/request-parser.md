# Request Parser

Use this file before choosing a chart.

The agent should first parse the request into a structured brief.

## Extract these fields

### 1. Reading goal

What is the user actually trying to understand?

Examples:

- compare categories
- see change over time
- inspect contribution
- inspect relationship
- inspect flow
- inspect hierarchy
- inspect profile across dimensions

### 2. Data structure

Which shape is implied?

- categories + values
- ordered sequence
- matrix
- hierarchy
- graph or flow
- custom composed view

### 3. Mark semantics

What visual unit carries meaning?

- bar
- point
- line
- area
- cell
- slice
- node and link
- block and annotation

### 4. Interaction requirements

What must the user be able to do?

- hover
- filter
- select
- compare dense values
- reveal full labels
- focus one series

### 5. Complexity flags

Look for these explicitly:

- negative values
- stacking
- long labels
- many categories
- overlays
- thresholds
- multi-panel composition
- unsupported standard chart

### 6. Visual tone

Examples:

- soft
- analytical
- executive
- playful
- minimal

### 7. Data availability

One of:

- exact data provided
- partial data provided
- no data provided, must synthesize mock data

## Result format the agent should build mentally

```ts
type ChartBrief = {
  goal: string;
  structure: "cartesian" | "radial" | "matrix" | "flow" | "hierarchy" | "composed";
  likelyFamilies: string[];
  interaction: string[];
  complexity: string[];
  tone: string | null;
  dataMode: "provided" | "partial" | "mock";
};
```

The agent does not need to print this structure.
It should use it internally before writing code.

## Example

Prompt:

`Show traffic source share changed across the year, keep it soft, and make hover details important.`

Parsed brief:

- goal: composition over time
- structure: cartesian
- likely families: `StackedAreaChart` logic
- interaction: hover tooltip
- complexity: stacking
- tone: soft
- dataMode: mock if no numbers are supplied

## Why this matters

If the request is parsed poorly, the wrong chart can still look plausible.
Correct parsing is the first defense against pretty but semantically wrong output.
