# @meursyphus/flitter-solid

SolidJS integration for Flitter - a Flutter-like UI framework for JavaScript.

## Installation

```bash
npm install @meursyphus/flitter-solid @meursyphus/flitter solid-js
```

## Usage

```tsx
import { createSignal } from 'solid-js';
import Widget from '@meursyphus/flitter-solid';
import { Container, Text, Center } from '@meursyphus/flitter';

function App() {
  const [count, setCount] = createSignal(0);

  const flitterWidget = Center({
    child: Container({
      width: 200,
      height: 200,
      color: 'lightblue',
      child: Text(`Count: ${count()}`, {
        style: { fontSize: 24 }
      })
    })
  });

  return (
    <div>
      <Widget 
        widget={flitterWidget}
        width="400px"
        height="400px"
        renderer="svg" // or "canvas"
      />
      <button onClick={() => setCount(count() + 1)}>Increment</button>
    </div>
  );
}

export default App;
```

## API

### Widget Component Props

- `widget` (Widget): The Flitter widget to render
- `width` (string): Width of the container (default: "100%")
- `height` (string): Height of the container (default: "300px")
- `renderer` ("canvas" | "svg"): Rendering backend (default: "svg")

## Features

- Seamless integration with SolidJS reactive system
- Support for both Canvas and SVG rendering
- Automatic cleanup on unmount
- TypeScript support

## License

MIT