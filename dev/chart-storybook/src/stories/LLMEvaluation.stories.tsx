import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps, ReactElement } from "react";
import Widget from "@flitterjs/react";
import caseSpecs from "../../../../docs/public/llm/evaluation-cases.json";
import {
  AreaChart,
  BarChart,
  BubbleChart,
  HeatmapChart,
  LineChart,
  PieChart,
  RadarChart,
  ScatterChart,
  StackedAreaChart,
  StackedBarChart,
} from "flitter-chart";
import LLMScorecardChart from "../charts/LLMScorecardChart";
import ToastBoxPlotChart from "../charts/ToastBoxPlotChart";
import ToastCandlestickChart from "../charts/ToastCandlestickChart";
import ToastFunnelChart from "../charts/ToastFunnelChart";
import ToastGaugeChart from "../charts/ToastGaugeChart";
import ToastSankeyChart from "../charts/ToastSankeyChart";
import ToastSunburstChart from "../charts/ToastSunburstChart";
import ToastTreemapChart from "../charts/ToastTreemapChart";
import ToastWaterfallChart from "../charts/ToastWaterfallChart";

type EvalArgs = {
  renderer: "svg" | "canvas";
};

type StoryWidget = ComponentProps<typeof Widget>["widget"];

type EvalCaseSpec = {
  id: string;
  storyExport: string;
  prompt: string;
  expected: string[];
  rejectIf: string[];
};

type EvalCase = {
  spec: EvalCaseSpec;
  width?: string;
  height?: string;
  buildWidget?: () => StoryWidget;
  render?: (args: EvalArgs) => ReactElement;
};

type Story = StoryObj<EvalArgs>;

const caseSpecMap = new Map(caseSpecs.map((spec) => [spec.storyExport, spec]));

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getSpec(storyExport: string) {
  const spec = caseSpecMap.get(storyExport);
  if (!spec) {
    throw new Error(`Missing evaluation spec for story export "${storyExport}".`);
  }
  return spec;
}

function renderWidget(args: EvalArgs, widget: StoryWidget, width = "800px", height = "500px") {
  return <Widget widget={widget} width={width} height={height} renderer={args.renderer} />;
}

function renderCase(args: EvalArgs, caseDef: EvalCase) {
  return (
    <div data-testid="llm-eval-story">
      {caseDef.buildWidget
        ? renderWidget(args, caseDef.buildWidget(), caseDef.width, caseDef.height)
        : caseDef.render?.(args)}
    </div>
  );
}

function makeStory(caseDef: EvalCase): Story {
  return {
    parameters: {
      docs: {
        description: {
          story: [
            `Prompt: "${caseDef.spec.prompt}"`,
            `Checks: ${caseDef.spec.expected.join("; ")}`,
            `Reject if: ${caseDef.spec.rejectIf.join("; ")}`,
          ].join("\n\n"),
        },
      },
    },
    render: (args) => renderCase(args, caseDef),
  };
}

const meta: Meta<EvalArgs> = {
  title: "Charts/LLMEvaluation",
  parameters: { layout: "centered" },
  argTypes: {
    renderer: { control: "inline-radio", options: ["svg", "canvas"] },
  },
  args: {
    renderer: "svg",
  },
};

export default meta;

export const ExecutiveRanking = makeStory({
  spec: getSpec("ExecutiveRanking"),
  width: "960px",
  height: "560px",
  buildWidget: () =>
    BarChart({
      style: "ag",
      direction: "horizontal",
      data: {
        labels: [
          "Consumer payments platform modernization",
          "Legacy billing engine replacement",
          "Identity and access management rollout",
          "Data warehouse contract migration",
          "Customer support workflow consolidation",
        ],
        datasets: [{ legend: "Risk score", values: [91, 82, 74, 69, 58] }],
      },
      config: {
        title: {
          text: "Platform Migration Risk by Business Unit",
          position: "top",
          alignment: "start",
        },
        legend: { visible: true, position: "bottom", gap: 16 },
        bar: { gap: 3, cornerRadius: 4 },
        animation: { enabled: true, duration: 300 },
      },
    }),
});

