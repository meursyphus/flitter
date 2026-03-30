# Docs Redesign Plan — Final Implementation Guide

## Package Name Reference (Canonical)

| Workspace Name | Published npm Name | Purpose |
|---|---|---|
| `flitter-core` | `flitter-core` | Core rendering engine |
| `flitter-ui` | `flitter-ui` | CLI package (`npx flitter-ui`) |
| `flitter-chart` | NOT published (private) | Chart source code (copy-paste via CLI) |
| `@flitterjs/react` | `@flitterjs/react` | React integration |
| `@flitterjs/svelte` | `@flitterjs/svelte` | Svelte integration |

**Wrong names in docs:**
- `@meursyphus/flitter` -- old npm name, replace with `flitter-core`
- `@meursyphus/flitter-react` -- old, replace with `@flitterjs/react`
- `@meursyphus/flitter-svelte` -- old, replace with `@flitterjs/svelte`
- `@flitterjs/chart` -- DOES NOT EXIST. Charts are local source code, not an npm package
- `flitter add` -- wrong CLI command, should be `npx flitter-ui add`

---

## Phase 1: Fix Package Names Across All Docs

### Priority: HIGHEST (correctness)

#### File: `docs/src/app/chart/installation/page.mdx`
- Line 25: `@meursyphus/flitter` -> `flitter-core`
- Line 26: `@meursyphus/flitter-react` or `@meursyphus/flitter-svelte` -> `@flitterjs/react` or `@flitterjs/svelte`
- Line 56: `import { Widget } from "@meursyphus/flitter-react"` -> `import Widget from "@flitterjs/react"`
- Line 74: `import Widget from "@meursyphus/flitter-svelte"` -> `import Widget from "@flitterjs/svelte"`

#### File: `docs/src/app/chart/quick-start/page.mdx`
- Line 29: `import { Widget } from "@meursyphus/flitter-react"` -> `import Widget from "@flitterjs/react"`

#### File: `docs/src/app/integration/page.mdx`
**Major rewrite needed.** Current page says `npm install @flitterjs/chart @flitterjs/react`. This is wrong.

Changes:
- Line 15: `npm install @flitterjs/chart @flitterjs/react` -> `npm install @flitterjs/react flitter-core`
- Line 22: `import { BarChart } from "@flitterjs/chart"` -> `import BarChart from "./charts/bar-chart"` (local import after `npx flitter-ui add`)
- Line 22: `import Widget from "@flitterjs/react"` -> keep as-is (correct)
- Line 116: `npm install @flitterjs/chart @flitterjs/svelte` -> `npm install @flitterjs/svelte flitter-core`
- Line 124: `import { BarChart } from "@flitterjs/chart"` -> `import BarChart from "./charts/bar-chart"`
- Line 238: `npm install @flitterjs/chart flitter-core` -> `npm install flitter-core`
- Line 251: `import { BarChart } from "@flitterjs/chart"` -> `import BarChart from "./charts/bar-chart"`
- Add note at top: "Charts are added via `npx flitter-ui add bar-chart` which copies source code into your project."

#### File: `docs/src/app/page.tsx` (landing page)
- Line 28: npm link `https://www.npmjs.com/package/@meursyphus/flitter` -> update to `https://www.npmjs.com/package/flitter-core` (or keep if old package is still the published one)
- Line 285: same npm link

#### Files: All `advanced.ts` files (10 files)
Each contains `import { XChart } from "@flitterjs/chart"` in code snippets. Change to local import path.

Files:
- `docs/src/app/chart/_data/bar-chart/advanced.ts`
- `docs/src/app/chart/_data/line-chart/advanced.ts`
- `docs/src/app/chart/_data/area-chart/advanced.ts`
- `docs/src/app/chart/_data/pie-chart/advanced.ts`
- `docs/src/app/chart/_data/scatter-chart/advanced.ts`
- `docs/src/app/chart/_data/radar-chart/advanced.ts`
- `docs/src/app/chart/_data/bubble-chart/advanced.ts`
- `docs/src/app/chart/_data/heatmap-chart/advanced.ts`
- `docs/src/app/chart/_data/stacked-bar-chart/advanced.ts`
- `docs/src/app/chart/_data/stacked-area-chart/advanced.ts`

