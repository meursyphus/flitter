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
├── docs/             # Documentation site (Astro)
├── story/            # Storybook components
└── test/             # Test suite
shared/               # Shared diagram components
```

## Development Commands

### Core Development
```bash
# Build core library
npm run flitter:build

# Lint core library
cd packages/flitter && npm run lint

# Format code
cd packages/flitter && npm run format
```

### Documentation
```bash
# Start documentation dev server
npm run docs:start

# Build documentation site
npm run docs:build

# Build Lunaria localization dashboard
npm run lunaria:build

# Preview Lunaria dashboard
npm run lunaria:preview
```

### Testing
```bash
# Run tests in development mode
npm run test:dev

# Run integration tests with Playwright
npm run test:playwright

# Run specific test suite
cd packages/test && npm run test:integration

# Run unit tests
cd packages/test && npm run test:unit

# Run a single test file
cd packages/test && npx playwright test tests/specific-test.test.ts
```

### Storybook
```bash
# Start Storybook dev server
npm run story:start

# Build Storybook
npm run story:build

# Deploy to Chromatic (visual regression)
npm run story:chromatic
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
  
  updateRenderObject(renderObject: MyRenderObject): void {
    // Update render object properties
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

class MyWidgetState extends State<MyWidget> {
  // State variables as class properties
  myState = initialValue;
  
  build(context: BuildContext): Widget {
    return Container({ /* ... */ });
  }
}
```

## Key Development Areas

- **Widget Development**: `packages/flitter/src/component/`
- **Render Objects**: `packages/flitter/src/renderobject/`
- **Animation System**: `packages/flitter/src/animation/`
- **Type Definitions**: `packages/flitter/src/type/`
- **Core Engine**: `packages/flitter/src/framework/`
- **Tests**: `packages/test/tests/`
- **Documentation**: `packages/docs/src/content/`
- **Shared Components**: `shared/`

## Testing & Quality

### Test Structure
- **Integration Tests**: `packages/test/tests/` - Playwright-based UI tests
- **Performance Tests**: `packages/test/tests/tracking-performance.test.ts`
- **Visual Tests**: Storybook with Chromatic integration
- **Performance History**: `packages/test/performance-history/`

### Quality Tools
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured with TypeScript rules
- **Prettier**: Auto-formatting with pre-commit hooks
- **Husky**: Git hooks for quality checks
- **DeepSource**: Code quality analysis

### Writing Tests
```typescript
// Integration test example
import { test, expect } from '@playwright/test';

test('widget interaction', async ({ page }) => {
  await page.goto('/test-route');
  await page.click('[data-testid="button"]');
  await expect(page.locator('[data-testid="result"]')).toBeVisible();
});
```

## Build System

### Core Library Build
- **Bundler**: tsup (TypeScript bundler)
- **Output**: CommonJS and ESM formats
- **Types**: Generated .d.ts files

### Documentation Build
- **Framework**: Astro
- **Styling**: Tailwind CSS
- **Content**: MDX files with components

### Package Publishing
```bash
# Build and prepare for publishing
cd packages/flitter
npm run build
cd dist
npm publish
```

## Localization

The project supports 14 languages using Lunaria:
- Documentation is localized in `packages/docs/src/content/[lang]/`
- Lunaria dashboard tracks translation progress
- Use `npm run lunaria:build` to update the dashboard

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

## Performance Optimization

### Key Considerations
- Use `const` constructors where possible
- Implement `shouldRepaint` in custom painters
- Use keys for list items to optimize reconciliation
- Profile with Chrome DevTools Performance tab

### Performance Testing
```bash
# Run performance benchmarks
cd packages/test
npx playwright test tracking-performance.test.ts

# Results stored in performance-history/
```

## CI/CD Workflow

### GitHub Actions
- **Playwright Tests**: Run on every PR
- **Chromatic Deployment**: Visual regression on main branch
- **Documentation Build**: Deploy to production on release

### Pre-commit Hooks
- Prettier formatting via lint-staged
- Runs on staged files matching: `packages/**/*.{astro,js,jsx,ts,tsx,svelte,mdx}`

## Debugging Tips

### Development Tools
- Use Chrome DevTools for performance profiling
- Enable React DevTools for widget tree inspection
- Use `console.log` in render methods to trace rendering

### Common Issues
- **Widget not updating**: Check setState() usage
- **Layout issues**: Verify constraints propagation
- **Performance**: Profile render object paint methods