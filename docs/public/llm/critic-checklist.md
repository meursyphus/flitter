# Critic Checklist

This file is internal.

Use it when reviewing whether the docs are strong enough for prompt-only generation.

## Critic questions

### Structure critic

- Would the agent know the data structure before picking a chart name?
- Would it still succeed if the chart is not in the current headless set?

### UX critic

- Would the agent remember hover, filtering, dense-label fallback, and interaction state?
- Would it avoid shipping a static chart when the prompt implies inspection UX?

### Semantics critic

- Is the selected chart faithful to the reading task?
- Did the docs prevent a pretty but semantically wrong fallback?

### Implementation critic

- Would the agent know which `flitter-ui` primitives to combine?
- Would it know when to use `CustomPaint` versus layout widgets?

### Reference critic

- Are the chart-package files treated as reference only, not as mandatory consumption APIs?
- Is the reusable cartesian subset easy to find?

### Scope critic

- Can the docs handle standard charts?
- Can the docs handle custom composed visualizations?
- Can the docs handle beyond-headless charts honestly?

## Pass condition

The docs pass only if the agent can:

1. parse the request correctly
2. choose or design the right structure
3. build it directly with `flitter-ui`
4. add the required UX
5. avoid fake packaged APIs
