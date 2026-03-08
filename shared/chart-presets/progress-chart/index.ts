import type { Widget } from "flitter-core";
import {
  Column,
  Container,
  Text,
  TextStyle,
  SizedBox,
  Stack,
  Align,
  Alignment,
  FractionallySizedBox,
  BoxDecoration,
  BorderRadius,
  Radius,
  Border,
  BoxShadow,
} from "flitter-core";
import { ProgressChart as HeadlessProgressChart } from "flitter-ui/chart";
import type { ProgressChartCustom, ProgressChartData } from "./types";
import { HoverTooltip } from "flitter-ui/chart";
import { agTooltipContent, defaultAgCartesianBaseConfig } from "../_styles/ag/index";

export type {
  ProgressChartContext,
  ProgressChartData,
  ProgressSegment,
  ProgressChartCustom,
} from "./types";
export { ProgressChartController } from "./types";

const baseDefaults: Partial<ProgressChartCustom> = {
  layout: ({ title, track, valueLabel }) =>
    Column({
      children: [
        title,
        SizedBox({ height: 8 }),
        track,
        SizedBox({ height: 10 }),
        valueLabel,
      ],
    }),
  title: () => Container({ width: 0, height: 0 }),
  track: ({ fills }) =>
    Container({
      width: Infinity,
      height: 18,
      color: "#f2f4f6",
      child: Stack({
        children: fills.map((fill) =>
          Align({
            alignment: Alignment.centerLeft,
            child: fill,
          }),
        ),
      }),
    }),
  fill: ({ ratio, color, label, value }) =>
    new HoverTooltip({
      position: "topCenter",
      tooltip: agTooltipContent({
        label: label || "Progress",
        items: { legend: label || "Value", color: color ?? "#00a9ff", value },
        config: defaultAgCartesianBaseConfig,
      }),
      renderChild: (hovered) =>
        FractionallySizedBox({
          widthFactor: Math.max(0, Math.min(1, ratio)),
          alignment: Alignment.centerLeft,
          child: Container({
            width: Infinity,
            height: Infinity,
            decoration: new BoxDecoration({
              color: color ?? "#00a9ff",
              borderRadius: BorderRadius.all(Radius.circular(8)),
              border:
                hovered
                  ? Border.all({ color: "white", width: 2, strokeAlign: 1 })
                  : undefined,
              boxShadow: hovered
                ? [new BoxShadow({ color: "rgba(0,0,0,0.16)", blurRadius: 10 })]
                : undefined,
            }),
          }),
        }),
    }),
  valueLabel: ({ value, ratio }) =>
    Text(`${Math.round(ratio * 100)}% (${value})`, {
      style: new TextStyle({ fontSize: 14, color: "#333333" }),
    }),
  segmentLabel: ({ label }) =>
    Text(label, {
      style: new TextStyle({ fontSize: 10, color: "#666666" }),
    }),
};

export default function ProgressChart<TConfig = {}>({
  custom,
  ...rest
}: {
  custom?: Partial<ProgressChartCustom<TConfig>>;
  data: ProgressChartData;
  config?: TConfig;
}): Widget {
  return HeadlessProgressChart({
    ...rest,
    custom: { ...baseDefaults, ...custom } as ProgressChartCustom<TConfig>,
  });
}
