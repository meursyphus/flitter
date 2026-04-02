# Chart Package Guidelines

## Headless Engine Rules

Headless engines (`src/headless/<chart>/`) are **pure logic layers**. They manage state, compute layout data, and delegate all visuals to custom builder slots.

### Headless Responsibilities

1. **State Management**: hover, series visibility, scale, dimensions
2. **Interaction Wiring**: Headless wraps custom builder outputs with GestureDetector — styles never add their own GestureDetector for standard interactions
3. **Argument Generation**: Headless computes and passes derived state as args to custom builders (e.g., `isHovered`, `isVisible`)

### Interaction Wiring Pattern

Headless automatically wraps these custom builder outputs:

| Builder | Wrapped With | Action |
|---------|-------------|--------|
| `bar` / `line` / `scatter` / `bubble` / `segment` | `GestureDetector` | `onMouseEnter` → hover, `onMouseLeave` → unhover |
| `legend` | `GestureDetector` | `onClick` → `toggleSeries` |
| `dataView` | `GestureDetector` | `onMouseLeave` → unhover all (behavior: "translucent") |

### Hover API Convention

Each headless controller must follow this pattern:

```typescript
// Set hover on specific element
hover[Element](index: number, legend: string): void

// Clear hover only if the specified element is currently hovered
unhover[Element](index: number, legend: string): void

// Clear all hover state (for dataView mouse leave)
unhoverAll[Element]s(): void

// Check hover state
is[Element]Hovered(index: number, legend: string): boolean
```

### Custom Builder Args Convention

Builders that have headless-managed interactions must receive derived state as args:

```typescript
// Element builders receive isHovered
bar: (args: { ..., isHovered: boolean }, context) => Widget
scatter: (args: { ..., isHovered: boolean }, context) => Widget

// Legend builders receive isVisible
legend: (args: { name, index, isVisible: boolean }, context) => Widget
```

**Styles must NOT**:
- Add GestureDetector for hover/click on bar, legend, or dataView
- Store local hover state (use global context state instead)
- Call `hoverX()` / `unhoverX()` / `toggleSeries()` directly

**Styles should**:
- Use `isHovered` / `isVisible` args to decide visual appearance
- Focus purely on visual rendering (colors, opacity, borders, shadows, animations)

### Tooltip Convention

- `tooltip` is registered as a custom builder slot in headless types
- Headless does NOT place the tooltip in the widget tree (placement strategy varies by style)
- Styles call `context.custom.tooltip(args, context)` to generate tooltip content
- Toast style: anchors tooltip to element (Tooltip widget)
- AG style: follows mouse cursor (overlay on dataView)

### What Headless Must NOT Do

- Decide visual styles (colors, fonts, opacity, shadows)
- Choose tooltip display mode (anchor vs follow)
- Apply animations
- Import style-specific modules
