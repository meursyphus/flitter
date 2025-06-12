# Flitter Tutorial Writing Guidelines

## Tutorial Structure

Every tutorial should follow this consistent structure:

### 1. Front Matter
```yaml
---
nav_group: "Tutorials"
nav_title: "Tutorial Name"
title: "Building a Todo App with Flitter"
description: "Learn Flitter basics by building a complete todo application"
difficulty: "beginner" # beginner, intermediate, advanced
estimated_time: "30 minutes"
prerequisites: ["installation", "basic-widgets"]
---
```

### 2. Tutorial Sections

#### Introduction (Required)
- **What we'll build**: Brief description with screenshot/demo
- **What you'll learn**: Bullet points of key concepts
- **Prerequisites**: Links to required knowledge
- **Final code**: Link to completed example

#### Setup (Required)
```typescript
// Always start with a complete, working skeleton
import { StatefulWidget, State, Container, Text } from '@flitter/core';

class TodoApp extends StatefulWidget {
  createState() {
    return new TodoAppState();
  }
}

class TodoAppState extends State<TodoApp> {
  build() {
    return Container({
      child: Text('Hello Flitter!')
    });
  }
}

export default classToFunction(TodoApp);
```

#### Step-by-Step Implementation
- Each step should be **runnable**
- Show the complete code, not just snippets
- Explain **why**, not just **what**
- Include common mistakes and solutions

#### Challenges (Optional)
- Extra tasks for readers to try
- Hints provided, solutions in collapsible sections

#### Next Steps (Required)
- Related tutorials
- Advanced topics to explore
- Community resources

## Code Examples Guidelines

### 1. Always Use Flitter Patterns
```typescript
// ✅ CORRECT - StatefulWidget for state
class MyWidget extends StatefulWidget {
  createState() {
    return new MyWidgetState();
  }
}

// ❌ WRONG - React patterns
const MyWidget = () => {
  const [state, setState] = useState();
};
```

### 2. Complete, Runnable Examples
```typescript
// ✅ GOOD - Complete example
import { StatefulWidget, State, Container, Column, Text, GestureDetector } from '@flitter/core';
import type { BuildContext, Widget } from '@flitter/core';

class Counter extends StatefulWidget {
  createState(): State<Counter> {
    return new CounterState();
  }
}

class CounterState extends State<Counter> {
  count = 0;

  build(context: BuildContext): Widget {
    return Container({
      padding: EdgeInsets.all(20),
      child: Column({
        children: [
          Text(`Count: ${this.count}`),
          GestureDetector({
            onClick: () => {
              this.setState(() => {
                this.count++;
              });
            },
            child: Container({
              padding: EdgeInsets.all(10),
              color: 'blue',
              child: Text('Increment')
            })
          })
        ]
      })
    });
  }
}

// ❌ BAD - Incomplete snippet
GestureDetector({
  onClick: () => setState(() => count++)
})
```

### 3. Progressive Complexity
Start simple, add features incrementally:

```typescript
// Step 1: Basic structure
class TodoApp extends StatefulWidget {
  // ...basic implementation
}

// Step 2: Add state
class TodoAppState extends State<TodoApp> {
  todos: string[] = [];
  // ...add todo functionality
}

// Step 3: Add interactions
// ...add delete, complete functionality

// Step 4: Add persistence
// ...add local storage
```

## Writing Style

### Do's
- Use **clear, concise language**
- Explain **concepts before code**
- Include **visual aids** (diagrams, screenshots)
- Provide **real-world context**
- Test all code examples
- Include error handling

### Don'ts
- Don't assume prior Flutter knowledge
- Don't skip error handling
- Don't use unexplained magic numbers
- Don't mix frameworks (React patterns)
- Don't leave TODOs in example code

## Interactive Elements

### Code Playground
```markdown
<CodePlayground height="400">
  <PlaygroundFile name="main.ts">
    // Interactive code here
  </PlaygroundFile>
</CodePlayground>
```

### Visual Examples
```markdown
<WidgetPreview>
  <Container width={200} height={200} color="blue" />
</WidgetPreview>
```

