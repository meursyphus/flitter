import type { Widget } from "flitter-core";
import {
  Column,
  Row,
  Expanded,
  Container,
  Text,
  TextStyle,
  SizedBox,
  Align,
  Alignment,
  FractionallySizedBox,
} from "flitter-core";
import HeadlessGanttChart from "../_flitter/headless/gantt-chart";
import type { GanttChartCustom, GanttChartData } from "./types";

export type {
  GanttChartContext,
  GanttTask,
  GanttChartData,
  GanttChartScale,
  GanttChartCustom,
} from "./types";
export { GanttChartController } from "./types";

const baseDefaults: Partial<GanttChartCustom> = {
  layout: ({ title, plot, legends }) =>
    Column({
      children: [
        title,
        ...(legends.length > 0 ? [SizedBox({ height: 8 }), Row({ children: legends })] : []),
        SizedBox({ height: 8 }),
        Expanded({ child: plot }),
      ],
    }),
  plot: ({ xAxis, yAxisLabels, dataView }) =>
    Column({
      children: [
        xAxis,
        SizedBox({ height: 8 }),
        Expanded({
          child: Row({
            children: [
              Column({ children: yAxisLabels }),
              SizedBox({ width: 12 }),
              Expanded({ child: dataView }),
            ],
          }),
        }),
      ],
    }),
  dataView: ({ taskBars }) =>
    Column({
      children: taskBars,
    }),
  taskBar: ({ task, startRatio, widthRatio }) =>
    Container({
      width: Infinity,
      height: 32,
      child: Align({
        alignment: Alignment.centerLeft,
        child: FractionallySizedBox({
          widthFactor: Math.max(0.001, startRatio + widthRatio),
          alignment: Alignment.centerLeft,
          child: Align({
            alignment: Alignment.centerRight,
            child: FractionallySizedBox({
              widthFactor: widthRatio / Math.max(0.001, startRatio + widthRatio),
              child: Container({
                width: Infinity,
                height: 18,
                color: "#00a9ff",
              }),
            }),
          }),
        }),
      }),
    }),
  milestone: () => Container({ width: Infinity, height: 18, color: "#ffb840" }),
  dependency: () => Container({ width: 0, height: 0 }),
  xAxis: ({ line, labels }) =>
    Column({
      children: [line, SizedBox({ height: 4 }), Row({ children: labels })],
    }),
  xAxisLabel: ({ name }) =>
    Text(name, {
      style: new TextStyle({ fontSize: 11, color: "#666666" }),
    }),
  xAxisTick: () => Container({ width: 1, height: 6, color: "#bbbbbb" }),
  xAxisLine: () => Container({ width: Infinity, height: 1, color: "#dddddd" }),
  yAxisLabel: ({ name }) =>
    Container({
      width: 120,
      height: 32,
      alignment: Alignment.centerLeft,
      child: Text(name, {
        style: new TextStyle({ fontSize: 12, color: "#333333" }),
      }),
    }),
  grid: () => Container({ width: 0, height: 0 }),
  gridXLine: () => Container({ width: 1, height: Infinity, color: "#eeeeee" }),
  title: () => Container({ width: 0, height: 0 }),
  legend: ({ name }) =>
    Text(name, {
      style: new TextStyle({ fontSize: 11, color: "#666666" }),
    }),
};

export default function GanttChart<TConfig = {}>({
  custom,
  ...rest
}: {
  custom?: Partial<GanttChartCustom<TConfig>>;
  data: GanttChartData;
  config?: TConfig;
}): Widget {
  return HeadlessGanttChart({
    ...rest,
    custom: { ...baseDefaults, ...custom } as GanttChartCustom<TConfig>,
  });
}
