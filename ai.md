# Flitter AI Guide - Essential Syntax and Usage

## Overview
Flitter is a JavaScript rendering engine inspired by Flutter. This guide helps AI assistants write correct Flitter code by highlighting common syntax patterns and mistakes to avoid.

## ⚠️ Critical Import Rules

### React Widget Import
```typescript
// ✅ CORRECT - Default import only
import Widget from '@flitterjs/react';

// ❌ WRONG - Never destructure
import { Widget } from '@flitterjs/react';  // ERROR!
```

### Flitter Components Import
```typescript
// ✅ CORRECT - Named imports for all Flitter components
import { 
  Container, 
  Text, 
  Row, 
  Column,
  // ... other components
} from 'flitter-core';
```

## 🎯 Object Creation Rules

### Widgets - Use Factory Functions (NO new keyword)
```typescript
// ✅ CORRECT
Container({ width: 100, height: 100 })
Text('Hello World')
Row({ children: [...] })

// ❌ WRONG
new Container({ ... })  // Never use 'new' with widgets!
new Text('Hello')      // Never use 'new' with widgets!
```

### Type Classes - Use 'new' Keyword
```typescript
// ✅ CORRECT - These require 'new'
new TextStyle({ fontSize: 16, color: '#FF0000' })
new BoxDecoration({ color: '#FF0000', borderRadius: BorderRadius.circular(8) })
new EdgeInsets.all(10)
new BorderSide({ color: '#000000', width: 1 })
new Border({ top: new BorderSide(...), right: ..., bottom: ..., left: ... })

// ❌ WRONG
TextStyle({ ... })      // Missing 'new'!
BoxDecoration({ ... })  // Missing 'new'!
```

## 🎨 Color Format Rules

### Always Use String Format
```typescript
// ✅ CORRECT
color: '#FF0000'              // HEX string
color: 'rgba(255, 0, 0, 0.5)' // RGBA string
color: 'red'                  // Named color

// ❌ WRONG
color: 0xFFFF0000   // Flutter-style hex numbers don't work!
color: 0xFF000000   // No numeric color values!
```

## 📐 Common Type Usage

### EdgeInsets
```typescript
// ✅ CORRECT
padding: EdgeInsets.all(16)
padding: EdgeInsets.symmetric({ horizontal: 20, vertical: 10 })
padding: EdgeInsets.only({ left: 10, top: 20, right: 10, bottom: 20 })

// ❌ WRONG
padding: { all: 16 }  // Not a plain object!
```

### Border & BorderSide
```typescript
// ✅ CORRECT - All sides must be specified
border: new Border({
  top: new BorderSide({ color: '#000', width: 1 }),
  right: new BorderSide({ color: '#000', width: 1 }),
  bottom: new BorderSide({ color: '#000', width: 1 }),
  left: new BorderSide({ color: '#000', width: 1 })
})

// Or use the helper
border: Border.all({ color: '#000', width: 1 })

// ❌ WRONG - Partial borders
border: new Border({ top: new BorderSide(...) })  // Missing other sides!
```

### BorderRadius
```typescript
// ✅ CORRECT
borderRadius: BorderRadius.circular(8)
borderRadius: BorderRadius.only({ 
  topLeft: Radius.circular(8),
  topRight: Radius.circular(8),
  bottomLeft: Radius.circular(0),
  bottomRight: Radius.circular(0)
})

// ❌ WRONG
borderRadius: 8  // Not a number!
```

## 🔄 State Management - Flutter Style Only!

### ❌ NEVER Use React Patterns
```typescript
// ❌ WRONG - No React hooks!
const [count, setCount] = useState(0);
let isExpanded = false;  // No outside state variables!
```

### ✅ ALWAYS Use StatefulWidget Pattern
```typescript
class MyWidget extends StatefulWidget {
  createState() {
    return new MyWidgetState();
  }
}

class MyWidgetState extends State<MyWidget> {
  // State as class properties
  count = 0;
  isExpanded = false;
  
  build(context) {
    return Container({
      child: Text(`Count: ${this.count}`)
    });
  }
  
  incrementCount() {
    this.setState(() => {
      this.count++;
    });
  }
}

// Export as factory function
export default function MyWidget(props) {
  return new MyWidget(props);
}
```

## 🖱️ Event Handling

### Use GestureDetector for All Interactions
```typescript
// ✅ CORRECT
GestureDetector({
  onClick: () => {
    this.setState(() => {
      this.isClicked = true;
    });
  },
  onMouseEnter: () => { /* hover */ },
  onMouseLeave: () => { /* unhover */ },
  child: Container({ ... })
})

// ❌ WRONG - No direct event handlers on widgets
Container({ 
  onClick: () => {},  // Containers don't have onClick!
  child: Text('Click me')
})
```

## 📦 Available Widgets

### Layout Widgets
- Container, Row, Column, Stack, Positioned
- Center, Align, Padding, Expanded, Flexible
- SizedBox, ConstrainedBox, FractionallySizedBox
- AspectRatio, IntrinsicHeight, IntrinsicWidth
- Spacer, IndexedStack, Wrap

### Display Widgets
- Text, RichText, Image
- DecoratedBox, ColoredBox
- ClipRect, ClipRRect, ClipOval, ClipPath
- Opacity, Transform

### Interactive Widgets
- GestureDetector
- Draggable
- Tooltip

### Animation Widgets
- AnimatedContainer, AnimatedOpacity, AnimatedPadding
- AnimatedPositioned, AnimatedAlign, AnimatedScale
- AnimatedRotation, AnimatedSlide
- AnimatedFractionallySizedBox

### Specialized Widgets
- CustomPaint (for custom drawing)
- OverflowBox, UnconstrainedBox, LimitedBox
- ConstraintsTransformBox, FractionalTranslation
- ZIndex

## 🚫 Common Mistakes to Avoid

### 3. Widget Props Must Match Documentation
Always check the actual widget documentation for correct prop names and types.
Reference: https://github.com/meursyphus/flitter/blob/latest/packages/docs/src/content/docs/en/8_widgets/{WidgetName}/index.mdx

## 💡 React Integration Pattern

```typescript
import React from 'react';
import Widget from '@flitterjs/react';
import { Container, Text } from 'flitter-core';

export default function App() {
  const flitterWidget = Container({
    width: 200,
    height: 100,
    decoration: new BoxDecoration({
      color: '#3B82F6',
      borderRadius: BorderRadius.circular(8)
    }),
    child: Center({
      child: Text('Hello Flitter!', {
        style: new TextStyle({
          fontSize: 18,
          color: '#FFFFFF'
        })
      })
    })
  });

  return (
    <Widget 
      width="100%"
      height="200px"
      renderer="svg"  // or "canvas"
      widget={flitterWidget}
    />
  );
}
```

## 📚 Quick Reference Links

- **Widget Documentation**: `packages/docs/src/content/docs/en/8_widgets/`
- **Working Examples**: `packages/docs/src/components/pages/docs/`
- **Core Implementation**: `packages/flitter/src/component/`

## 🎯 Summary Checklist

Before generating Flitter code, verify:
- [ ] Widget imports are named (not default)
- [ ] React Widget import is default (not named)
- [ ] Widgets use factory functions (no 'new')
- [ ] Style classes use 'new' keyword
- [ ] Colors are strings (not hex numbers)
- [ ] Borders specify all 4 sides
- [ ] Event handling uses GestureDetector
- [ ] State management uses StatefulWidget pattern
- [ ] No React hooks or patterns
- [ ] No non-existent APIs (classToFunction, Alignment import)