export const RegionalRevenuePulse = makeStory({
  spec: getSpec("RegionalRevenuePulse"),
  width: "920px",
  height: "540px",
  buildWidget: () =>
    BarChart({
      style: "toast",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [
          { legend: "North America", values: [126, 132, 138, 144, 149, 156, 164] },
          { legend: "Europe", values: [88, 92, 95, 100, 105, 109, 114] },
          { legend: "Asia Pacific", values: [72, 79, 84, 88, 91, 98, 104] },
        ],
      },
      config: {
        title: { text: "Monthly Revenue by Region", position: "top", alignment: "center" },
        legend: { visible: true, position: "bottom", gap: 12 },
        bar: { gap: 1, cornerRadius: 4 },
        animation: { enabled: true, duration: 300 },
      },
    }),
});

export const ProfitVarianceHorizontal = makeStory({
  spec: getSpec("ProfitVarianceHorizontal"),
  width: "920px",
  height: "540px",
  buildWidget: () =>
    BarChart({
      style: "toast",
      direction: "horizontal",
      data: {
        labels: ["Payments", "Subscriptions", "Ads", "Services", "Marketplace"],
        datasets: [
          { legend: "Quarterly profit / loss", values: [28, 14, -8, 19, -12] },
        ],
      },
      config: {
        title: { text: "Quarterly Profit and Loss by Product", position: "top", alignment: "start" },
        legend: { visible: true, position: "bottom", gap: 12 },
        bar: { gap: 2, cornerRadius: 6 },
        animation: { enabled: true, duration: 300 },
      },
    }),
});

export const NegativeContributionMix = makeStory({
  spec: getSpec("NegativeContributionMix"),
  width: "920px",
  height: "540px",
  buildWidget: () =>
    StackedBarChart({
      style: "toast",
      data: {
        labels: ["Q1", "Q2", "Q3", "Q4"],
        datasets: [
          { legend: "Core platform", values: [42, 51, 48, 57] },
          { legend: "Marketplace", values: [18, -9, 12, 16] },
          { legend: "Services", values: [10, 14, -6, 11] },
          { legend: "New bets", values: [-8, 7, 9, -4] },
        ],
      },
      config: {
        title: {
          text: "Quarterly Profit Contribution by Product Line",
          position: "top",
          alignment: "center",
        },
        legend: { visible: true, position: "bottom", gap: 12 },
        bar: { gap: 0 },
        animation: { enabled: true, duration: 300 },
      },
    }),
});

export const MarketShareStackedColumns = makeStory({
  spec: getSpec("MarketShareStackedColumns"),
  width: "920px",
  height: "540px",
  buildWidget: () =>
    StackedBarChart({
      style: "ag",
      data: {
        labels: ["Q1", "Q2", "Q3", "Q4"],
        datasets: [
          { legend: "Commerce", values: [36, 38, 40, 42] },
          { legend: "Payments", values: [22, 21, 24, 25] },
          { legend: "Subscriptions", values: [18, 19, 17, 18] },
          { legend: "Services", values: [12, 11, 10, 9] },
        ],
      },
      config: {
        title: {
          text: "Quarterly Revenue Mix by Product Family",
          position: "top",
          alignment: "start",
        },
        legend: { visible: true, position: "bottom", gap: 14 },
        bar: { gap: 0 },
        animation: { enabled: true, duration: 300 },
      },
    }),
});

export const RetentionTrendSoft = makeStory({
  spec: getSpec("RetentionTrendSoft"),
  width: "920px",
  height: "540px",
  buildWidget: () =>
    LineChart({
      style: "toast",
      data: {
        labels: months,
        datasets: [
          { legend: "Paid retention", values: [62, 64, 65, 67, 69, 71, 72, 74, 75, 77, 78, 80] },
          { legend: "Trial retention", values: [38, 40, 41, 43, 46, 48, 49, 51, 53, 54, 56, 58] },
        ],
      },
      config: {
        title: { text: "Monthly Retention Trend", position: "top", alignment: "center" },
        legend: { visible: true, position: "bottom", gap: 12 },
        line: { strokeWidth: 2, spline: true },
        animation: { enabled: true, duration: 300 },
      },
    }),
});

