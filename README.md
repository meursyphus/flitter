# Flitter

Flitter is a framework that deals with SVG. Like React, it uses VDOM to manage state and optimize rendering. Since the library directly calculates the layout, it is much easier to visualize data than using D3. This provides a high level of control and flexibility for data visualization.

FlutterJs is a library inspired by Flutter, a cross-platform framework commonly used for mobile app development.

For more details, visit [here](https://flitter.pages.dev).

## Getting Started

Getting started with Flitter is straightforward. Follow these steps to install and use Flitter in your React or Svelte projects. (Or you can implement widget component manually to support Flitter.)

### React
```bash
npm i @meursyphus/flitter @meursyphus/flitter-react
```
Example of using Flitter widgets in a React component:

```javascript
import { Container, Alignment, Text, TextStyle } from '@meursyphus/flitter';
import Widget from '@meursyphus/flitter-react';

const App = () => {
  return (
    <Widget
      width="600px"
      height="300px"
      widget={Container({
        alignment: Alignment.center,
        color: 'lightblue',
        child: Text("Hello, Flitter!", style: TextStyle({ fontSize: 30, weight: 'bold' }))
      })}
    />
  );
};
```
### Svelte

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
    child: Text("Hello, Flitter!", { style: new TextStyle({ fontSize: 30, fontWeight: 'bold' }) })
  })}
/>
```

## Features

- Provides high-resolution, resolution-independent visualizations based on SVG
- Simplifies SVG manipulation with a component-based approach
- Allows for quick learning and development with a syntax similar to Flutter

## License

Flitter is open-source software freely available under the MIT license.

For more information and documentation, refer to the [Flitter official documentation](https://flitter.pages.dev).