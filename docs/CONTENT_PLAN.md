# Page Content Plan v2

## Content Philosophy

**Lead with persuasion, follow with substance.**

Every page serves two personas simultaneously:
- **Evaluating Dev**: Comparing Flitter to Recharts/Chart.js. Needs to feel excited.
- **Building Dev**: Actively implementing a chart. Needs to find reference material.

The v1 plan over-indexed on marketing and proposed removing all config/element tables in favor of "just ask AI." That was wrong. Developers need reference material in the docs themselves. llms.txt is a **supplement**, not a replacement.

### Page Structure Pattern

Every page follows this flow:
```
1. HOOK    — Compelling headline/description (catches evaluating devs)
2. SHOW    — Live examples, code contrast, scenarios (engages both)
3. TEACH   — How it works, code examples (serves building devs)
4. REFERENCE — Config tables, element tables, specs (serves building devs)
5. NEXT    — Where to go next; llms.txt as a bonus tip, not replacement
```

### Key Principles
- Props/config tables: KEEP them, but put them AFTER the inspiring content (collapsed is fine)
- Element tables on Advanced pages: KEEP them, add scenario cards ABOVE them
- llms.txt: Mention as a productivity tip, not as "instead of reading docs"
- Use-case driven descriptions instead of feature lists
- Every page should work without AI assistance

---

## Home Page (`/`)

### Current State
- Hero: "High-quality open-source rendering libraries" + "Flutter's widget composition model"
- Library cards, chart carousel, 4 principles, 3-step getting started, framework logos

### Changes

#### 1. HOOK — Hero Section
Replace current taglines:

```
h1: "flitter"
tagline (large): "Charts are widget trees. You own the source."
subtitle (small): "A rendering engine that gives you Container, Stack, Text — not config objects.
Add charts with a CLI command. Every sub-element is yours to replace."
```

**Why**: The current "High-quality open-source rendering libraries" is generic. The new copy immediately communicates the differentiator.

#### 2. SHOW — NEW "What You Can Build" Section
Insert between carousel and "Why Flitter":

```
heading: "What becomes possible when charts are widget trees"

bullets (styled as a sparse, scannable list):
- "Click a bar to filter every other chart on the dashboard"
- "Long-press a data point to open an annotation editor"
- "Stream real-time values and watch bars animate into place"
- "Drill from yearly → quarterly → daily with a single tap"
- "Embed any React or Svelte component inside a tooltip"
- "Generate an entire custom chart by describing it to your AI assistant"

footer: "None of these require plugins. They're possible because every element
is a widget you control."
```

#### 3. TEACH — Why Flitter Cards (revised copy)
Keep the 4-card grid. Sharpen copy:

**Card 1: "Not Config. Widgets."**
```
Every bar, axis, tooltip, and legend is a real widget — Container, Stack, Positioned, Text.
Not an options object with 200 properties. A tree you can read, modify, and extend.
```

**Card 2: "Source Code You Own"**
```
npx flitter-ui add bar-chart drops the full source into your project.
There is no hidden runtime. Delete the CLI after install. It's your code now.
```

**Card 3: "LLM Native"**
```
Feed one URL to Claude, Cursor, or Copilot. It reads the full widget API and generates
charts end-to-end. A powerful shortcut when you want to move fast.
```

**Card 4: "Complex Scenarios, Built In"**
```
Cross-filtering, drill-down, annotations, real-time updates — these aren't plugins.
They're structurally possible because every element is a composable widget.
```

#### 4. REFERENCE — Getting Started (revised Step 3)

```
Step 3: "Make it yours"
"Open the source. Every axis label, grid line, and tooltip is a widget function.
Swap the tooltip for a rich card. Add click handlers to bars. Build drill-down navigation.
It's not configuration — it's composition."
```

#### 5. NEXT — No changes needed (existing nav is sufficient)

---

## Chart Landing (`/chart`)

### Current State
- Hero with "rendering engine, not config wrapper"
- 4 principles cards
- LLM Native badge
- Browse Charts carousel

### Changes

#### 1. HOOK — Hero (keep + expand)

```
h1: "Charts"
tagline: "This is not a chart config wrapper. It's a rendering engine."
subtitle: "Every chart is a tree of widgets — Container, Stack, Positioned, Text.
Run npx flitter-ui add to get the source. Read it. Change it. Own it."
```

#### 2. SHOW — Replace 4 Principles with "How It's Different"

Instead of 4 abstract cards, show a **code contrast**:

```
heading: "How It's Different"

Left column (label: "Config Libraries"):
  "barChart({ tooltip: { backgroundColor: '#333', fontSize: 13 } })"
  "Hope the option exists. File an issue if it doesn't."

Right column (label: "Flitter"):
  "custom: { tooltip: (args) => Container({ child: YourComponent(args) }) }"
  "It's a widget. Put anything inside it."
```

