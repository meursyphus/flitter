# @meursyphus/flitter-qwik

Qwik integration for the Flitter rendering engine. Seamlessly use Flitter's Flutter-inspired widgets within your Qwik applications.

## Installation

```bash
npm install @meursyphus/flitter-qwik @meursyphus/flitter
```

## Usage

### Basic Example

```tsx
import { component$ } from '@builder.io/qwik';
import { Container, Alignment, Text, TextStyle, Colors } from '@meursyphus/flitter';
import Widget from '@meursyphus/flitter-qwik';

export const App = component$(() => {
  const myWidget = Container({
    alignment: Alignment.center,
    color: Colors.lightBlue,
    child: Text('Hello, Flitter + Qwik!', {
      style: TextStyle({
        fontSize: 30,
        weight: 'bold',
        color: Colors.white
      })
    })
  });

  return (
    <Widget
      widget={myWidget}
      width="600px"
      height="400px"
      renderer="svg"
    />
  );
});
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `widget` | `Widget` | Default widget | The Flitter widget to render |
| `width` | `string` | `"100%"` | Width of the rendering area |
| `height` | `string` | `"300px"` | Height of the rendering area |
| `renderer` | `"svg" \| "canvas"` | `"svg"` | Rendering mode |
| `class` | `string` | - | CSS class name for styling |
| `onClick$` | `QRL<() => void>` | - | Click handler (Qwik style) |

### Advanced Example with Animations

```tsx
import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import {
  Container,
  Alignment,
  AnimationController,
  AnimatedBuilder,
  Transform,
  Matrix4,
  Text,
  TextStyle,
  Colors
} from '@meursyphus/flitter';
import Widget from '@meursyphus/flitter-qwik';

export const AnimatedExample = component$(() => {
  const animationSignal = useSignal<AnimationController>();

  useVisibleTask$(({ cleanup }) => {
    // Create animation controller
    const controller = new AnimationController({
      duration: 2000,
    });
    
    controller.repeat({ reverse: true });
    animationSignal.value = controller;

    cleanup(() => {
      controller.dispose();
    });
  });

  const animatedWidget = animationSignal.value ? AnimatedBuilder({
    animation: animationSignal.value,
    builder: (context, child) => {
      const scale = 1 + (animationSignal.value?.value || 0) * 0.5;
      
      return Transform({
        transform: Matrix4.identity().scale(scale, scale),
        alignment: Alignment.center,
        child: Container({
          width: 200,
          height: 200,
          color: Colors.blue,
          alignment: Alignment.center,
          child: Text('Qwik + Flitter!', {
            style: TextStyle({
              fontSize: 20,
              color: Colors.white,
              weight: 'bold'
            })
          })
        })
      });
    }
  }) : Container({ color: Colors.grey });

  return (
    <div>
      <h2>Animated Flitter Widget in Qwik</h2>
      <Widget
        widget={animatedWidget}
        width="400px"
        height="400px"
        renderer="canvas"
      />
    </div>
  );
});
```

### Using with Qwik Signals

```tsx
import { component$, useSignal } from '@builder.io/qwik';
import { 
  Container, 
  Column, 
  Row,
  Text, 
  TextStyle, 
  Colors, 
  MainAxisAlignment,
  Padding,
  EdgeInsets,
  GestureDetector
} from '@meursyphus/flitter';
import Widget from '@meursyphus/flitter-qwik';

export const InteractiveExample = component$(() => {
  const count = useSignal(0);
  const isHovered = useSignal(false);

  const counterWidget = Container({
    color: isHovered.value ? Colors.blue[100] : Colors.grey[200],
    child: Padding({
      padding: EdgeInsets.all(20),
      child: Column({
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(`Count: ${count.value}`, {
            style: TextStyle({ 
              fontSize: 32,
              weight: 'bold',
              color: Colors.blue[900]
            })
          }),
          Container({
            margin: EdgeInsets.only({ top: 20 }),
            child: Row({
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                GestureDetector({
                  onClick: () => count.value--,
                  child: Container({
                    padding: EdgeInsets.symmetric({ horizontal: 20, vertical: 10 }),
                    color: Colors.red,
                    child: Text('Decrease', {
                      style: TextStyle({ color: Colors.white })
                    })
                  })
                }),
                Container({ width: 20 }), // Spacer
                GestureDetector({
                  onClick: () => count.value++,
                  child: Container({
                    padding: EdgeInsets.symmetric({ horizontal: 20, vertical: 10 }),
                    color: Colors.green,
                    child: Text('Increase', {
                      style: TextStyle({ color: Colors.white })
                    })
                  })
                })
              ]
            })
          })
        ]
      })
    })
  });

  return (
    <Widget
      widget={counterWidget}
      width="400px"
      height="300px"
      onMouseEnter$={() => isHovered.value = true}
      onMouseLeave$={() => isHovered.value = false}
    />
  );
});
```

### Chart Example with Flitter

```tsx
import { component$ } from '@builder.io/qwik';
import { 
  Container,
  Column,
  Text,
  TextStyle,
  Padding,
  EdgeInsets,
  Colors
} from '@meursyphus/flitter';
import { LineChart, ChartData, ChartOptions } from '@meursyphus/flitter-chart';
import Widget from '@meursyphus/flitter-qwik';

export const ChartExample = component$(() => {
  const chartData: ChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Sales',
      data: [65, 59, 80, 81, 56, 95],
      borderColor: Colors.blue,
      backgroundColor: Colors.blue.withOpacity(0.1)
    }]
  };

  const chartWidget = Container({
    color: Colors.white,
    child: Padding({
      padding: EdgeInsets.all(16),
      child: Column({
        children: [
          Text('Monthly Sales Report', {
            style: TextStyle({
              fontSize: 24,
              weight: 'bold',
              color: Colors.grey[800]
            })
          }),
          Container({ height: 20 }), // Spacer
          LineChart({
            data: chartData,
            options: {
              responsive: true,
              maintainAspectRatio: false
            } as ChartOptions
          })
        ]
      })
    })
  });

  return (
    <Widget
      widget={chartWidget}
      width="600px"
      height="400px"
      class="shadow-lg rounded-lg"
    />
  );
});
```

## Features

- 🚀 **Seamless Integration**: Use Flitter widgets naturally within Qwik components
- 🎨 **Dual Rendering**: Support for both SVG and Canvas rendering modes
- ⚡ **Reactive**: Full integration with Qwik's signal system
- 📱 **Responsive**: Automatic resizing and responsive design support
- 🔧 **TypeScript**: Full TypeScript support with proper type exports
- 🎯 **Performance**: Leverages Qwik's resumability and Flitter's efficient rendering

## API Reference

### Widget Component

The main component for rendering Flitter widgets in Qwik applications.

```tsx
import Widget from '@meursyphus/flitter-qwik';
```

#### Props

- `widget?: Widget` - The Flitter widget to render
- `width?: string` - CSS width value (default: "100%")
- `height?: string` - CSS height value (default: "300px")
- `renderer?: 'canvas' | 'svg'` - Rendering mode (default: "svg")
- `class?: string` - CSS class name for the container
- `onClick$?: QRL<() => void>` - Qwik-style click handler

## Development

### Building the Library

```bash
npm run build.lib
npm run build.types
```

### Running Examples

```bash
npm run dev
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Links

- [Flitter Documentation](https://github.com/meursyphus/flitter)
- [Qwik Documentation](https://qwik.dev/)
- [Examples Repository](https://github.com/meursyphus/flitter/tree/main/packages/flitter-qwik/examples)