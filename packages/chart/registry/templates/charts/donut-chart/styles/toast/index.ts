import type { DonutChartCustom } from "@headless/donut-chart/types";
import { Center, Stack, StackFit, Text, TextStyle } from "flitter-core";
import { toastDataView as PieDataView } from "../../toast-pie-chart/style/parts/data-view";
import { toastSlice } from "../../toast-pie-chart/style/parts/slice";
import { Layout } from "../../pie-chart/base/layout";
import type { DonutChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "@utils/index";
import { toastLegend, toastTitle } from "@styles/toast";

export { type DonutChartConfig } from "./config";

const toastCustom: Partial<DonutChartCustom<DonutChartConfig>> = {
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
      style: new TextStyle({
        fontFamily: ctx.config.font.family,
        fontSize: 22,
        fontWeight: "700",
        color: "#333333",
      }),
    }),
};

export const styleConfig = {
  custom: toastCustom,
  createConfig: (config?: DeepPartial<DonutChartConfig>): DonutChartConfig =>
    deepMerge(defaultToastConfig, config),
};
