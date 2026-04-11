<p align="center">
  <img src="../../assets/readme/logo.png" alt="Flitter" width="80" />
</p>

<h1 align="center">flitter-ui</h1>

<p align="center">
  Core rendering engine + CLI for Flitter.<br/>
  Flutter's widget composition model, reimagined for JavaScript.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/flitter-ui"><img src="https://img.shields.io/npm/v/flitter-ui.svg" alt="npm version" /></a>
  <a href="https://github.com/meursyphus/flitter/blob/latest/LICENSE"><img src="https://img.shields.io/npm/l/flitter-ui.svg" alt="license" /></a>
</p>

<p align="center">
  <a href="https://ui.flitter.dev">Documentation</a> ·
  <a href="https://ui.flitter.dev/chart/">Chart Gallery</a> ·
  <a href="https://ui.flitter.dev/integration/">Framework Integration</a>
</p>

---

## Installation

```bash
npm install flitter-ui
```

## What's Inside

`flitter-ui` is the all-in-one package that bundles:

- **Rendering Engine** — declarative widget system with SVG and Canvas support
- **Chart Library** — 20+ chart types, two visual styles, fully composable
- **CLI** — shadcn-style `init` and `add` commands to scaffold charts into your project

## CLI Usage

```bash
# Initialize a Flitter project (creates flitter.json)
npx flitter-ui init

# Add a chart — full source code lands in your project
npx flitter-ui add bar-chart

# Choose a style variant
npx flitter-ui add bar-chart --style toast
npx flitter-ui add bar-chart --style ag
```

### Available Charts

Bar · Line · Area · Pie · Donut · Radar · Scatter · Bubble · Heatmap · Treemap · Stacked Bar · Stacked Area · Box Plot · Candlestick · Waterfall · Funnel · Histogram · Sankey · Sunburst · Bullet

## Standalone Usage (Vanilla JS)

```javascript
import { Container, Alignment, Text, TextStyle, AppRunner } from "flitter-ui";

document.querySelector("#app").innerHTML = `
  <div style="width: 600px; height: 400px" id="container">
    <svg style="width: 100%; height: 100%" id="view"></svg>
  </div>
`;

const app = new AppRunner({
  view: document.querySelector("#view"),
  window: window,
  document: document,
});

app.onMount({
  resizeTarget: document.querySelector("#container"),
});

app.runApp(
  Container({
    alignment: Alignment.center,
    color: "lightblue",
    child: Text("Hello, Flitter!", {
      style: new TextStyle({ fontSize: 24, fontWeight: "bold" }),
    }),
  })
);
```

Both SVG and Canvas renderers are supported — use `<svg>` or `<canvas>` as the view element.

## Framework Integrations

| Framework | Package | Install |
|-----------|---------|---------|
| React | [`@flitterjs/react`](https://www.npmjs.com/package/@flitterjs/react) | `npm install flitter-ui @flitterjs/react` |
| Svelte | [`@flitterjs/svelte`](https://www.npmjs.com/package/@flitterjs/svelte) | `npm install flitter-ui @flitterjs/svelte` |

## Widget API

Flitter provides Flutter-style widgets for building any visual structure:

`Container` · `Column` · `Row` · `Stack` · `Positioned` · `Text` · `SizedBox` · `Padding` · `Center` · `Align` · `Expanded` · `Flexible` · `FractionallySizedBox` · `GestureDetector` · `AnimatedContainer` · `Transform` · `Opacity` · `ClipRRect` and more.

```javascript
import {
  Container,
  Column,
  Text,
  TextStyle,
  Alignment,
  BoxDecoration,
  BorderRadius,
  Radius,
} from "flitter-ui";

Container({
  alignment: Alignment.center,
  decoration: new BoxDecoration({
    color: "#f0f9ff",
    borderRadius: BorderRadius.all(Radius.circular(12)),
  }),
  child: Column({
    children: [
      Text("Title", { style: new TextStyle({ fontSize: 20, fontWeight: "bold" }) }),
      Text("Subtitle", { style: new TextStyle({ fontSize: 14, color: "#64748b" }) }),
    ],
  }),
});
```

## Documentation

Full API reference, interactive examples, and guides at **[ui.flitter.dev](https://ui.flitter.dev)**.

## License

[MIT](../../LICENSE)