### Collapsible Solutions
```markdown
<details>
<summary>💡 Solution</summary>

```typescript
// Solution code here
```

</details>
```

## Headless-Chart Integration Examples

When using headless-chart in tutorials:

### 1. Explain the Concept First
```markdown
## Understanding Headless Charts

Headless-chart provides the data processing without the rendering.
This gives us complete control over how our charts look and animate.

Benefits:
- Custom styling matching your app
- Smooth Flitter animations
- Better performance
- Full interaction control
```

### 2. Show Progressive Implementation
```typescript
// Step 1: Set up the data
import { scaleLinear, scaleBand } from '@headless-chart/core';

const data = [
  { label: 'A', value: 10 },
  { label: 'B', value: 20 },
  // ...
];

// Step 2: Create scales
const xScale = scaleBand()
  .domain(data.map(d => d.label))
  .range([0, width]);

const yScale = scaleLinear()
  .domain([0, Math.max(...data.map(d => d.value))])
  .range([height, 0]);

// Step 3: Create custom Flitter widget
class BarChart extends StatelessWidget {
  data: ChartData[];
  
  build() {
    return CustomPaint({
      painter: BarChartPainter({
        data: this.data,
        xScale: this.xScale,
        yScale: this.yScale
      })
    });
  }
}
```

### 3. Emphasize Flitter Integration
Show how Flitter's features enhance the charts:
- Animations with AnimationController
- Interactions with GestureDetector
- Responsive with LayoutBuilder
- Theming with Provider

## Tutorial Categories

### Beginner Tutorials
- Focus on one concept at a time
- Lots of explanations
- Common mistakes sections
- Simple, relatable examples

### Intermediate Tutorials
- Combine multiple concepts
- Real-world scenarios
- Performance considerations
- Best practices

### Advanced Tutorials
- Complex architectures
- Performance optimization
- Custom render objects
- Production considerations

## Quality Checklist

Before publishing a tutorial:

- [ ] All code examples run without errors
- [ ] Follows Flitter patterns (no React hooks)
- [ ] Includes complete, runnable code
- [ ] Has clear learning objectives
- [ ] Includes next steps section
- [ ] Screenshots/demos included
- [ ] Tested on different screen sizes
- [ ] Reviewed for grammar and clarity
- [ ] Links to related content work
- [ ] Time estimate is accurate

## Example Tutorial Outline

```markdown
---
nav_group: "Tutorials"
nav_title: "Interactive Bar Chart"
title: "Building an Interactive Bar Chart with Headless-Chart"
description: "Create beautiful, animated charts using Flitter and headless-chart"
difficulty: "intermediate"
estimated_time: "45 minutes"
prerequisites: ["basic-widgets", "custom-paint", "animations"]
---

## What We'll Build
[Screenshot of final chart]

In this tutorial, we'll create an interactive bar chart that:
- Animates on load
- Shows tooltips on hover
- Responds to data updates
- Matches your app's theme

## What You'll Learn
- Integrating headless-chart with Flitter
- Creating custom painters
- Adding smooth animations
- Handling user interactions
- Making charts responsive

## Prerequisites
- [Basic Widgets](/docs/basic-widgets)
- [Custom Paint](/docs/custom-paint)
- [Animation Basics](/docs/animations)

## Setup
[Complete starter code]

## Step 1: Understanding Headless Charts
[Explanation and simple example]

## Step 2: Creating the Chart Widget
[Implementation with explanations]

## Step 3: Adding Animations
[Progressive enhancement]

## Step 4: Making it Interactive
[Event handling]

## Challenges
- Add a line chart overlay
- Implement zoom functionality
- Add data filtering

## Next Steps
- [Advanced Chart Animations](/tutorials/advanced-charts)
- [Real-time Data Visualization](/tutorials/realtime-data)
- [Chart Component Library](/tutorials/chart-library)

## Resources
- [Complete Source Code](github.com/...)
- [Live Demo](...)
- [Headless-Chart Docs](...)
```