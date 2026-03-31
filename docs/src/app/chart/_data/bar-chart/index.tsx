import type { ChartModule, ShowcaseExample } from "../types";
import { toastSummary } from "../styles/toast";
import { agSummary } from "../styles/ag";
import { toastStyle } from "./toast";
import { agStyle } from "./ag";
import {
  FeaturedRevenueToast,
  KpiCurrencyToast,
  ConditionalPLToast,
  HorizontalRankingToast,
  MonthlyRevenueToast,
} from "./toast/examples";
import {
  ExecutiveRevenueAg,
  ProductComparisonAg,
} from "./ag/examples";
import { advancedPage } from "./advanced";

const showcaseExamples: ShowcaseExample[] = [
  // ── 1. Baseline — config.title + legend position for layout variety ──
  {
    title: "Monthly Revenue",
    subtitle: "Regional breakdown with right-side legend",
    style: "Toast",
    chart: <FeaturedRevenueToast />,
    featured: true,
    code: `import ToastBarChart from "./charts/toast-bar-chart";

const chart = ToastBarChart({
  direction: "vertical",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      { legend: "North America", values: [4.2, 4.8, 3.9, 5.1, 5.6, 5.3] },
      { legend: "Europe", values: [3.1, 2.9, 3.4, 3.2, 3.8, 3.6] },
      { legend: "Asia Pacific", values: [2.1, 2.5, 2.3, 2.8, 2.6, 3.0] },
    ],
  },
  config: {
    colors: ["#0d9488", "#14b8a6", "#99f6e4"],
    title: { text: "Monthly Revenue ($M)", visible: true },
    legend: { position: "right-center" },
  },
});`,
  },

  // ── 2. Config-level polish — axis formatting for finance dashboards ──
  {
    title: "KPI Currency Formatting",
    subtitle: "Y-axis formatted as $K for finance dashboards",
    style: "Toast",
    chart: <KpiCurrencyToast />,
    code: `import ToastBarChart from "./charts/toast-bar-chart";

const chart = ToastBarChart({
  direction: "vertical",
  data: {
    labels: ["West", "East", "South", "North"],
    datasets: [
      { legend: "Closed", values: [82, 67, 54, 71] },
      { legend: "Pipeline", values: [45, 38, 62, 29] },
    ],
  },
  config: {
    colors: ["#0d9488", "#a7f3d0"],
    title: { text: "Sales by Region", visible: true },
    bar: { cornerRadius: 4 },
    axis: {
      label: {
        format: (name, _index, axis) =>
          axis === "y" ? \`$\${name}K\` : name,
      },
    },
    grid: { color: "rgba(0,0,0,0.04)" },
    padding: { top: 16, right: 24, bottom: 16, left: 24 },
  },
});`,
  },

  // ── 3. Data-driven styling — bars colored by value sign ──
  {
    title: "Conditional P&L",
    subtitle: "Green/red bars based on positive/negative values",
    style: "Toast",
    chart: <ConditionalPLToast />,
    code: `import ToastBarChart from "./charts/toast-bar-chart";
import { Container, BoxDecoration, EdgeInsets, BorderRadius } from "flitter-ui";

const chart = ToastBarChart({
  direction: "vertical",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      { legend: "Net Income ($K)", values: [120, -45, 85, -60, 150, -30] },
    ],
  },
  config: {
    colors: ["#10b981"],
    title: { text: "Monthly P&L", visible: true },
    bar: { cornerRadius: 3 },
  },
  custom: {
    bar: ({ value }, context) => {
      const { bar } = context.config;
      return Container({
        margin: EdgeInsets.symmetric({ horizontal: 1 }),
        decoration: new BoxDecoration({
          color: value >= 0 ? "#10b981" : "#ef4444",
          borderRadius: BorderRadius.circular(bar.cornerRadius),
        }),
      });
    },
  },
});`,
  },

  // ── 4. Layout variant — horizontal bars with ranked custom labels ──
  {
    title: "Horizontal Ranking",
    subtitle: "Custom yAxisLabel with rank numbers from context.config",
    style: "Toast",
    chart: <HorizontalRankingToast />,
    height: 380,
    code: `import ToastBarChart from "./charts/toast-bar-chart";
import { Text, TextStyle, Row, SizedBox, MainAxisSize } from "flitter-ui";

const chart = ToastBarChart({
  direction: "horizontal",
  data: {
    labels: ["Alice", "Bob", "Carol", "Dave", "Eve"],
    datasets: [{ legend: "Sales ($K)", values: [142, 128, 115, 98, 87] }],
  },
  config: {
    colors: ["#0d9488"],
    title: { text: "Top Performers", visible: true },
    bar: { cornerRadius: 3 },
  },
  custom: {
    yAxisLabel: ({ name, index }, context) => {
      const { font } = context.config;
      return Row({
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(\`\${index + 1}\`, {
            style: new TextStyle({
              fontFamily: font.family,
              fontSize: font.size,
              fontWeight: "bold",
              color: "#0d9488",
            }),
          }),
          SizedBox({ width: 4 }),
          Text(name, {
            style: new TextStyle({
              fontFamily: font.family,
              fontSize: font.size,
              color: "#334155",
            }),
          }),
        ],
      });
    },
  },
});`,
  },

  // ── 5. Rich title — mixed-color text + subtitle via widget composition ──
  {
    title: "Branded Title",
    subtitle: "Column + Row title with highlighted text and subtitle",
    style: "AG",
    chart: <ExecutiveRevenueAg />,
    code: `import BarChart from "./charts/bar-chart";
import {
  Container, BoxDecoration, Border, BorderSide, EdgeInsets,
  Text, TextStyle, Column, Row, SizedBox,
  MainAxisSize, CrossAxisAlignment,
} from "flitter-ui";

const chart = BarChart({
  direction: "vertical",
  data: {
    labels: ["Oct", "Nov", "Dec"],
    datasets: [
      { legend: "Product", values: [4.8, 5.2, 6.1] },
      { legend: "Services", values: [2.1, 2.4, 2.9] },
      { legend: "Licensing", values: [1.3, 1.1, 1.5] },
    ],
  },
  custom: {
    title: (_args, context) => {
      const { font, title } = context.config;
      return Container({
        padding: EdgeInsets.only({ bottom: 8 }),
        decoration: new BoxDecoration({
          border: new Border({
            bottom: new BorderSide({ color: "#2563eb", width: 2 }),
          }),
        }),
        child: Column({
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Row({
              mainAxisSize: MainAxisSize.min,
              children: [
                Text("Q4 ", {
                  style: new TextStyle({
                    fontFamily: title.fontFamily ?? font.family,
                    fontSize: title.fontSize,
                    fontWeight: "700",
                    color: title.color,
                  }),
                }),
                Text("Revenue", {
                  style: new TextStyle({
                    fontFamily: title.fontFamily ?? font.family,
                    fontSize: title.fontSize,
                    fontWeight: "700",
                    color: "#2563eb",
                  }),
                }),
              ],
            }),
            SizedBox({ height: 2 }),
            Text("Breakdown by stream ($M)", {
              style: new TextStyle({
                fontFamily: font.family,
                fontSize: 12,
                color: "#94a3b8",
              }),
            }),
          ],
        }),
      });
    },
  },
  config: {
    colors: { fills: ["#2563eb", "#7c3aed", "#e879f9"] },
    title: { text: "Q4 Revenue", visible: true },
    legend: { position: "right-top" },
    bar: { cornerRadius: 4 },
  },
});`,
  },

  // ── 6. Styled labels — background badges on axis labels ──
  {
    title: "Styled Labels",
    subtitle: "X-axis labels with background badges using config font",
    style: "AG",
    chart: <ProductComparisonAg />,
    code: `import BarChart from "./charts/bar-chart";
import {
  Text, TextStyle, Container, BoxDecoration, BorderRadius, EdgeInsets,
} from "flitter-ui";

const chart = BarChart({
  direction: "vertical",
  data: {
    labels: ["Design", "Speed", "Support"],
    datasets: [
      { legend: "Ours", values: [92, 76, 88] },
      { legend: "Competitor A", values: [68, 91, 72] },
      { legend: "Competitor B", values: [79, 84, 65] },
    ],
  },
  custom: {
    xAxisLabel: ({ name }, context) => {
      const { font, axis } = context.config;
      return Container({
        padding: EdgeInsets.symmetric({ horizontal: 8, vertical: 3 }),
        decoration: new BoxDecoration({
          color: "#f0f9ff",
          borderRadius: BorderRadius.circular(4),
        }),
        child: Text(name, {
          style: new TextStyle({
            fontFamily: font.family,
            fontSize: axis.label.fontSize,
            color: "#0369a1",
          }),
        }),
      });
    },
  },
  config: {
    colors: { fills: ["#0ea5e9", "#f97316", "#8b5cf6"] },
    title: { text: "Product Comparison", visible: true },
    bar: { cornerRadius: 3 },
  },
});`,
  },
];

export const pages: ChartModule = [
  {
    slug: ["bar-chart"],
    title: "Bar Chart",
    description:
      "Compare categories side by side. Revenue by region, survey responses, budget vs actual — if you're comparing discrete groups, this is your chart.",
    pageType: "overview",
    styles: [
      toastSummary("bar-chart", <MonthlyRevenueToast />),
      agSummary("bar-chart", <ExecutiveRevenueAg />),
    ],
    showcaseExamples,
    hasAdvanced: true,
  },
  toastStyle,
  agStyle,
  advancedPage,
];