export const IncidentLatencyTrend = makeStory({
  spec: getSpec("IncidentLatencyTrend"),
  width: "920px",
  height: "540px",
  buildWidget: () =>
    LineChart({
      style: "ag",
      data: {
        labels: months,
        datasets: [
          { legend: "Checkout", values: [340, 325, 310, 305, 290, 285, 272, 264, 252, 245, 238, 230] },
          { legend: "Search", values: [280, 276, 270, 266, 260, 255, 248, 243, 236, 232, 226, 221] },
          { legend: "Identity", values: [390, 382, 375, 360, 351, 340, 335, 329, 322, 314, 306, 298] },
        ],
      },
      config: {
        title: { text: "P95 Incident Response Latency", position: "top", alignment: "start" },
        legend: { visible: true, position: "bottom", gap: 12 },
        line: { strokeWidth: 2, spline: false },
        animation: { enabled: true, duration: 300 },
      },
    }),
});

export const SignupMomentumArea = makeStory({
  spec: getSpec("SignupMomentumArea"),
  width: "920px",
  height: "540px",
  buildWidget: () =>
    AreaChart({
      style: "toast",
      data: {
        labels: months,
        datasets: [
          { legend: "Qualified signups", values: [82, 88, 91, 98, 105, 112, 120, 126, 131, 138, 145, 152] },
          { legend: "Activated accounts", values: [40, 43, 45, 49, 53, 57, 61, 66, 70, 75, 79, 84] },
        ],
      },
      config: {
        title: { text: "Signup Momentum Through the Year", position: "top", alignment: "center" },
        legend: { visible: true, position: "bottom", gap: 12 },
        area: { strokeWidth: 2, opacity: 0.34, spline: true },
        animation: { enabled: true, duration: 300 },
      },
    }),
});

export const MarginEnvelopeArea = makeStory({
  spec: getSpec("MarginEnvelopeArea"),
  width: "920px",
  height: "540px",
  buildWidget: () =>
    AreaChart({
      style: "ag",
      data: {
        labels: months,
        datasets: [
          { legend: "Gross margin", values: [42, 43, 44, 45, 46, 47, 47, 48, 49, 50, 50, 51] },
          { legend: "Net margin", values: [16, 17, 17, 18, 19, 19, 20, 21, 21, 22, 22, 23] },
        ],
      },
      config: {
        title: { text: "Margin Envelope by Month", position: "top", alignment: "start" },
        legend: { visible: true, position: "bottom", gap: 12 },
        area: { strokeWidth: 2, opacity: 0.28, spline: false },
        animation: { enabled: true, duration: 300 },
      },
    }),
});

export const TrafficShareShift = makeStory({
  spec: getSpec("TrafficShareShift"),
  width: "920px",
  height: "540px",
  buildWidget: () =>
    StackedAreaChart({
      style: "toast",
      data: {
        labels: months,
        datasets: [
          { legend: "Organic", values: [420, 445, 430, 470, 510, 520, 540, 550, 575, 590, 605, 620] },
          { legend: "Direct", values: [210, 205, 220, 230, 235, 245, 255, 260, 270, 280, 290, 300] },
          { legend: "Paid", values: [120, 135, 140, 138, 145, 150, 155, 165, 172, 180, 188, 195] },
          { legend: "Referral", values: [60, 62, 68, 70, 72, 74, 79, 83, 85, 88, 90, 93] },
        ],
      },
      config: {
        title: {
          text: "Traffic Source Share Shift",
          position: "top",
          alignment: "center",
        },
        legend: { visible: true, position: "bottom", gap: 12 },
        area: { opacity: 0.65, strokeWidth: 2 },
        animation: { enabled: true, duration: 300 },
      },
    }),
});