Change: `import { XChart } from "@flitterjs/chart"` -> `import { XChart } from "./charts/x-chart"` (local path after CLI add)

#### Files: Advanced widget pages (4 files)
- `docs/src/app/advanced/what-is-flitter/page.mdx` (1 occurrence)
- `docs/src/app/advanced/widget-system/page.mdx` (2 occurrences)
- `docs/src/app/advanced/widgets/draggable/page.mdx` (7 occurrences)
- `docs/src/app/advanced/widgets/indexed-stack/page.mdx` (7 occurrences)

Change: `@meursyphus/flitter` -> `flitter-core` in all import statements

#### File: `docs/src/app/chart/_components/chart-showcase.tsx`
All 18 `command` values say `flitter add ...` -> change to `npx flitter-ui add ...`

---

## Phase 2: Header Cleanup + Sidebar Restructure

### Priority: HIGH

#### File: `docs/src/components/header.tsx`

**Remove** the nav links section (Chart, Core API, Integration) from both desktop and mobile.
Keep: Brand (FLITTER + product indicator) on left, GitHub icon on right.

Specific changes:
- Lines 46-79 (desktop nav): Remove the 3 Link elements for Chart, Core API, Integration. Keep only the GitHub icon link and the divider before it (remove divider too since it separated nav from GitHub).
- Lines 123-159 (mobile menu nav items): Remove the 3 Link elements. Keep only the GitHub link.

Result: Header becomes `[FLITTER CHART] ---- [GitHub icon]`

#### File: `docs/src/lib/navigation.ts`

**Remove Toast/AG children** from all chart nav items. Keep only Advanced as child.

Change `chartNav` (lines 51-153):
```typescript
export const chartNav: Navigation = {
  sections: [
    {
      title: "Getting Started",
      items: [
        { title: "Overview", href: "/chart" },
        { title: "Installation", href: "/chart/installation" },
        { title: "Quick Start", href: "/chart/quick-start" },
      ],
    },
    {
      title: "Charts",
      items: [
        { title: "Bar Chart", href: "/chart/bar-chart",
          children: [{ title: "Advanced", href: "/chart/bar-chart/advanced" }] },
        { title: "Line Chart", href: "/chart/line-chart",
          children: [{ title: "Advanced", href: "/chart/line-chart/advanced" }] },
        { title: "Area Chart", href: "/chart/area-chart",
          children: [{ title: "Advanced", href: "/chart/area-chart/advanced" }] },
        { title: "Pie Chart", href: "/chart/pie-chart",
          children: [{ title: "Advanced", href: "/chart/pie-chart/advanced" }] },
        { title: "Scatter Chart", href: "/chart/scatter-chart",
          children: [{ title: "Advanced", href: "/chart/scatter-chart/advanced" }] },
        { title: "Radar Chart", href: "/chart/radar-chart",
          children: [{ title: "Advanced", href: "/chart/radar-chart/advanced" }] },
        { title: "Bubble Chart", href: "/chart/bubble-chart",
          children: [{ title: "Advanced", href: "/chart/bubble-chart/advanced" }] },
        { title: "Heatmap Chart", href: "/chart/heatmap-chart",
          children: [{ title: "Advanced", href: "/chart/heatmap-chart/advanced" }] },
        { title: "Stacked Bar Chart", href: "/chart/stacked-bar-chart",
          children: [{ title: "Advanced", href: "/chart/stacked-bar-chart/advanced" }] },
        { title: "Stacked Area Chart", href: "/chart/stacked-area-chart",
          children: [{ title: "Advanced", href: "/chart/stacked-area-chart/advanced" }] },
      ],
    },
    {
      title: "Recipes",
      items: [
        { title: "Cross-filtering", href: "/chart/recipes/cross-filtering", status: "coming" },
        { title: "Drill-down", href: "/chart/recipes/drill-down", status: "coming" },
        { title: "Annotations", href: "/chart/recipes/annotations", status: "coming" },
        { title: "Real-time Data", href: "/chart/recipes/real-time", status: "coming" },
      ],
    },
  ],
};
```

**Note:** The `kind: "style"` NavItem type can remain in the type definition for backward compatibility but will no longer be used in chartNav.

---

## Phase 3: Overview Page Style Toggle

### Priority: MEDIUM

