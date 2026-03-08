import type { Widget } from "flitter-core";
import {
  Stack,
  StackFit,
  Center,
  Transform,
  Alignment,
  FractionallySizedBox,
  Container,
} from "flitter-core";
import { PolarAreaChart as HeadlessPolarAreaChart } from "flitter-ui/chart";
import type { PolarAreaChartCustom, PolarAreaChartData } from "./types";
import { Layout } from "../toast-pie-chart/base/layout";
import { toastLegend, toastTitle } from "../_styles/toast/index";
import { toastSlice } from "../toast-pie-chart/style/parts/slice";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import type { ToastPieChartConfig } from "../toast-pie-chart/style/config";
import { defaultToastConfig } from "../toast-pie-chart/style/config";

type PolarAreaConfig = ToastPieChartConfig;

export type {
  PolarAreaChartContext,
  PolarAreaChartData,
  PolarAreaChartCustom,
} from "./types";
export { PolarAreaChartController } from "./types";

const defaultPolarConfig: PolarAreaConfig = {
  ...defaultToastConfig,
  pie: { ...defaultToastConfig.pie, innerRadiusRatio: 0 },
};

const baseDefaults: Partial<PolarAreaChartCustom<PolarAreaConfig>> = {
  layout: (args, ctx) => Layout(args as any, ctx as any),
  dataView: ({ sectors, scale }) =>
    Stack({
      fit: StackFit.expand,
      children: [scale, ...sectors],
    }),
  sector: ({ index, name, value, ratio, angle, startAngle }, ctx) =>
    Transform.rotate({
      angle: startAngle,
      alignment: Alignment.center,
      child: Center({
        child: FractionallySizedBox({
          widthFactor: Math.max(0.05, ratio),
          heightFactor: Math.max(0.05, ratio),
          child: toastSlice(
            {
              index,
              name,
              value,
              percentage: ratio * 100,
              sweepAngle: angle,
            } as any,
            ctx as any,
          ),
        }),
      }),
    }),
  scale: () => Container({ width: 0, height: 0 }),
  legend: (args, ctx) => toastLegend(args as any, ctx as any, { markerShape: "circle" }),
  title: (args, ctx) => toastTitle(args as any, ctx as any),
};

export default function PolarAreaChart({
  config,
  data,
  custom,
}: {
  config?: DeepPartial<PolarAreaConfig>;
  data: PolarAreaChartData;
  custom?: Partial<PolarAreaChartCustom<PolarAreaConfig>>;
}): Widget {
  return HeadlessPolarAreaChart({
    data,
    config: deepMerge(defaultPolarConfig, config),
    custom: { ...baseDefaults, ...custom } as PolarAreaChartCustom<PolarAreaConfig>,
  });
}
