# Flitter

High-quality open-source rendering libraries for web developers. Flutter's widget composition model, reimagined for the web.

**Docs & Gallery** → [ui.flitter.dev](https://ui.flitter.dev)

## Libraries

### Chart `stable`

Widget-composable chart library. 10+ chart types, multiple styles. Add with a CLI command — source code lands in your project.

```bash
npx flitter-ui init
npx flitter-ui add bar-chart
```

Every axis, bar, tooltip, and legend is a widget. Swap any piece of the tree — no config API to fight.

### Diagram `coming soon`

Interactive diagram library built on the same widget composition engine. ERD, flowchart, and more.

## Why Flitter

This is not a chart config wrapper. It's a rendering engine.

- **Widget Composition** — Charts are trees of widgets (Container, Stack, Positioned, Text), not opaque config objects. Swap any part.
- **Source Code You Own** — `npx flitter-ui add` drops full source into your project. No hidden internals. Read it, change it, learn from it.
- **Framework Agnostic** — Pure JavaScript core. Works standalone, or plug into React or Svelte with a one-line integration.
- **LLM Native** — Feed `ui.flitter.dev/llm/chart.md` to your AI assistant and let it generate charts for you.

## Quick Start

```bash
# 1. Initialize
npx flitter init

# 2. Add a chart
npx flitter-ui add bar-chart

# 3. Use in React
```

```tsx
import Widget from "@flitterjs/react";
import BarChart from "./charts/bar-chart";

const chart = BarChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [{ legend: "Revenue", values: [40, 65, 50, 80] }],
  },
});

export default function App() {
  return <Widget widget={chart} width="600px" height="400px" />;
}
```

## Framework Support

| Framework | Package | Status |
|-----------|---------|--------|
| React | `@flitterjs/react` | Stable |
| Svelte | `@flitterjs/svelte` | Stable |
| Vanilla JS | `flitter-ui` | Stable |
| Vue | — | Coming soon |

## Contributing

Flitter is open source. Bug reports, feature suggestions, and pull requests are welcome.

- [Discord](https://discord.gg/kUZp4SaHzF)
- [GitHub Issues](https://github.com/meursyphus/flitter/issues)

## License

MIT