#### New File: `docs/src/app/chart/_components/showcase-gallery.tsx`

Create a client component that wraps the showcase examples with a filter toggle.

```tsx
"use client";

import { useState } from "react";

type StyleFilter = "all" | "Toast" | "AG";

type ShowcaseExample = {
  title: string;
  subtitle: string;
  style: "Toast" | "AG";
  chart: React.ReactNode;
  height?: number;
  featured?: boolean;
};

export default function ShowcaseGallery({
  examples,
}: {
  examples: ShowcaseExample[];
}) {
  const [filter, setFilter] = useState<StyleFilter>("all");

  const filtered = filter === "all"
    ? examples
    : examples.filter((e) => e.style === filter);

  const featuredExample = filtered.find((e) => e.featured);
  const gridExamples = filtered.filter((e) => !e.featured);

  const hasAG = examples.some((e) => e.style === "AG");

  return (
    <section className="px-6 pt-10 pb-16 md:px-10">
      {/* Filter pills */}
      {hasAG && (
        <div className="mb-6 flex items-center gap-2">
          {(["all", "Toast", "AG"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
              }`}
            >
              {f === "all" ? "All Styles" : f}
            </button>
          ))}
        </div>
      )}

      {/* Featured hero card */}
      {featuredExample && (
        /* ... existing hero card markup from overview-page.tsx ... */
      )}

      {/* Grid cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {gridExamples.map((example, i) => (
          /* ... existing grid card markup from overview-page.tsx ... */
        ))}
      </div>
    </section>
  );
}
```

#### File: `docs/src/app/chart/_components/overview-page.tsx`

Replace the inline showcase section (lines 87-163) with the new `ShowcaseGallery` component:

```tsx
import ShowcaseGallery from "./showcase-gallery";

