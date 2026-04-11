<p align="center">
  <img src="assets/readme/logo.png" alt="Flitter" width="120" />
</p>

<h1 align="center">Flitter</h1>

<p align="center">
  A JavaScript rendering engine inspired by Flutter.<br/>
  Build any visualization library — charts, diagrams, editors — with widget composition.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/flitter-ui"><img src="https://img.shields.io/npm/v/flitter-ui.svg" alt="npm version" /></a>
  <a href="https://github.com/meursyphus/flitter/blob/latest/LICENSE"><img src="https://img.shields.io/npm/l/flitter-ui.svg" alt="license" /></a>
  <a href="https://discord.gg/kUZp4SaHzF"><img src="https://img.shields.io/discord/1213364239498936411?logo=discord&label=discord" alt="discord" /></a>
</p>

<p align="center">
  <a href="https://ui.flitter.dev">Documentation</a> ·
  <a href="https://ui.flitter.dev/chart/">Chart Gallery</a> ·
  <a href="https://discord.gg/kUZp4SaHzF">Discord</a>
</p>

---

## What is Flitter?

Flitter is not a chart library. It is a **rendering engine** that lets you build chart libraries, diagram editors, and any visual interface you can imagine — all from composable widgets.

At its core, Flitter provides:

- **Render Object Tree** — efficient rendering through a tree-based layout engine, with optimized updates that only repaint what changed.
- **Declarative Widgets** — Flutter-style widget composition (`Container`, `Stack`, `Column`, `Row`, `Text`, ...) for building any visual structure.
- **Dual Renderer** — choose SVG or Canvas per use case. Switch seamlessly between vector and bitmap graphics.
- **Constraint-based Layout** — familiar box model layout with automatic size negotiation between parent and child.
- **Built-in Animation** — animation controllers, curves, and tweens for smooth interactive graphics.

The first library built on Flitter is a **chart library** — but the engine is designed for anything visual.

## Showcase

### Charts — built on Flitter

20+ chart types, two visual styles, fully composable. Every axis, bar, tooltip, and legend is a widget you can swap.

<table border="1" bordercolor="#000000" cellspacing="0" cellpadding="8">
  <tr>
    <td bgcolor="#ffffff" align="center" valign="middle"><img src="assets/readme/bar-chart-toast-department-revenue.svg" width="280" /></td>
    <td bgcolor="#ffffff" align="center" valign="middle"><img src="assets/readme/line-chart-ag-monthly-active-users.svg" width="280" /></td>
    <td bgcolor="#ffffff" align="center" valign="middle"><img src="assets/readme/area-chart-toast-app-downloads.svg" width="280" /></td>
  </tr>
  <tr>
    <td bgcolor="#ffffff" align="center" valign="middle"><img src="assets/readme/pie-chart-ag-browser-share.svg" width="280" /></td>
    <td bgcolor="#ffffff" align="center" valign="middle"><img src="assets/readme/radar-chart-toast-team-comparison.svg" width="280" /></td>
    <td bgcolor="#ffffff" align="center" valign="middle"><img src="assets/readme/scatter-chart-ag-revenue-growth.svg" width="280" /></td>
  </tr>
  <tr>
    <td bgcolor="#ffffff" align="center" valign="middle"><img src="assets/readme/heatmap-chart-toast-monthly-product-sales.svg" width="280" /></td>
    <td bgcolor="#ffffff" align="center" valign="middle"><img src="assets/readme/treemap-chart-ag-disk-space-usage.svg" width="280" /></td>
    <td bgcolor="#ffffff" align="center" valign="middle">&nbsp;</td>
  </tr>
</table>

Bar · Line · Area · Pie · Donut · Radar · Scatter · Bubble · Heatmap · Treemap · Stacked Bar · Stacked Area · Box Plot · Candlestick · Waterfall · Funnel · Histogram · Sankey · Sunburst · Bullet

### Diagrams — built on Flitter

Interactive ERD editor with draggable entities, real-time relationship rendering, and live code-to-diagram synchronization.

![Interactive ERD built with Flitter](assets/readme/easyrd.gif)

## Quick Start

### Install a chart in seconds

