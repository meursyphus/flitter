##  What is this?

Flitter-React is a library designed to simplify the integration of Flitter, a widget-based SVG manipulation framework, with React applications. It enables developers to easily incorporate Flitter's declarative, Flutter-like syntax for data visualization within React projects.

For more details, visit [here](https://flitter.pages.dev).

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