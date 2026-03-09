import {
  Align,
  Alignment,
  Border,
  BorderRadius,
  BoxDecoration,
  BoxShadow,
  Column,
  Container,
  FractionallySizedBox,
  Radius,
  SizedBox,
  Stack,
  Text,
  TextStyle,
} from "flitter-core";
import type { ProgressChartCustom } from "flitter-ui/chart";
import type { ProgressChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import { HoverTooltip } from "flitter-ui/chart";
import { agTooltipContent, agTitle } from "../../_styles/ag/index";

export { type ProgressChartConfig } from "./config";

const agCustom: Partial<ProgressChartCustom<ProgressChartConfig>> = {
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
  title: agTitle as any,
  track: ({ fills }, ctx) =>
    Container({
      width: Infinity,
      height: ctx.config.progress.trackHeight,
      color: ctx.config.progress.trackColor,
      child: Stack({
        children: fills.map((fill) =>
          Align({
            alignment: Alignment.centerLeft,
            child: fill,
          }),
        ),
      }),
    }),
  fill: ({ ratio, color, label, value }, ctx) =>
    new HoverTooltip({
      position: "topCenter",
      tooltip: agTooltipContent({
        label: label || "Progress",
        items: { legend: label || "Value", color: color ?? ctx.config.colors?.fills?.[0] ?? "#00a9ff", value },
        config: {
          ...defaultAgConfig,
          tooltip: ctx.config.tooltip,
          font: ctx.config.font,
        } as any,
      }),
      renderChild: (hovered) =>
        FractionallySizedBox({
          widthFactor: Math.max(0, Math.min(1, ratio)),
          alignment: Alignment.centerLeft,
          child: Container({
            width: Infinity,
            height: Infinity,
            decoration: new BoxDecoration({
              color: color ?? "#5A8FD3",
              borderRadius: BorderRadius.all(Radius.circular(ctx.config.progress.cornerRadius)),
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
  valueLabel: ({ value, ratio }, ctx) =>
    Text(`${Math.round(ratio * 100)}% (${value})`, {
      style: new TextStyle({
        fontFamily: ctx.config.font.family,
        fontSize: 14,
        color: ctx.config.progress.labelColor,
      }),
    }),
  segmentLabel: ({ label }, ctx) =>
    Text(label, {
      style: new TextStyle({
        fontFamily: ctx.config.font.family,
        fontSize: 10,
        color: "#666666",
      }),
    }),
};

export const styleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<ProgressChartConfig>): ProgressChartConfig =>
    deepMerge(defaultAgConfig, config),
};