This is the single most persuasive element on the site. Show the ACTUAL difference in code shape.

#### 3. TEACH — Integrate LLM section naturally

Replace the separate LLM badge with an integrated section:

```
heading: "Works With AI Assistants"
text: "The full chart API is published at a single URL. Feed it to Claude Code,
Cursor, or any AI coding assistant for instant chart generation."

code: ui.flitter.dev/llm/chart.md

subtext: "A fast way to explore the API and generate custom charts."
```

**Key difference from v1**: The language says "a fast way" not "the only way." It's positioned as a productivity tip, not a replacement for docs.

#### 4. REFERENCE — Browse Charts
Keep the carousel/grid. Add intro:
```
"10+ chart types, 2 visual styles, infinite customization. Pick one and make it yours."
```

#### 5. NEXT — Implicit via chart grid links

---

## Chart Overview Pages (template: overview-page.tsx)

### Current State
- Title + description, CLI badge, style links, showcase gallery or legacy layout

### Changes

#### 1. HOOK — Description pattern (use-case driven)
Change from feature lists to use-case descriptions:

For Bar Chart:
```
current: "Grouped bars with negative values, horizontal layouts, and multi-series support."
new: "Compare categories side by side. Revenue by region, survey responses, budget vs actual —
if you're comparing discrete groups, this is your chart."
```

For Line Chart:
```
new: "Show change over time. Revenue trends, user growth, sensor readings —
connect the dots and see the story."
```

For Area Chart:
```
new: "Line charts with weight. Fill the area under the curve to emphasize volume,
show composition, or highlight cumulative trends."
```

**Pattern**: "[What it shows]. [2-3 real scenarios]. [One-line benefit]."

#### 2. SHOW — Gallery
Already good. Showcase gallery cards have contextual subtitles. No changes needed.

#### 3. TEACH — No changes (links to style pages serve this role)

#### 4. REFERENCE — No changes (overview is navigational by nature)

#### 5. NEXT — Add "Go Further" after gallery

```
text: "Every element in these charts — bars, axes, labels, tooltips, legends, grid lines —
is a widget you can replace. See the Advanced page to learn how."
link: Advanced →
```

---

## Style Pages (template: style-page.tsx)

### Current State
- Back link + title, style inspiration, collapsible config tables, chart examples, footer

### Changes

#### 1. HOOK — Add style description
Each style gets a one-liner about its visual identity:

Toast:
```
"Clean, minimal, warm. Inspired by modern dashboard design with generous whitespace
and soft colors."
```

AG:
```
"Data-dense, professional, grid-ready. Inspired by AG Grid's approach to
information-heavy interfaces."
```

#### 2. SHOW — Chart examples (enhance subtitles)
Keep examples. Add contextual one-line subtitles:

```
Instead of just: "Vertical"
→ "Vertical — the default layout, categories on the x-axis"

Instead of just: "Horizontal"
→ "Horizontal — flip the axes when you have long category labels"

Instead of just: "Negative Vertical"
→ "Negative values — profit & loss, temperature, or any bipolar data"
```

#### 3. TEACH — No changes needed (examples serve this role)

#### 4. REFERENCE — KEEP config tables, improve presentation

**THIS IS THE KEY CORRECTION FROM V1.**

v1 proposed removing config tables entirely. That was wrong. A developer tweaking
`axis.label.gap` from 8 to 12 needs the config reference right here.

