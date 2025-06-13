# Incorrect Decoration Usage in Tutorial Files

## Summary
Found multiple instances where `decoration` is used as a plain object instead of using the `new BoxDecoration()` wrapper. According to the correct pattern shown in some files, decoration should always be wrapped with `new BoxDecoration()`.

## Files with Incorrect Usage:

### English Tutorial Files:
1. `/packages/docs/src/content/tutorial/en/02_quick-start/003_interactive-button.mdx`
   - Lines ~107, ~249: `decoration: { color: Colors.blue[500], ... }`

2. `/packages/docs/src/content/tutorial/en/03_widget-interface-basics/002_widget-tree-structure.mdx`
   - Multiple instances: `decoration: { color: Colors.white, ... }`

3. `/packages/docs/src/content/tutorial/en/03_widget-interface-basics/003_factory-function-pattern.mdx`
   - Lines ~114, ~169, ~198, ~408, ~468, ~490: `decoration: { color: ..., ... }`

4. `/packages/docs/src/content/tutorial/en/03_widget-interface-basics/004_stateless-vs-stateful.mdx`
   - Multiple instances: `decoration: { color: ..., ... }`

### Korean Tutorial Files:
5. `/packages/docs/src/content/tutorial/ko/02_quick-start/003_interactive-button.mdx`
   - Same pattern as English version

6. `/packages/docs/src/content/tutorial/ko/03_widget-interface-basics/002_widget-tree-structure.mdx`
   - Same pattern as English version

7. `/packages/docs/src/content/tutorial/ko/03_widget-interface-basics/003_factory-function-pattern.mdx`
   - Same pattern as English version

8. `/packages/docs/src/content/tutorial/ko/03_widget-interface-basics/004_stateless-vs-stateful.mdx`
   - Same pattern as English version

9. `/packages/docs/src/content/tutorial/ko/04_basic-widget-api/002_text-display-styling.mdx`
   - Contains decoration usage

10. `/packages/docs/src/content/tutorial/ko/04_basic-widget-api/003_row-column-linear-layout.mdx`
    - Multiple instances: `decoration: { color: ..., ... }`

11. `/packages/docs/src/content/tutorial/ko/04_basic-widget-api/004_stack-overlay-position.mdx`
    - Multiple instances: `decoration: { color: ..., ... }`

## Correct Pattern:
```typescript
// ❌ Incorrect
decoration: {
  color: Colors.blue[500],
  borderRadius: 8,
  boxShadow: [...]
}

// ✅ Correct
decoration: new BoxDecoration({
  color: Colors.blue[500],
  borderRadius: BorderRadius.circular(8),
  boxShadow: [...]
})
```

## Files with Correct Usage (for reference):
- `/packages/docs/src/content/tutorial/en/04_basic-widget-api/001_container.mdx` (line 260)
- `/packages/docs/src/content/tutorial/ko/04_basic-widget-api/001_container-everything-box.mdx`
- Several files in the layout widgets section

## Action Required:
All instances of `decoration: { ... }` should be changed to `decoration: new BoxDecoration({ ... })` to maintain consistency and follow the correct Flitter API pattern.