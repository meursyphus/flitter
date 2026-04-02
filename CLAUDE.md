# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Flitter is a JavaScript rendering engine and framework inspired by Flutter, designed for creating high-performance graphics and user interfaces in web applications. It provides a declarative API with support for both SVG and Canvas rendering.

## Architecture

### Core Concepts
- **Rendering Engine**: Manages the render object tree with dual renderer support (SVG/Canvas)
- **Widget System**: Flutter-like widgets (StatefulWidget, StatelessWidget, RenderObjectWidget)
- **Layout System**: Constraint-based box model layout
- **Animation Framework**: Built-in animation controllers, curves, and tweens

### Monorepo Structure
```
packages/
├── flitter/          # Core rendering engine
├── flitter-react/    # React integration
├── flitter-svelte/   # Svelte integration
├── chart/            # Chart library (shadcn-style, CLI-installable)
├── docs/             # Documentation site (Astro)
├── story/            # Storybook components
└── test/             # Test suite
shared/
├── chart-presets/    # Generated chart presets (synced from templates, do NOT edit directly)
└── ...               # Other shared diagram components
dev/
├── chart-storybook/  # Chart visual review (Storybook at localhost:6007)
└── shared/chart.ts   # Re-exports chart-presets
todo/
└── todo.md           # Chart work guide and feedback checklist
```

## Chart Library

### Overview

The chart library (`packages/chart/`) is a **shadcn-style** chart system built on top of Flitter. Users install charts via a CLI that copies template source code into their project — not as a compiled dependency. This means templates must be self-contained, readable, and editable by end users.

### Two Style Directions

Every chart ships with two visual styles:
- **Ag** — mimics AG Charts (structural, restrained, opacity-driven hover)
- **Toast** — mimics TOAST UI Chart (lifted, contrasted, outline-driven hover)

### Architecture Layers

```
1. Headless Engine    packages/chart/src/headless/<chart>/
   Pure logic: scales, layout, data transforms. No visuals.

2. Templates          packages/chart/registry/templates/
   Source of truth for styled charts. This is what the CLI copies.

3. Presets (generated) shared/chart-presets/
   Auto-synced from templates. NEVER edit directly.

4. Storybook          dev/chart-storybook/
   Visual review surface. Consumes presets via dev/shared/chart.ts.
```

### Template Structure

```
registry/templates/
├── charts/<chart-name>/
│   ├── base/              # Chart-specific shared logic (both styles use this)
│   ├── styles/ag/         # AG style: config + parts
│   ├── styles/toast/      # Toast style: config + parts
│   ├── index.ts           # Chart entry point
│   └── plugin.ts          # CLI plugin metadata
├── shared/
│   ├── bar-like/          # Shared base for bar-shaped charts
│   ├── line-like/         # Shared base for line-shaped charts
│   └── point-like/        # Shared base for point-shaped charts
└── styles/
    ├── ag/                # AG global style parts (legend, title, tooltip, cartesian axes)
    └── toast/             # Toast global style parts (legend, title, tooltip, cartesian axes)
```

### Headless Engines (23 total)

Not every Storybook chart has its own headless engine. Some reuse another:
- `AreaChart` and `StackedAreaChart` use `line-chart` headless
- `StackedBarChart` uses `bar-chart` headless

### Preset Sync Workflow

After editing files under `packages/chart/registry/templates/`, sync to regenerate `shared/chart-presets/`:

```bash
pnpm --dir shared/chart-presets run sync -- --chart <chart-name>           # specific chart
pnpm --dir shared/chart-presets run sync -- --chart <name> --style <style> # specific style
pnpm --dir shared/chart-presets run sync -- --changed                      # git-changed only
pnpm --dir shared/chart-presets run sync                                   # full sync
```

## Development Commands

```bash
# Build core library
npm run flitter:build

# Documentation
npm run docs:start      # Start dev server
npm run docs:build      # Build site

# Storybook
npm run story:start     # Start Storybook
npm run story:build     # Build Storybook

# Testing
npm run test:dev        # Run tests in dev mode
npm run test:playwright # Run integration tests
```

## Code Patterns

### Widget Creation
Widgets are exported as factory functions:
```typescript
export default function Container(props: ContainerProps): Widget {
  return new _Container(props);
}
```

### Render Object Widgets
```typescript
class MyRenderWidget extends SingleChildRenderObjectWidget {
  createRenderObject(): RenderObject {
    return new MyRenderObject();
  }
}
```

### State Management
```typescript
class MyWidget extends StatefulWidget {
  createState(): State<MyWidget> {
    return new MyWidgetState();
  }
}
```

## Key Development Areas

- **Widget Development**: `packages/flitter/src/component/`
- **Render Objects**: `packages/flitter/src/renderobject/`
- **Animation System**: `packages/flitter/src/animation/`
- **Tests**: `packages/test/tests/`
- **Documentation**: `packages/docs/src/content/`

