<p align="center">
  <img src="../../assets/readme/logo.png" alt="Flitter" width="80" />
</p>

<h1 align="center">@flitterjs/react</h1>

<p align="center">
  Mount Flitter widgets in React applications.<br/>
  High-performance Canvas/SVG rendering with a single component.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@flitterjs/react"><img src="https://img.shields.io/npm/v/@flitterjs/react.svg" alt="npm version" /></a>
  <a href="https://github.com/meursyphus/flitter/blob/latest/LICENSE"><img src="https://img.shields.io/npm/l/@flitterjs/react.svg" alt="license" /></a>
</p>

<p align="center">
  <a href="https://ui.flitter.dev">Documentation</a> ·
  <a href="https://ui.flitter.dev/integration/">Integration Guide</a> ·
  <a href="https://ui.flitter.dev/chart/">Chart Gallery</a>
</p>

---

## Installation

```bash
npm install flitter-ui @flitterjs/react
```

## Usage

```tsx
import { Container, Alignment, Text, TextStyle } from "flitter-ui";
import Widget from "@flitterjs/react";

function App() {
  return (
    <Widget
      width="600px"
      height="300px"
      renderer="svg"
      widget={Container({
        alignment: Alignment.center,
        color: "lightblue",
        child: Text("Hello, Flitter!", {
          style: new TextStyle({ fontSize: 24, fontWeight: "bold" }),
        }),
      })}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `widget` | `Widget` | Hello World text | The Flitter widget tree to render |
| `width` | `string` | `"100%"` | Container width (CSS value) |
| `height` | `string` | `"300px"` | Container height (CSS value) |
| `renderer` | `"svg" \| "canvas"` | `"svg"` | Rendering backend |

## With Charts

Add charts via the CLI, then render them in React:

```bash
npx flitter-ui init
npx flitter-ui add bar-chart
```

```tsx
import Widget from "@flitterjs/react";
import BarChart from "./charts/bar-chart";

const chart = BarChart({
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      { legend: "Revenue", values: [40, 65, 50, 80] },
      { legend: "Profit", values: [20, 35, 25, 45] },
    ],
  },
});

export default function Dashboard() {
  return <Widget widget={chart} width="100%" height="400px" />;
}
```

## Requirements

- React 18+ or 19+
- `flitter-ui` as a peer dependency

## Documentation

Full documentation and interactive examples at **[ui.flitter.dev](https://ui.flitter.dev)**.

## License

[MIT](../../LICENSE)
