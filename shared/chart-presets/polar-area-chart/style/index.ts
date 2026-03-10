import type { PolarAreaChartCustom } from "flitter-ui/chart";
import {
  Alignment,
  Center,
  FractionallySizedBox,
  Stack,
  StackFit,
  Transform,
} from "flitter-core";
import { Layout } from "../../pie-chart/base/layout";
import { agLegend, agTitle } from "../../_styles/ag/index";
import { agSlice } from "../../pie-chart/style/parts/slice";
import type { PolarAreaChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import { agScale } from "./parts/scale";

export { type PolarAreaChartConfig } from "./config";

const agCustom: Partial<PolarAreaChartCustom<PolarAreaChartConfig>> = {
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
          child: agSlice(
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
  scale: agScale,
  legend: (args, ctx) => agLegend(args as any, ctx as any, { markerShape: "circle" }),
  title: (args, ctx) => agTitle(args as any, ctx as any),
};

export const styleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<PolarAreaChartConfig>): PolarAreaChartConfig =>
    deepMerge(defaultAgConfig, config),
};
