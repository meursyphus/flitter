import type { Meta, StoryObj } from "@storybook/react";
import DualRenderer from "../../components/DualRenderer";
import {
  Alignment,
  Column,
  Container,
  CrossAxisAlignment,
  DockLayout,
  EdgeInsets,
  Expanded,
  Flexible,
  FractionallySizedBox,
  MainAxisAlignment,
  MainAxisSize,
  Padding,
  Row,
  SizedBox,
  Stack,
  Text,
  TextStyle,
} from "flitter-core";

const COLORS = ["#4e79a7", "#f28e2b", "#e15759", "#76b7b2"];

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    { legend: "Revenue", values: [42, 58, 47, 71, 69, 83] },
    { legend: "Cost", values: [24, 30, 28, 35, 39, 44] },
  ],
};

type Scale = {
  min: number;
  max: number;
  step: number;
};

function getScale(datasetValues: number[][], roughStepCount = 5): Scale {
  const values = datasetValues.flat();
  const rawMin = values.length > 0 ? Math.min(...values) : 0;
  const rawMax = values.length > 0 ? Math.max(...values) : 0;
  const min = rawMin > 0 ? 0 : rawMin;
  const max = rawMax < 0 ? 0 : rawMax;
  const span = Math.max(1, max - min);
  const roughStep = span / roughStepCount;
  const magnitude = 10 ** Math.floor(Math.log10(roughStep || 1));
  const normalized = roughStep / magnitude;
  const snapped =
    normalized <= 1.5 ? 1 : normalized <= 3 ? 2 : normalized <= 7 ? 5 : 10;
  const step = snapped * magnitude;
  const refinedMax = Math.ceil(max / step) * step;
  const refinedMin = min < 0 ? -Math.ceil(Math.abs(min) / step) * step : 0;
  return { min: refinedMin, max: refinedMax, step };
}

function getTicks(scale: Scale) {
  const ticks: number[] = [];
  for (let value = scale.min; value <= scale.max; value += scale.step) {
    ticks.push(value);
  }
  return ticks.reverse();
}

function Legend() {
  return Row({
    mainAxisAlignment: MainAxisAlignment.center,
    children: data.datasets.map((dataset, index) =>
      Padding({
        padding: EdgeInsets.symmetric({ horizontal: 8 }),
        child: Row({
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Container({
              width: 10,
              height: 10,
              color: COLORS[index % COLORS.length],
            }),
            SizedBox({ width: 6 }),
            Text(
              dataset.legend,
              { style: new TextStyle({ fontSize: 12, color: "#444444" }) },
            ),
          ],
        }),
      }),
    ),
  });
}

function YAxisLabels({ ticks }: { ticks: number[] }) {
  return Column({
    mainAxisAlignment: MainAxisAlignment.spaceBetween,
    crossAxisAlignment: CrossAxisAlignment.end,
    children: ticks.map((tick) =>
      Text(
        String(tick),
        { style: new TextStyle({ fontSize: 11, color: "#666666" }) },
      ),
    ),
  });
}

function XAxisLabels() {
  return Row({
    mainAxisAlignment: MainAxisAlignment.spaceAround,
    crossAxisAlignment: CrossAxisAlignment.start,
    children: data.labels.map((label) =>
      Text(
        label,
        { style: new TextStyle({ fontSize: 11, color: "#666666" }) },
      ),
    ),
  });
}

function HorizontalGrid({ tickCount }: { tickCount: number }) {
  return Column({
    mainAxisAlignment: MainAxisAlignment.spaceBetween,
    children: Array.from({ length: tickCount }, (_, index) =>
      Container({
        width: Infinity,
        height: 1,
        color: index === tickCount - 1 ? "#b9c1cc" : "#e7ebf0",
      }),
    ),
  });
}

function GroupedBars({ scale }: { scale: Scale }) {
  const span = Math.max(1, scale.max - scale.min);

  return Row({
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: data.labels.map((label, labelIndex) =>
      Flexible({
        flex: 1,
        child: Padding({
          padding: EdgeInsets.symmetric({ horizontal: 6 }),
          child: Row({
            crossAxisAlignment: CrossAxisAlignment.end,
            children: data.datasets.map((dataset, datasetIndex) =>
              Flexible({
                flex: 1,
                child: FractionallySizedBox({
                  alignment: Alignment.bottomCenter,
                  heightFactor: Math.max(0, (dataset.values[labelIndex] - scale.min) / span),
                  child: Padding({
                    padding: EdgeInsets.symmetric({ horizontal: 3 }),
                    child: Container({
                      width: Infinity,
                      height: Infinity,
                      color: COLORS[datasetIndex % COLORS.length],
                    }),
                  }),
                }),
              }),
            ),
          }),
        }),
      }),
    ),
  });
}

function ManualCartesianBarChart() {
  const scale = getScale(data.datasets.map((dataset) => dataset.values));
  const ticks = getTicks(scale);

  return Container({
    color: "white",
    padding: EdgeInsets.all(20),
    child: Column({
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Manual Cartesian Bar Chart",
          { style: new TextStyle({ fontSize: 18, color: "#1f2937" }) },
        ),
        SizedBox({ height: 6 }),
        Text(
          "Built directly with flitter-ui primitives. packages/chart is only the reference for layout and scale logic.",
          { style: new TextStyle({ fontSize: 12, color: "#6b7280" }) },
        ),
        SizedBox({ height: 18 }),
        Expanded({
          child: DockLayout({
            left: SizedBox({
              width: 46,
              child: YAxisLabels({ ticks }),
            }),
            bottom: Padding({
              padding: EdgeInsets.only({ top: 8, left: 8, right: 8 }),
              child: SizedBox({
                height: 24,
                child: XAxisLabels(),
              }),
            }),
            fill: Padding({
              padding: EdgeInsets.only({ left: 8, right: 8, top: 4 }),
              child: Stack({
                children: [
                  HorizontalGrid({ tickCount: ticks.length }),
                  GroupedBars({ scale }),
                ],
              }),
            }),
          }),
        }),
        SizedBox({ height: 14 }),
        Legend(),
      ],
    }),
  });
}

const meta = {
  title: "Charts/Manual/CartesianBar",
  component: DualRenderer,
  args: {
    width: "860px",
    height: "520px",
    widget: ManualCartesianBarChart(),
    description:
      "This story is a direct-build reference. It uses only flitter-ui primitives plus @flitterjs/react for rendering. Read it together with packages/chart/src/shared/cartesian/* when teaching an agent how to construct charts without importing flitter-chart.",
  },
} satisfies Meta<typeof DualRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