```bash
npx flitter-ui init        # initialize project
npx flitter-ui add bar-chart   # add a chart (source code lands in your project)
```

This is a **shadcn-style** workflow — you get the full source code, not a black-box dependency. Read it, modify it, learn from it.

### Use in React

```bash
npm install flitter-ui @flitterjs/react
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

### Use in Svelte

```bash
npm install flitter-ui @flitterjs/svelte
```

```svelte
<script>
  import Widget from "@flitterjs/svelte";
  import BarChart from "./charts/bar-chart";

  const chart = BarChart({
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr"],
      datasets: [{ legend: "Revenue", values: [40, 65, 50, 80] }],
    },
  });
</script>

<Widget widget={chart} width="600px" height="400px" />
```

### Use with Vanilla JS

```bash
npm install flitter-ui
```

```javascript
import { Container, Alignment, Text, TextStyle, AppRunner } from "flitter-ui";

const app = new AppRunner({
  view: document.querySelector("#view"),
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

## How It Works — Widget Composition

Flitter follows Flutter's widget composition model. Everything is a widget, and complex UIs are built by nesting simple widgets:

```typescript
import {
  Container,
  Column,
  Row,
  Text,
  TextStyle,
  SizedBox,
  MainAxisAlignment,
  CrossAxisAlignment,
  BoxDecoration,
  BorderRadius,
  Radius,
  StatefulWidget,
  State,
  AnimationController,
  Tween,
  CurvedAnimation,
  Curves,
} from "flitter-ui";

// A simple animated bar chart built from scratch with widgets
class Bar extends StatefulWidget {
  constructor(public label: string, public value: number) {
    super();
  }
  createState() {
    return new BarState();
  }
}

class BarState extends State<Bar> {
  animationController = new AnimationController({ duration: 800 });

  initState() {
    super.initState();
    const tween = new Tween({ begin: 0, end: this.widget.value });
    this.tweenAnimation = tween.animated(
      new CurvedAnimation({
        parent: this.animationController,
        curve: Curves.easeInOut,
      })
    );
    this.animationController.addListener(() => this.setState());
    this.animationController.forward();
  }

  build() {
    return Column({
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        Container({
          width: 24,
          height: this.tweenAnimation.value,
          decoration: new BoxDecoration({
            color: "#3b82f6",
            borderRadius: BorderRadius.only({
              topLeft: Radius.circular(4),
              topRight: Radius.circular(4),
            }),
          }),
        }),
        SizedBox({ height: 4 }),
        Text(this.widget.label, {
          style: new TextStyle({ fontSize: 12 }),
        }),
      ],
    });
  }
}
```

This is the same composition model used inside Flitter's chart library. Every chart is just a tree of widgets — and you can swap any piece.

## Packages

| Package | Description | Version |
|---------|-------------|---------|
| [`flitter-ui`](https://www.npmjs.com/package/flitter-ui) | Core engine + CLI | [![npm](https://img.shields.io/npm/v/flitter-ui.svg)](https://www.npmjs.com/package/flitter-ui) |
| [`@flitterjs/react`](https://www.npmjs.com/package/@flitterjs/react) | React integration | [![npm](https://img.shields.io/npm/v/@flitterjs/react.svg)](https://www.npmjs.com/package/@flitterjs/react) |
| [`@flitterjs/svelte`](https://www.npmjs.com/package/@flitterjs/svelte) | Svelte integration (SSR supported) | [![npm](https://img.shields.io/npm/v/@flitterjs/svelte.svg)](https://www.npmjs.com/package/@flitterjs/svelte) |

## LLM Native

Feed your AI assistant the chart documentation and let it generate charts for you:

```
https://ui.flitter.dev/llm/chart.md
```

## Documentation

Full documentation, interactive examples, and API reference at **[ui.flitter.dev](https://ui.flitter.dev)**.

## Contributing

Flitter is open source. Bug reports, feature suggestions, and pull requests are welcome.

- [Discord](https://discord.gg/kUZp4SaHzF)
- [GitHub Issues](https://github.com/meursyphus/flitter/issues)

## License

[MIT](LICENSE)