export const RevenueMixRebalance = makeStory({
  spec: getSpec("RevenueMixRebalance"),
  width: "920px",
  height: "540px",
  buildWidget: () =>
    StackedAreaChart({
      style: "ag",
      data: {
        labels: months,
        datasets: [
          { legend: "Core SaaS", values: [280, 285, 288, 294, 301, 309, 316, 322, 329, 336, 344, 352] },
          { legend: "Marketplace", values: [94, 96, 98, 101, 104, 108, 112, 116, 121, 125, 130, 136] },
          { legend: "Payments", values: [72, 74, 76, 78, 82, 84, 87, 91, 94, 98, 103, 108] },
          { legend: "Professional Services", values: [58, 56, 54, 52, 50, 49, 47, 45, 43, 41, 39, 37] },
        ],
      },
      config: {
        title: { text: "Revenue Mix Rebalance", position: "top", alignment: "start" },
        legend: { visible: true, position: "bottom", gap: 12 },
        area: { opacity: 0.72, strokeWidth: 2 },
        animation: { enabled: true, duration: 300 },
      },
    }),
});

export const SatisfactionScatterMatrix = makeStory({
  spec: getSpec("SatisfactionScatterMatrix"),
  width: "920px",
  height: "540px",
  buildWidget: () =>
    ScatterChart({
      style: "toast",
      data: {
        datasets: [
          {
            legend: "Enterprise",
            data: [
              { x: 15, y: 88, label: "Insurance" },
              { x: 18, y: 91, label: "Fintech" },
              { x: 12, y: 84, label: "Healthcare" },
            ],
          },
          {
            legend: "Mid-market",
            data: [
              { x: 9, y: 80, label: "Retail" },
              { x: 11, y: 83, label: "SaaS" },
              { x: 10, y: 78, label: "Logistics" },
            ],
          },
          {
            legend: "SMB",
            data: [
              { x: 5, y: 72, label: "Agencies" },
              { x: 6, y: 76, label: "Education" },
              { x: 4, y: 69, label: "Local services" },
            ],
          },
        ],
      },
      config: {
        title: { text: "Feature Breadth vs Satisfaction", position: "top", alignment: "center" },
        legend: { visible: true, position: "bottom", gap: 12 },
        scatter: { size: 12, fill: false, strokeWidth: 2 },
        animation: { enabled: true, duration: 300 },
      },
    }),
});

export const MarketOpportunity = makeStory({
  spec: getSpec("MarketOpportunity"),
  width: "920px",
  height: "540px",
  buildWidget: () =>
    BubbleChart({
      style: "ag",
      data: {
        datasets: [
          {
            legend: "North America",
            data: [
              { x: 48_000, y: 88, value: 7_500_000, label: "US Enterprise" },
              { x: 42_000, y: 84, value: 2_100_000, label: "Canada Mid-market" },
            ],
          },
          {
            legend: "Europe",
            data: [
              { x: 36_000, y: 82, value: 4_300_000, label: "Germany Cloud" },
              { x: 32_000, y: 80, value: 3_600_000, label: "UK Platform" },
              { x: 29_000, y: 79, value: 2_400_000, label: "Spain Digital" },
            ],
          },
          {
            legend: "Asia",
            data: [
              { x: 24_000, y: 86, value: 9_800_000, label: "Korea Growth" },
              { x: 18_000, y: 78, value: 13_500_000, label: "SEA Expansion" },
              { x: 14_000, y: 73, value: 18_200_000, label: "India Scale" },
            ],
          },
        ],
      },
      config: {
        title: {
          text: "Market Opportunity by Region",
          position: "top",
          alignment: "start",
        },
        legend: { visible: true, position: "bottom", gap: 16 },
        bubble: { minRadius: 8, maxRadius: 42, opacity: 0.7 },
        animation: { enabled: true, duration: 300 },
      },
    }),
});

