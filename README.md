# Flitter

Flitter is a powerful framework inspired by Flutter, supporting both SVG and Canvas to create high-performance graphics and user interfaces. It is designed to easily implement complex data visualizations, interactive charts, diagrams, and graphic editors in web applications.


## Key Features

- **Render Object Tree**: Flitter uses a render object tree for efficient rendering, allowing easy management and manipulation of complex layouts.

- **Declarative Programming**: Following a declarative paradigm, the screen automatically updates when values change, simplifying application state management.

- **Optimized Rendering**: Re-rendering, painting, and layout recalculations are managed by the renderer pipeline, with optimizations applied to update only necessary parts.

- **Box Model Layout**: Users can easily compose layouts using the familiar Box model.

- **SVG and Canvas Support**: Supports both SVG and Canvas, meeting various graphic requirements. Developers can choose the appropriate renderer as needed.

- **Diverse Applications**: Can be utilized in various fields such as charts, diagrams, data visualization, and graphic editors.

# Showcase
Here are some examples of what you can create with Flitter:
Interactive ERD (Entity-Relationship Diagram)

![Interactive ERD](https://flitter.pages.dev/home/easyrd.jpg)

This interactive ERD demonstrates Flitter's capability to create complex, interactive diagrams. Users can manipulate entities, add relationships, and visualize database structures in real-time. This showcase highlights Flitter's strengths in:

Creating responsive, draggable elements
Handling complex user interactions
Rendering intricate diagrams with ease
Real-time updates based on user input
## Installation Guide

Flitter can be used in various JavaScript environments. Here are installation and usage methods for major environments:

### Pure JavaScript

```bash
npm install @meursyphus/flitter
```

```javascript
import { Widget, Container, AppRunner } from '@meursyphus/flitter';

// Using SVG renderer
const svgElement = document.getElementById('mySvg');
const svgRunner = new AppRunner({ view: svgElement });
svgRunner.runApp(Container({ color: 'lightblue' }));

// Using Canvas renderer
const canvasElement = document.getElementById('myCanvas');
const canvasRunner = new AppRunner({ view: canvasElement });
canvasRunner.runApp(Container({ color: 'lightgreen' }));
```

### React

```bash
npm install @meursyphus/flitter @meursyphus/flitter-react
```

```jsx
import { Container, Alignment, Text, TextStyle } from '@meursyphus/flitter';
import Widget from '@meursyphus/flitter-react';

const App = () => (
  <>
    <Widget
      width="600px"
      height="300px"
      renderer="svg"
      widget={Container({
        alignment: Alignment.center,
        color: 'lightblue',
        child: Text("Hello, Flitter SVG!", { style: TextStyle({ fontSize: 30, weight: 'bold' }) })
      })}
    />
    <Widget
      width="600px"
      height="300px"
      renderer="canvas"
      widget={Container({
        alignment: Alignment.center,
        color: 'lightgreen',
        child: Text("Hello, Flitter Canvas!", { style: TextStyle({ fontSize: 30, weight: 'bold' }) })
      })}
    />
  </>
);
```

### Svelte

```bash
npm install @meursyphus/flitter @meursyphus/flitter-svelte
```

```svelte
<script>
  import { Container, Alignment, Text, TextStyle } from '@meursyphus/flitter';
  import Widget from '@meursyphus/flitter-svelte';
</script>

<Widget
  width="600px"
  height="300px"
  renderer="svg"
  widget={Container({
    alignment: Alignment.center,
    color: 'lightblue',
    child: Text("Hello, Flitter SVG!", { style: TextStyle({ fontSize: 30, weight: 'bold' }) })
  })}
/>

<Widget
  width="600px"
  height="300px"
  renderer="canvas"
  widget={Container({
    alignment: Alignment.center,
    color: 'lightgreen',
    child: Text("Hello, Flitter Canvas!", { style: TextStyle({ fontSize: 30, weight: 'bold' }) })
  })}
/>
```

## Usage Example

Example of creating a simple chart using Flitter:

```javascript
import { Container, Row, Expanded, SizedBox } from '@meursyphus/flitter';

const BarChart = ({ data }) => {
  return Container({
    width: 300,
    height: 200,
    child: Row({
      crossAxisAlignment: CrossAxisAlignment.end,
      children: data.map(value => 
        Expanded({
          child: Container({
            color: 'blue',
            height: value * 2,
          })
        })
      ),
    })
  });
};

// Usage
const chartData = [50, 30, 70, 60, 90];
const myChart = BarChart({ data: chartData });
```

## Why Flitter?

1. **Easy Learning Curve**: Uses syntax similar to Flutter, allowing mobile developers to easily adapt to the web environment.

2. **High Performance**: Handles complex graphics smoothly with an optimized rendering pipeline.

3. **Flexibility**: Abstracts SVG and Canvas manipulation, allowing developers to focus on business logic.

4. **Renderer Selection**: Can choose between SVG and Canvas renderers as needed, meeting various graphic requirements.

5. **Reusability**: Increases code reusability through a component-based approach.

## Contributing

Flitter is an open-source project. We welcome all forms of contributions including bug reports, feature suggestions, and pull requests. For more details, please visit [Discord](https://discord.gg/kUZp4SaHzF) 

## License

Flitter is provided under the MIT license. 

## Learn More

For detailed documentation and examples, visit the [Flitter Official Documentation](https://flitter.pages.dev).