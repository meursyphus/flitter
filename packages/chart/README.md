# Headless Chart

A powerful chart library built on top of the [Flitter](https://flitter.dev) framework that provides a headless way to define and compose charts. Unlike traditional chart libraries where you are constrained by predefined components, headless-chart gives you building blocks that you can shape and style to meet your exact needs.

## Why Headless Chart?

- **Full Control**: Instead of tweaking chart options, you directly modify widget structures using Flitter's widget system
- **Framework Agnostic**: Works seamlessly with vanilla JavaScript/TypeScript or any UI framework
- **Flexible Rendering**: Supports both SVG and Canvas rendering out of the box
- **React Integration**: Easy integration with React through `@meursyphus/flitter-react`

## Quick Start

```bash
# Create a new Vite project
npm create vite@latest my-chart-app -- --template react
cd my-chart-app

# Install dependencies
npm install @meursyphus/flitter @meursyphus/headless-chart @meursyphus/flitter-react
```

### Basic Usage

```jsx
import ReactWidget from "@meursyphus/flitter-react";
import { BarChart } from "@meursyphus/headless-chart";

export default function App() {
  const chart = BarChart({
    data: {
      labels: ["January", "February", "March"],
      datasets: [
        { legend: "Sales", values: [150, 200, 170] }
      ],
    },
    title: "Monthly Sales"
  });

  return (
    <ReactWidget 
      width="600px" 
      height="400px" 
      widget={chart} 
      renderer="svg" 
    />
  );
}
```

### Custom Chart Example

```jsx
import { BarChart } from "@meursyphus/headless-chart";
import { Text, Container, BoxDecoration } from "@meursyphus/flitter";

const customConfig = {
  bar: ({ value, label, legend }) => {
    return Container({
      width: 20,
      height: value * 2,
      decoration: new BoxDecoration({ 
        color: legend === "Sales" ? "blue" : "gray" 
      }),
      child: Text(`${value}`, { 
        style: { fill: "white" } 
      })
    });
  },
  title: ({ name }) => {
    return Text(name, { 
      style: { fontSize: 18, fontWeight: "bold" } 
    });
  }
};

const chart = BarChart({
  data: {
    labels: ["Jan", "Feb", "Mar"],
    datasets: [
      { legend: "Sales", values: [150, 200, 170] }
    ]
  },
  title: "Customized Sales Chart",
  custom: customConfig
});
```

## Documentation

Visit our [documentation](https://headless-chart.codeium.com/docs/getting-started/introduction) to learn more about:
- Detailed installation guides
- Framework integrations
- Chart customization
- Advanced examples

## Examples

Check out our [interactive examples](https://headless-chart.codeium.com/charts) to see what you can build with headless-chart.

## License

MIT