export const PipelineCapacityBubbles = makeStory({
  spec: getSpec("PipelineCapacityBubbles"),
  width: "920px",
  height: "540px",
  buildWidget: () =>
    BubbleChart({
      style: "toast",
      data: {
        datasets: [
          {
            legend: "Self-serve",
            data: [
              { x: 18, y: 12, value: 420, label: "Inbound SMB" },
              { x: 25, y: 18, value: 610, label: "Free-to-paid" },
            ],
          },
          {
            legend: "Sales-led",
            data: [
              { x: 42, y: 38, value: 180, label: "Commercial pipeline" },
              { x: 58, y: 44, value: 120, label: "Enterprise renewals" },
            ],
          },
          {
            legend: "Partner",
            data: [
              { x: 33, y: 25, value: 260, label: "Agency channel" },
              { x: 47, y: 31, value: 210, label: "Marketplace referrals" },
            ],
          },
        ],
      },
      config: {
        title: { text: "Pipeline Capacity by Channel", position: "top", alignment: "center" },
        legend: { visible: true, position: "bottom", gap: 12 },
        bubble: { minRadius: 10, maxRadius: 40, opacity: 0.65 },
        animation: { enabled: true, duration: 300 },
      },
    }),
});

export const ResponseLoadHeatmap = makeStory({
  spec: getSpec("ResponseLoadHeatmap"),
  width: "920px",
  height: "540px",
  buildWidget: () =>
    HeatmapChart({
      data: {
        xLabels: months,
        yLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        values: [
          [31, 34, 38, 44, 48, 53, 58, 60, 55, 47, 39, 33],
          [33, 36, 40, 45, 50, 55, 60, 62, 58, 49, 41, 35],
          [35, 37, 41, 47, 52, 57, 63, 65, 60, 51, 43, 36],
          [36, 39, 43, 48, 54, 59, 66, 68, 62, 53, 44, 38],
          [38, 41, 46, 52, 58, 63, 70, 72, 66, 57, 48, 41],
          [28, 30, 33, 37, 42, 46, 50, 52, 49, 41, 34, 29],
          [24, 26, 29, 33, 37, 41, 45, 47, 43, 36, 30, 25],
        ],
      },
      config: {
        title: {
          text: "Average Response Load by Weekday and Month",
          position: "top",
          alignment: "center",
        },
        legend: { visible: true, position: "bottom", gap: 12 },
        heatmap: { segment: { gap: 1 } },
        animation: { enabled: true, duration: 300 },
      },
    }),
});

export const EngineeringProfileRadar = makeStory({
  spec: getSpec("EngineeringProfileRadar"),
  width: "560px",
  height: "460px",
  buildWidget: () =>
    RadarChart({
      data: {
        labels: [
          "Architecture",
          "Delivery",
          "Testing",
          "DX",
          "Reliability",
          "Observability",
          "Security",
          "Collaboration",
        ],
        datasets: [
          { legend: "Platform Team", values: [92, 78, 86, 74, 95, 90, 88, 72] },
          { legend: "Product Team", values: [68, 91, 71, 82, 73, 69, 66, 89] },
          { legend: "Infra Team", values: [88, 70, 79, 65, 97, 94, 91, 68] },
        ],
      },
      config: {
        title: {
          text: "Engineering Team Profiles",
          position: "top",
          alignment: "start",
        },
        legend: { visible: true, position: "right-top", gap: 12 },
        radar: {
          fillOpacity: 0.22,
          strokeWidth: 2,
          gridColor: "rgba(0, 0, 0, 0.12)",
          gridWidth: 1,
        },
      },
    }),
});

export const BrowserUsageDonut = makeStory({
  spec: getSpec("BrowserUsageDonut"),
  width: "620px",
  height: "440px",
  buildWidget: () =>
    PieChart({
      data: {
        datasets: [
          { name: "Chrome", value: 61 },
          { name: "Safari", value: 22 },
          { name: "Firefox", value: 8 },
          { name: "Edge", value: 6 },
          { name: "Other", value: 3 },
        ],
      },
      config: {
        title: { text: "Browser Usage Share", position: "top", alignment: "start" },
        legend: { visible: true, position: "right-top", gap: 12 },
        pie: { strokeColor: "white", strokeWidth: 2, innerRadiusRatio: 0.56 },
      },
    }),
});

