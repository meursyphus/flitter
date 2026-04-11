# Gallery Examples Planning

All examples use English data. Detailed data values are up to the implementer.

Status: `[ ]` = TODO, `[~]` = in progress, `[x]` = done

---

### Bar Chart
- [ ] AG / `city-rent` — Average rent by city, single series, simple
- [ ] Toast / `department-revenue` — Quarterly revenue by department, multi legend
- [ ] Toast / `horizontal-pill` — Horizontal, negative data included, custom bar (pill-shaped borderRadius, lighter fill + outline, custom colors)

### Stacked Bar Chart
- [ ] AG / `energy-mix` — Vertical, energy source composition by year
- [ ] Toast / `regional-sales` — Horizontal, product category sales by region
- [ ] Toast / `nivo-pattern` — Vertical, custom bar with CustomPaint (per-legend patterns: dots, stripes, nivo-style), legend position right-bottom, legend color box 2x bigger than toast default. Reference code below:
```ts
// CustomPaint bar example (dots for "fries", stripes for "sandwich")
const Bar = (...[{ label, legend, value }, { data }]) => {
  const index = data.datasets.findIndex((dataset) => dataset.legend === legend);
  const backgroundColor = backgroundColors[index];
  return Container({
    width: Infinity,
    margin: EdgeInsets.symmetric({ horizontal: 11 }),
    height: Infinity,
    color: backgroundColor,
    child: Stack({
      alignment: Alignment.center,
      clipped: true,
      children: [
        CustomPaint({
          size: Size.maximum(),
          painter: {
            svg: {
              createDefaultSvgEl(context) {
                return { bar: context.createSvgEl("path") };
              },
              paint({ bar }, size) {
                // dots pattern
                if (legend === "fries") {
                  const path = new Path();
                  bar.setAttribute("fill", "#38bcb2");
                  for (let y = 2; y < size.height; y += 8) {
                    for (let x = 2 + (y % 16) / 2; x < size.width; x += 10) {
                      path.addOval(Rect.fromCircle({ center: new Offset({ x, y }), radius: 2 }));
                    }
                  }
                  bar.setAttribute("d", path.getD());
                }
                // stripes pattern
                if (legend === "sandwich") {
                  const path = new Path();
                  const { width, height } = size;
                  bar.setAttribute("stroke", "#eed312");
                  bar.setAttribute("stroke-width", "5");
                  for (let y = -Math.max(width, height); y < Math.max(width, height); y += 12) {
                    path.moveTo({ x: width, y });
                    path.lineTo({ x: 0, y: y + width });
                  }
                  bar.setAttribute("d", path.getD());
                }
              },
            },
            canvas: { /* same logic with canvas API */ },
          },
        }),
        Text(value > 20 ? `${value}` : "", {
          style: new TextStyle({ fontFamily: "Noto Sans JP", fontSize: 11, color: "#777777" }),
        }),
      ],
    }),
  });
};
```

### Line Chart
- [ ] AG / `monthly-active-users` — Multi line, monthly active users
- [ ] Toast / `channel-traffic` — Multi line, spline, negative data included

### Area Chart
- [ ] AG / `profit-loss` — Multi area, spline, negative data included
- [ ] Toast / `app-downloads` — Multi area, linear (pointy), no negatives

### Stacked Area Chart
- [ ] AG / `monthly-expenses` — Monthly expense composition
- [ ] Toast / `traffic-sources` — Session count by traffic source

### Pie Chart
- [ ] AG / `browser-share` — Legend hidden, outer axis hidden, minimal
- [ ] Toast / `budget-allocation` — Outer labels visible, inner data labels visible

### Donut Chart
- [ ] AG / `payment-methods` — Outer labels + inner data labels visible, center content shown
- [ ] Toast / `project-status` — Legend hidden, outer axis hidden, minimal

### Scatter Chart
- [ ] AG / `revenue-growth` — Lots of data points, upward trend
- [ ] Toast / `student-scores` — Multi series, scattered distribution, varied point shapes (circle/square etc.)

### Bubble Chart
- [ ] AG / `gdp-life-expectancy` — Country GDP vs life expectancy (population = size), distinct distribution
- [ ] Toast / `product-margin` — Product revenue vs margin (sales volume = size), different distribution pattern from AG

### Radar Chart
- [ ] AG / `skill-assessment` — Single series, legend hidden
- [ ] Toast / `team-comparison` — Multi series (Team A vs Team B)

### Heatmap Chart
- [ ] AG / `hourly-traffic` — Day × hour website traffic, default color tone
- [ ] Toast / `monthly-product-sales` — Month × product sales, red color palette

### Treemap Chart
- [ ] AG / TBD — implementer's choice
- [ ] Toast / TBD — implementer's choice

### Sunburst Chart
- [ ] AG / `org-structure` — Company org chart (Dept > Team > Member)
- [ ] Toast / `world-population` — World population (Continent > Region > Country)

---

## TODO Charts (chart not yet gallery-ready)

### Box Plot
- [ ] TBD

### Bullet Chart
- [ ] TBD

### Candlestick Chart
- [ ] TBD

### Funnel Chart
- [ ] TBD

### Histogram
- [ ] TBD

### Sankey Chart
- [ ] TBD

### Waterfall Chart
- [ ] TBD

---

## How to implement an entry

### Folder structure

```
entries/{chartType}/{style}/{example-name}/index.tsx
```

Example: `entries/bar-chart/toast/department-revenue/index.tsx`

### Entry file template

```tsx
"use client";

export const galleryTitle = "Quarterly Revenue by Department";

import Widget from "@flitterjs/react";
import { ToastBarChart } from "shared/chart";

export function createWidget() {
  return ToastBarChart({
    data: {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      datasets: [
        { legend: "Sales", values: [40, 65, 50, 80] },
        { legend: "Marketing", values: [30, 45, 35, 60] },
      ],
    },
    config: {
      title: { text: "Quarterly Revenue by Department", visible: true },
    },
  });
}

export default function BarChartToast() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
```

### Key rules

- `galleryTitle` — displayed in gallery, used as title
- `createWidget()` — must be exported, script extracts this for code snippets
- Default export — React component for rendering
- Import chart from `shared/chart` (script rewrites to `@/components/flitter/charts/...`)
- AG charts: `import { BarChart } from "shared/chart"` (no prefix)
- Toast charts: `import { ToastBarChart } from "shared/chart"` (Toast prefix)
- After adding, run `npm run gen:gallery` from `docs/` to regenerate
