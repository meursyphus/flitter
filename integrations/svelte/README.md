<p align="center">
  <img src="../../assets/readme/logo.png" alt="Flitter" width="80" />
</p>

<h1 align="center">@flitterjs/svelte</h1>

<p align="center">
  Mount Flitter widgets in Svelte applications.<br/>
  High-performance Canvas/SVG rendering with SSR support.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@flitterjs/svelte"><img src="https://img.shields.io/npm/v/@flitterjs/svelte.svg" alt="npm version" /></a>
  <a href="https://github.com/meursyphus/flitter/blob/latest/LICENSE"><img src="https://img.shields.io/npm/l/@flitterjs/svelte.svg" alt="license" /></a>
</p>

<p align="center">
  <a href="https://ui.flitter.dev">Documentation</a> ·
  <a href="https://ui.flitter.dev/integration/">Integration Guide</a> ·
  <a href="https://ui.flitter.dev/chart/">Chart Gallery</a>
</p>

---

## Installation

```bash
npm install flitter-ui @flitterjs/svelte
```

## Usage

```svelte
<script>
  import { Container, Alignment, Text, TextStyle } from "flitter-ui";
  import Widget from "@flitterjs/svelte";

  const widget = Container({
    alignment: Alignment.center,
    color: "lightblue",
    child: Text("Hello, Flitter!", {
      style: new TextStyle({ fontSize: 24, fontWeight: "bold" }),
    }),
  });
</script>

<Widget {widget} width="600px" height="300px" renderer="svg" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `widget` | `Widget` | Placeholder text | The Flitter widget tree to render |
| `width` | `string` | `"100%"` | Container width (CSS value) |
| `height` | `string` | `"300px"` | Container height (CSS value) |
| `renderer` | `"svg" \| "canvas"` | `"svg"` | Rendering backend |
| `ssr` | `{ size: { width, height } }` | `undefined` | SSR configuration for server-side rendering |

## Server-Side Rendering

The Svelte integration supports SSR out of the box. Pass the `ssr` prop to enable server-side rendering with a fixed size:

```svelte
<Widget
  {widget}
  width="600px"
  height="300px"
  ssr={{ size: { width: 600, height: 300 } }}
/>
```

## With Charts

Add charts via the CLI, then render them in Svelte:

```bash
npx flitter-ui init
npx flitter-ui add bar-chart
```

```svelte
<script>
  import Widget from "@flitterjs/svelte";
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
</script>

<Widget widget={chart} width="100%" height="400px" />
```

## Requirements

- Svelte 4+ or 5+
- `flitter-ui` as a peer dependency

## Documentation

Full documentation and interactive examples at **[ui.flitter.dev](https://ui.flitter.dev)**.

## License

[MIT](../../LICENSE)
