# Complex Recipe

`SankeyChart` is the canonical example for a chart where controller-owned layout matters.

## Why this chart matters

- controller computes node and link layout
- chart composes node, link, and label widgets
- the visual layer only renders shapes

```ts
import { Headless } from "flitter-chart";
import { Container, Stack, Positioned } from "flitter-core";

const custom = {
  layout: ({ sankey }) => Container({ child: sankey }),
  title: () => Container({ width: 0, height: 0 }),
  sankey: ({ nodes, links, nodeLabels }) =>
    Stack({
      children: [...links, ...nodes, ...nodeLabels],
    }),
  node: ({ x, y, width, height, color }) =>
    Positioned({
      left: x,
      top: y,
      width,
      height,
      child: Container({ color }),
    }),
  link: () => Container({}),
  nodeLabel: () => Container({}),
};

Headless.SankeyChart({
  data: {
    nodes: [
      { id: "A" },
      { id: "B" },
      { id: "C" },
    ],
    links: [
      { source: "A", target: "B", value: 10 },
      { source: "B", target: "C", value: 6 },
    ],
  },
  custom,
});
```

Use the same controller-first approach for:

- `TreemapChart`
- `SunburstChart`
