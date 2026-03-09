import type { PolarAreaChartCustom } from "flitter-ui/chart";
import {
  Alignment,
  Center,
  Container,
  FractionallySizedBox,
  Stack,
  StackFit,
  Transform,
} from "flitter-core";
import { Layout } from "../../pie-chart/base/layout";
import { toastLegend, toastTitle } from "../../_styles/toast/index";
import { toastSlice } from "../../toast-pie-chart/style/parts/slice";
import type { PolarAreaChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";

export { type PolarAreaChartConfig } from "./config";

const toastCustom: Partial<PolarAreaChartCustom<PolarAreaChartConfig>> = {
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

export const styleConfig = {
  custom: toastCustom,
  createConfig: (config?: DeepPartial<PolarAreaChartConfig>): PolarAreaChartConfig =>
    deepMerge(defaultToastConfig, config),
};
