import {
  Align,
  Alignment,
  AnimatedFractionallySizedBox,
  Border,
  BorderRadius,
  BoxDecoration,
  BoxShadow,
  Column,
  Container,
  Radius,
  SizedBox,
  Stack,
  Text,
  TextStyle,
} from "flitter-core";
import type { ProgressChartCustom } from "@headless/progress-chart/types";
import type { ProgressChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "@utils/index";
import { HoverTooltip } from "@shared/interaction/hover-tooltip";
import { toastTitle, tooltipContent } from "@styles/toast";

export { type ProgressChartConfig } from "./config";

const toastCustom: Partial<ProgressChartCustom<ProgressChartConfig>> = {
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
  title: toastTitle as any,
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
      tooltip: tooltipContent({
        label: label || "Progress",
        items: { legend: label || "Value", color: color ?? ctx.config.colors[0] ?? "#17a2e6", value },
        config: {
          ...defaultToastConfig,
          tooltip: ctx.config.tooltip,
          font: ctx.config.font,
        } as any,
      }),
      renderChild: (hovered) =>
        AnimatedFractionallySizedBox({
          duration: ctx.config.animation.duration,
          widthFactor: Math.max(0, Math.min(1, ratio)),
          alignment: Alignment.centerLeft,
          child: Container({
            width: Infinity,
            height: Infinity,
            decoration: new BoxDecoration({
              color: color ?? ctx.config.colors[0] ?? "#17a2e6",
              borderRadius: BorderRadius.all(Radius.circular(ctx.config.progress.cornerRadius)),
              border:
                hovered
                  ? Border.all({ color: "white", width: 2, strokeAlign: 1 })
                  : undefined,
              boxShadow: hovered
                ? [new BoxShadow({ color: "rgba(0,0,0,0.22)", blurRadius: 10 })]
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
  custom: toastCustom,
  createConfig: (config?: DeepPartial<ProgressChartConfig>): ProgressChartConfig =>
    deepMerge(defaultToastConfig, config),
};