// In the return JSX, replace the showcase section with:
{hasShowcase && <ShowcaseGallery examples={showcaseExamples!} />}
```

The `ShowcaseGallery` component moves the entire showcase rendering to a client component, enabling the filter state.

---

## Phase 4: Recipes Scaffold

### Priority: LOW (coming soon placeholder)

No actual pages needed. The sidebar items from Phase 2 have `status: "coming"` which renders them grayed out in the sidebar. That's the entire scaffold.

When the user is ready to add recipes:
1. Create `docs/src/app/chart/recipes/[slug]/page.tsx` (dynamic route)
2. Create recipe data files in `docs/src/app/chart/_data/recipes/`
3. Update nav items status from `"coming"` to `"available"` or `"new"`

---

## Phase 5: Code Generation Script for Example Strings

### Priority: LOW (future improvement)

Currently, code snippets in advanced.ts files are hardcoded template strings. A build script could generate them from actual source files.

Script location: `docs/scripts/generate-example-strings.mjs`

This script would:
1. Read chart source files from `packages/chart/src/charts/*/`
2. Extract the headless usage pattern
3. Generate template strings with proper imports
4. Write to `docs/src/app/chart/_data/*/advanced.ts`

**Defer this until the package name fixes are stable.**

---

## Complete File Change List (Priority Order)

### Must Fix (Correctness)

| # | File | Change | Status |
|---|---|---|---|
| 1 | `docs/src/app/chart/installation/page.mdx` | Fix all package name imports | TODO |
| 2 | `docs/src/app/chart/quick-start/page.mdx` | Fix React import | TODO |
| 3 | `docs/src/app/integration/page.mdx` | Major rewrite: remove @flitterjs/chart, use local imports | TODO |
| 4 | `docs/src/app/chart/_data/bar-chart/advanced.ts` | Fix import in code snippet | TODO |
| 5 | `docs/src/app/chart/_data/line-chart/advanced.ts` | Fix import in code snippet | TODO |
| 6 | `docs/src/app/chart/_data/area-chart/advanced.ts` | Fix import in code snippet | TODO |
| 7 | `docs/src/app/chart/_data/pie-chart/advanced.ts` | Fix import in code snippet | TODO |
| 8 | `docs/src/app/chart/_data/scatter-chart/advanced.ts` | Fix import in code snippet | TODO |
| 9 | `docs/src/app/chart/_data/radar-chart/advanced.ts` | Fix import in code snippet | TODO |
| 10 | `docs/src/app/chart/_data/bubble-chart/advanced.ts` | Fix import in code snippet | TODO |
| 11 | `docs/src/app/chart/_data/heatmap-chart/advanced.ts` | Fix import in code snippet | TODO |
| 12 | `docs/src/app/chart/_data/stacked-bar-chart/advanced.ts` | Fix import in code snippet | TODO |
| 13 | `docs/src/app/chart/_data/stacked-area-chart/advanced.ts` | Fix import in code snippet | TODO |
| 14 | `docs/src/app/chart/_components/chart-showcase.tsx` | Fix all `flitter add` -> `npx flitter-ui add` | TODO |
| 15 | `docs/src/app/advanced/what-is-flitter/page.mdx` | `@meursyphus/flitter` -> `flitter-core` | TODO |
| 16 | `docs/src/app/advanced/widget-system/page.mdx` | `@meursyphus/flitter` -> `flitter-core` | TODO |
| 17 | `docs/src/app/advanced/widgets/draggable/page.mdx` | `@meursyphus/flitter` -> `flitter-core` | TODO |
| 18 | `docs/src/app/advanced/widgets/indexed-stack/page.mdx` | `@meursyphus/flitter` -> `flitter-core` | TODO |
| 19 | `docs/src/app/page.tsx` | Fix npm links (lines 28, 285) | TODO |

### Structure Changes

| # | File | Change | Status |
|---|---|---|---|
| 20 | `docs/src/components/header.tsx` | Remove nav links, keep brand + GitHub only | TODO |
| 21 | `docs/src/lib/navigation.ts` | Remove Toast/AG children, add Recipes section | TODO |

### New Components

| # | File | Change | Status |
|---|---|---|---|
| 22 | `docs/src/app/chart/_components/showcase-gallery.tsx` | NEW: Client component with style filter toggle | TODO |
| 23 | `docs/src/app/chart/_components/overview-page.tsx` | Import and use ShowcaseGallery | TODO |

---

## TODO List for User (Complex Examples)

These are items the user will add LATER. Do NOT implement now.

- [ ] Cross-filtering recipe: Two charts that filter each other on click
- [ ] Drill-down recipe: Click a bar to expand into sub-categories
- [ ] Annotations recipe: Add custom labels/markers to chart data points
- [ ] Real-time data recipe: Streaming data with animated transitions
- [ ] Dashboard composition recipe: Multiple charts in a responsive grid layout

---

## Verification Checklist

After implementing all changes:

- [ ] `npm run docs:build` completes without errors
- [ ] All pages render correctly at each route
- [ ] No occurrences of `@meursyphus/flitter` in docs/src (except possibly npm link URLs if old package is still published)
- [ ] No occurrences of `@flitterjs/chart` anywhere in docs
- [ ] No occurrences of bare `flitter add` (should all be `npx flitter-ui add`)
- [ ] Header shows only brand + GitHub (desktop and mobile)
- [ ] Sidebar for /chart has no Toast/AG children
- [ ] Sidebar for /chart has Recipes section with "coming soon" items
- [ ] Style toggle on overview pages filters examples correctly
- [ ] Style routes (/chart/bar-chart/toast, /chart/bar-chart/ag) still work via direct URL
- [ ] Mobile navigation works (hamburger menu, sidebar overlay)
- [ ] Landing page carousel still renders all charts

---

## Architecture Notes

### Routing (unchanged)
- `/chart` -> `chart/page.tsx` -> `ChartLanding`
- `/chart/[...slug]` -> `chart/[...slug]/page.tsx` -> dispatches to OverviewPage/StylePage/AdvancedPage
- Style routes like `/chart/bar-chart/toast` KEEP WORKING (they're just not in sidebar nav)

### Data Flow (unchanged)
- `chartPages` array in `_data/index.ts` drives all routes
- `generateStaticParams()` generates all slug combinations
- `findChartPage()` finds data by slug
- No changes needed to this routing mechanism

### Key Directive Compliance
- "Props listing forbidden": Style pages keep config in `<details>` (collapsed). No new props tables added.
- "Default colors, no custom color in examples": Showcase examples already use default style colors.
- "Two install paths": Overview pages show `npx flitter-ui add` pill. Style pages can add copy-paste instructions.
- "LLM Native": Advanced pages already have llms.txt URL. Keep as-is.