**Keep the collapsible `<details>` config section exactly as it is.**
The current implementation is already good: collapsed by default (doesn't overwhelm evaluating devs), expandable for building devs.

**Improvement**: Add a brief intro line above the config table:

```
"All configuration is optional — the defaults are production-ready.
Expand to see every available property."
```

**Additional improvement**: After the config section, add an AI tip (NOT as replacement):

```
small text: "Tip: Paste ui.flitter.dev/llm/chart.md into your AI assistant to explore
config options interactively."
```

#### 5. NEXT — Footer link to Advanced (already exists)

---

## Advanced Pages (template: advanced-page.tsx)

### Current State
- Back link + title, "Custom renderers and headless architecture"
- LLM hint with URL, collapsible elements table, code example, footer

### Changes

#### 1. HOOK — New description

```
current: "Custom renderers and headless architecture for bar charts."
new: "Every visual element in this chart is a widget you can replace.
Build exactly the visualization your product needs."
```

#### 2. SHOW — NEW "What You Can Build" scenario cards

Add ABOVE the elements table. This is the inspirational content that was missing:

```
heading: "What You Can Build"

scenario cards (2-column grid, each with title + 2-line description):

1. "Custom Tooltips"
   "Replace the default tooltip with a rich card showing images, sparklines,
    or action buttons. It's just a widget — put anything inside."

2. "Click-to-Drill"
   "Add onClick to any bar. Navigate from yearly overview to quarterly detail
    to daily breakdown. Each level is a new widget tree."

3. "Conditional Styling"
   "Color bars based on thresholds. Show red below target, green above.
    The bar renderer receives the value — your logic, your rules."

4. "Custom Axes"
   "Replace axis labels with icons, images, or mini-charts.
    The label renderer is a widget factory — return anything."

5. "Annotations"
   "Overlay target lines, threshold bands, or callout labels.
    The plot area is a Stack — add positioned widgets anywhere."

6. "Real-Time Updates"
   "Feed new data and the chart rebuilds its widget tree.
    Animated transitions come built-in with the Flitter animation system."
```

#### 3. TEACH — Code example (improve heading)

Change heading from "Usage" to "How Custom Renderers Work". Add intro:

```
"Pass a custom object with widget factory functions. Each function receives
element-specific args and returns any Flitter widget."
```

Keep the existing code example.

#### 4. REFERENCE — KEEP the Customizable Elements table

**THIS IS THE KEY CORRECTION FROM V1.**

v1 proposed removing the elements table entirely. That was wrong. A developer building
a custom barGroup renderer NEEDS to know the args signature:
`{ bars: { bar: Widget, value: number, datasetIndex: number }[], index: number, label: string }`

**Keep the collapsible `<details>` elements table exactly as it is.**

The table is already collapsed by default. It doesn't overwhelm evaluating devs,
but it's there when building devs need it.

**Improvement**: Add a brief intro connecting scenarios to the table:

```
"Each scenario above maps to one or more elements below. Every visual element
can be replaced with a custom renderer function."
```

#### 5. NEXT — LLM hint as productivity tip

Keep the existing LLM hint but adjust the framing:

```
heading: "Build Faster With AI"
text: "Describe what you want to customize and let your AI assistant generate
the renderer code. Feed it the full API spec:"

code: ui.flitter.dev/llm/chart.md

text: "Works with Claude Code, Cursor, Windsurf, and any tool that accepts URL context."
```

**Key difference from v1**: This says "build faster" not "build with AI." It's a speed
boost, not a replacement for understanding the elements table above.

---

## Installation Page (`/chart/installation`)

### Current State
- Prerequisites, Quick setup, Add first chart, Choose a style, Framework setup

### Changes

#### 1. HOOK — Add opener paragraph

```
"Flitter charts are source code, not a dependency. After setup, the full chart
implementation lives in your project — every widget, every renderer, every type definition.
There's no black box."
```

#### 2. SHOW — No changes needed

#### 3. TEACH — Expand "What you get" after `npx flitter-ui add bar-chart`:

```
current:
  "- The chart component file
   - All sub-widgets (axis, tooltip, legend, etc.)
   - Type definitions"

new:
  "This creates a complete chart in your project:
   - The main chart component
   - Every sub-widget: axis labels, grid lines, tooltip, legend, bars
   - Full TypeScript types
   - A headless controller that handles scales, layout, and data transforms

   Every file is yours. Edit anything. Delete the CLI after install."
```

#### 4. REFERENCE — No changes (this page IS the reference)

#### 5. NEXT — Keep "Next steps" links (they're useful for onboarding flow)

---

## Quick Start Page (`/chart/quick-start`)

### Current State
- 4 steps: Initialize, Add, Use, Customize
- Custom tooltip code example (the best content on the entire site)
- "What you own" section

### Changes

#### 1. HOOK — Already good (no changes to intro)

#### 2. SHOW — Already excellent (tooltip example)

#### 3. TEACH — Expand Step 4 after tooltip example

```
"This is the key insight: BarChart() doesn't have a tooltip option with 20 sub-properties.
It has a tooltip widget slot. You provide a function that returns ANY widget.

Want a tooltip with an image? Return an Image widget.
Want a tooltip with a sparkline? Return a LineChart widget inside the tooltip.
Want a tooltip with an action button? Return a GestureDetector wrapping a button.

There are no limits because there is no config API to limit you."
```

#### 4. REFERENCE — Sharpen "What you own" bullets

```
current: "Edit any widget — axis labels, grid lines, legends"
new: "Edit any widget — axis labels are Text widgets, grid lines are Container widgets,
legends are Row widgets with GestureDetector for click handling"

current: "Add animations — the full Flutter animation system is available"
new: "Add animations — AnimationController, CurvedAnimation, Tween, and every Flutter
animation primitive works out of the box"

current: "Delete the CLI — there's no runtime dependency on the package"
new: "Delete the CLI — after npx flitter-ui add, the CLI is irrelevant.
Your chart has zero dependency on flitter-ui the package."
```

#### 5. NEXT — Keep existing links

---

## Integration Page (`/integration`)

### Current State
- React, Svelte, Vanilla JS with code + props tables + source viewers + SVG vs Canvas

### Changes

#### 1. HOOK — Add opener

```
"The chart widget is framework-agnostic. You create it with pure JavaScript,
then mount it using a thin adapter for your framework. Switching frameworks later
means changing 3 lines of mounting code — the chart stays the same."
```

#### 2-5. No other changes needed

This page is correctly structured as a reference. Props tables for the Widget mount
component are appropriate — this IS the integration API.

---

## Cross-Cutting Decisions

### 1. Config/Element Tables: KEEP with proper placement
- Style pages: config tables stay, collapsed by default, after examples
- Advanced pages: element tables stay, collapsed by default, after scenario cards
- Integration page: props tables stay, inline (they're the primary content)
- llms.txt: mentioned as a productivity tip on Advanced pages, NOT as a replacement

### 2. llms.txt positioning
The message is: "This is a shortcut for power users and AI-assisted workflows."
NOT: "This replaces documentation."
NOT: "No docs to read."

Every mention of llms.txt should be framed as:
```
"Tip: For AI-assisted development, paste [url] into your coding assistant."
```

### 3. Use-case driven descriptions
Chart descriptions follow: "[What it shows]. [Real scenarios]. [Benefit]."
Not: "[Technical features]. [Data formats]."

### 4. Scenario cards on Advanced pages
Each chart type's Advanced page gets scenario cards ABOVE the elements table.
These map inspiring use cases to specific elements, creating a bridge between
"what's possible" and "how to build it."

### 5. Default colors only
All example charts use default style colors. No custom color configs in docs.

---

## Implementation Priority

### P0 — Highest Impact
1. **Advanced page overhaul** — Add scenario cards ABOVE existing elements table
2. **Home page hero + "What becomes possible"** — New tagline, new section
3. **Chart landing "How It's Different"** — Code contrast is most persuasive element

### P1 — Important
4. **Style page improvements** — Better subtitles, config table intro text, AI tip
5. **Overview descriptions** — Switch to use-case driven copy
6. **Quick Start expansion** — Amplify Step 4, sharpen "What you own"

### P2 — Polish
7. **Installation opener** — Source-code-first messaging
8. **Integration opener** — Framework-agnostic messaging

---

## Implementation Details: Component Changes

### advanced-page.tsx
- Add new `scenarioCards` section BEFORE the elements table
- Scenario data can be added to `AdvancedPageData` type as optional `scenarios?: ScenarioCard[]`
- Change "Usage" heading to "How Custom Renderers Work"
- Keep elements table and LLM hint as-is (adjust LLM hint copy)

### style-page.tsx
- Add intro text above config `<details>`: "All configuration is optional..."
- Add AI tip text below config section
- No structural changes — the collapsible config is already well-implemented

### overview-page.tsx
- Update description text in data files (not template)
- Add "Go Further" section after gallery for charts with Advanced pages

### chart-landing.tsx
- Replace Principle cards with "How It's Different" code comparison
- Rework LLM badge into integrated section with softer framing
- Keep Browse Charts carousel

### page.tsx (home)
- Update hero taglines
- Add "What becomes possible" section between carousel and Why Flitter
- Update Why Flitter card copy

### Data type changes (types.ts)
```ts
// Add to AdvancedPageData:
export type ScenarioCard = {
  title: string;
  description: string;
};

export type AdvancedPageData = ChartPageBase & {
  pageType: "advanced";
  parent: string;
  code: { basic: string };
  customElements: CustomElement[];
  scenarios?: ScenarioCard[];  // NEW
};
```

---

## Final Ratings (Round 3)

| Page | Persuasiveness | Utility | Notes |
|------|:-:|:-:|-------|
| Home (`/`) | 8 | 5 | Strong hook. Utility comes from linked pages, which is correct for a landing page. |
| Chart Landing | 8 | 5 | Code contrast is very persuasive. Utility is navigational, which is correct. |
| Overview | 7 | 6 | Use-case descriptions help both personas. Gallery is good. |
| Style | 6 | 9 | Config tables provide real utility. Style description adds personality. |
| Advanced | 9 | 8 | Scenario cards inspire. Elements table provides reference. Both personas well-served. |
| Installation | 6 | 8 | Functional page, opener adds character. Primary job is utility. |
| Quick Start | 9 | 7 | Tooltip example is inspiring AND instructive. Expanded Step 4 deepens understanding. |
| Integration | 5 | 9 | Reference page. Opener adds minimal persuasion. Primary job is utility. |

### Balance Assessment
- v1 plan average: Persuasiveness 8.0, Utility 3.5 (too marketing-heavy)
- v2 plan average: Persuasiveness 7.3, Utility 7.1 (balanced)

The slight drop in persuasiveness is the right trade. A developer who can't find
`axis.label.gap` will leave angry, regardless of how exciting the landing page was.
