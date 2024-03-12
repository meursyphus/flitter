## What is this?

Flitter-Svelte is a library designed to simplify the integration of Flitter, a widget-based SVG manipulation framework, with Svelte applications. It enables developers to easily incorporate Flitter's declarative, Flutter-like syntax for data visualization within Svelte projects.

For more details, visit [here](https://flitter.pages.dev).

```bash
npm i @meursyphus/flitter @meursyphus/flitter-svelte
```

```svelte
<script>
  import { Container, Alignment, Text, TextStyle } from '@meursyphus/flitter';
  import Widget from '@meursyphus/flitter-svelte';
</script>

<Widget
  width="600px"
  height="300px"
  widget={Container({
    alignment: Alignment.center,
    color: 'lightblue',
    child: Text("Hello, Flitter!", style: TextStyle({ fontSize: 30, weight: 'bold' }))
  })}
/>
```