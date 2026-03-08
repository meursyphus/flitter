import type { Widget } from "flitter-core";
import { Stack, StackFit, Center, Text, TextStyle } from "flitter-core";
import { DonutChart as HeadlessDonutChart } from "flitter-ui/chart";
import type { DonutChartCustom, DonutChartData } from "./types";
import { Layout } from "../toast-pie-chart/base/layout";
import { DataView as PieDataView } from "../toast-pie-chart/base/data-view";
import { toastSlice } from "../toast-pie-chart/style/parts/slice";
import { toastLegend, toastTitle } from "../_styles/toast/index";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import type { ToastPieChartConfig } from "../toast-pie-chart/style/config";
import { defaultToastConfig } from "../toast-pie-chart/style/config";

type DonutChartConfig = ToastPieChartConfig & {
  centerText?: string;
};

export type {
  DonutChartContext,
  DonutChartData,
  DonutChartCustom,
} from "./types";
export { DonutChartController } from "./types";

const defaultDonutConfig: DonutChartConfig = {
  ...defaultToastConfig,
  pie: { ...defaultToastConfig.pie, innerRadiusRatio: 0.6 },
};

const baseDefaults: Partial<DonutChartCustom<DonutChartConfig>> = {
  layout: (args, ctx) => Layout(args as any, ctx as any),
  dataView: ({ slices, centerContent }, ctx) =>
    Stack({
      fit: StackFit.expand,
      children: [
        PieDataView({ slices } as any, ctx as any),
        Center({ child: centerContent }),
      ],
    }),
  slice: (args, ctx) => toastSlice(args as any, ctx as any),
  legend: (args, ctx) => toastLegend(args as any, ctx as any, { markerShape: "circle" }),
  title: (args, ctx) => toastTitle(args as any, ctx as any),
  centerContent: ({ total }, ctx) =>
    Text((ctx.config.centerText ?? total.toString()).toString(), {
      style: new TextStyle({ fontSize: 22, fontWeight: "700", color: "#333333" }),
    }),
};

export default function DonutChart({
  config,
  data,
  custom,
  innerRadiusRatio = 0.6,
}: {
  config?: DeepPartial<DonutChartConfig>;
  data: DonutChartData;
  custom?: Partial<DonutChartCustom<DonutChartConfig>>;
  innerRadiusRatio?: number;
}): Widget {
  return HeadlessDonutChart({
    data,
    innerRadiusRatio,
    config: deepMerge(defaultDonutConfig, config),
    custom: { ...baseDefaults, ...custom } as DonutChartCustom<DonutChartConfig>,
  });
}
