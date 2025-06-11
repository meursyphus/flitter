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