## Testing & Quality

- Write integration tests in `packages/test/tests/`
- Add Storybook stories for visual components
- Performance benchmarks tracked in `packages/test/performance-history/`
- Use TypeScript strict mode

## Localization

The project supports 14 languages using Lunaria. Documentation is localized in respective language folders under `packages/docs/src/content/`.

## Important Documentation Guidelines

### State Management in Flitter

Flitter uses Flutter-style state management, NOT React hooks. When writing documentation:

**NEVER use React patterns:**
```typescript
// ❌ WRONG - React hooks
const [isExpanded, setIsExpanded] = useState(false);
let isHovered = false;
```

**ALWAYS use Flitter/Flutter patterns:**
```typescript
// ✅ CORRECT - StatefulWidget
class MyWidget extends StatefulWidget {
  createState() {
    return new MyWidgetState();
  }
}

class MyWidgetState extends State<MyWidget> {
  isExpanded = false;  // State variables as class properties
  isHovered = false;
  
  build(context: BuildContext): Widget {
    return GestureDetector({
      onClick: () => {
        this.setState(() => {
          this.isExpanded = !this.isExpanded;
        });
      },
      child: Container({ /* ... */ })
    });
  }
}

// Export as factory function
export default classToFunction(MyWidget);
```

### Event Handling

Use GestureDetector for handling user interactions:
```typescript
GestureDetector({
  onClick: () => { /* handle click */ },
  onMouseEnter: () => { /* handle hover */ },
  onMouseLeave: () => { /* handle hover end */ },
  child: /* your widget */
})
```

## Widget Documentation Structure

When documenting widgets, follow this standard structure:

### MDX Front Matter
```yaml
---
nav_group: "Widgets"
nav_group_order: 3
nav_title: WidgetName
title: "WidgetName"
description: "Brief description of the widget's purpose"
---
```

### Documentation Sections
1. **Overview**: Brief description and Flutter documentation link
2. **When to use it?**: 5-6 bullet points about use cases
3. **Basic Usage**: Complete working example with StatefulWidget
4. **Props**: Detailed property descriptions with types and examples
5. **Practical Examples**: Multiple examples showing different use cases
6. **Important Notes**: Key considerations and limitations
7. **Related Widgets**: Links to similar or complementary widgets

## Import/Export Patterns

### Widget Exports
All widgets must be exported as factory functions:
```typescript
// ❌ WRONG
export class Container extends StatelessWidget { }

// ✅ CORRECT
class _Container extends StatelessWidget { }
export default function Container(props: ContainerProps): Widget {
  return new _Container(props);
}
// or
export default classToFunction(_Container);
```

### Type Imports
Import types from the centralized type module:
```typescript
import {
  type EdgeInsets,
  type Alignment,
  Constraints,
  Rect,
} from "../type";
```

## Common Mistakes to Avoid

### State Management
- ❌ Never mutate state outside setState()
- ❌ Never use React hooks (useState, useEffect, etc.)
- ❌ Never use let/const for state variables outside class
- ✅ Always use class properties for state in StatefulWidget
- ✅ Always wrap state updates in setState()

### Widget Creation
- ❌ Never export widget classes directly
- ❌ Never forget the factory function wrapper
- ✅ Always use classToFunction() or manual factory function

### Event Handling
- ❌ Never use onClick/onChange directly on widgets
- ✅ Always use GestureDetector for user interactions
- ✅ Use proper event names: onClick (not onTap in GestureDetector)

## Widget Lifecycle

### StatefulWidget Lifecycle
```typescript
class MyWidgetState extends State<MyWidget> {
  // Called once when state object is created
  initState(): void {
    super.initState();
    // Initialize animations, controllers, etc.
  }

  // Called when widget configuration changes
  didUpdateWidget(oldWidget: MyWidget): void {
    super.didUpdateWidget(oldWidget);
    // Update state based on new widget properties
  }

  // Called when state object is removed
  dispose(): void {
    // Dispose controllers, animations, listeners
    super.dispose();
  }

  // Called whenever setState() is called
  build(context: BuildContext): Widget {
    return Container({ /* ... */ });
  }
}
```

## Type Definitions

### Widget Props Pattern
```typescript
type WidgetNameProps = {
  // Required properties
  child: Widget;
  
  // Optional properties with defaults
  padding?: EdgeInsets;
  alignment?: Alignment;
  
  // Nullable properties
  width?: number;
  height?: number;
  
  // Callbacks
  onTap?: () => void;
  
  // Always include key for widget reconciliation
  key?: any;
};
```

### Common Type Imports
```typescript
import type { BuildContext } from "../element";
import type { Widget } from "../widget";
import type { RenderObject } from "../renderobject";
```