##  What is this?

Flitter-React is a library designed to simplify the integration of Flitter, a widget-based SVG manipulation framework, with React applications. It enables developers to easily incorporate Flitter's declarative, Flutter-like syntax for data visualization within React projects.

For more details, visit [here](https://flitter.dev).

```bash
npm i flitter-core @flitterjs/react
```
Example of using Flitter widgets in a React component:

```javascript
import { Container, Alignment, Text, TextStyle } from 'flitter-core';
import Widget from '@flitterjs/react';

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