export const ChannelMixSnapshot = makeStory({
  spec: getSpec("ChannelMixSnapshot"),
  width: "620px",
  height: "440px",
  buildWidget: () =>
    PieChart({
      data: {
        datasets: [
          { name: "Organic", value: 42 },
          { name: "Paid social", value: 19 },
          { name: "Direct", value: 18 },
          { name: "Partners", value: 12 },
          { name: "Events", value: 9 },
        ],
      },
      config: {
        title: { text: "Lead Channel Snapshot", position: "top", alignment: "start" },
        legend: { visible: true, position: "right-top", gap: 12 },
        pie: { strokeColor: "white", strokeWidth: 2, innerRadiusRatio: 0 },
      },
    }),
});

export const OperatingProfitBridge = makeStory({
  spec: getSpec("OperatingProfitBridge"),
  render: (args) => <ToastWaterfallChart renderer={args.renderer} width="660px" height="460px" />,
});

export const AcquisitionFlowSankey = makeStory({
  spec: getSpec("AcquisitionFlowSankey"),
  render: (args) => <ToastSankeyChart renderer={args.renderer} width="720px" height="460px" />,
});

export const PipelineDropoffFunnel = makeStory({
  spec: getSpec("PipelineDropoffFunnel"),
  render: (args) => <ToastFunnelChart renderer={args.renderer} width="620px" height="460px" />,
});

export const ServiceHealthGauge = makeStory({
  spec: getSpec("ServiceHealthGauge"),
  render: (args) => <ToastGaugeChart renderer={args.renderer} width="620px" height="420px" />,
});

export const ReleaseWindowCandlestick = makeStory({
  spec: getSpec("ReleaseWindowCandlestick"),
  render: (args) => (
    <ToastCandlestickChart renderer={args.renderer} width="660px" height="460px" />
  ),
});

export const CompensationSpreadBoxPlot = makeStory({
  spec: getSpec("CompensationSpreadBoxPlot"),
  render: (args) => <ToastBoxPlotChart renderer={args.renderer} width="660px" height="460px" />,
});

export const ProductRevenueTreemap = makeStory({
  spec: getSpec("ProductRevenueTreemap"),
  render: (args) => <ToastTreemapChart renderer={args.renderer} width="660px" height="460px" />,
});

export const CapabilitySunburst = makeStory({
  spec: getSpec("CapabilitySunburst"),
  render: (args) => <ToastSunburstChart renderer={args.renderer} width="620px" height="460px" />,
});

export const StrategicScorecardComposite = makeStory({
  spec: getSpec("StrategicScorecardComposite"),
  render: () => <LLMScorecardChart width="960px" height="540px" />,
});

export const PortfolioBenchmarkScatter = makeStory({
  spec: getSpec("PortfolioBenchmarkScatter"),
  width: "920px",
  height: "540px",
  buildWidget: () =>
    ScatterChart({
      style: "ag",
      data: {
        datasets: [
          {
            legend: "Core products",
            data: [
              { x: 18, y: 78, label: "Billing" },
              { x: 22, y: 81, label: "Payments" },
              { x: 27, y: 83, label: "Identity" },
            ],
          },
          {
            legend: "Growth bets",
            data: [
              { x: 31, y: 66, label: "AI assist" },
              { x: 35, y: 72, label: "Expansion seats" },
              { x: 29, y: 69, label: "Partner hub" },
            ],
          },
          {
            legend: "Services",
            data: [
              { x: 12, y: 58, label: "Advisory" },
              { x: 16, y: 61, label: "Implementation" },
              { x: 14, y: 64, label: "Support" },
            ],
          },
        ],
      },
      config: {
        title: { text: "Portfolio Benchmark Scatter", position: "top", alignment: "start" },
        legend: { visible: true, position: "bottom", gap: 12 },
        scatter: { size: 12, fill: true, strokeWidth: 2 },
        animation: { enabled: true, duration: 300 },
      },
    }),
});
