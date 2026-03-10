import type { DonutChartCustom } from "flitter-ui/chart";
import { Center, SizedBox, Stack, StackFit, Text, TextStyle } from "flitter-core";
import { agDataView as PieDataView } from "../../pie-chart/style/parts/data-view";
import { agSlice } from "../../pie-chart/style/parts/slice";
import { Layout } from "../../pie-chart/base/layout";
import type { DonutChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import { agLegend, agTitle } from "../../_styles/ag/index";

export { type DonutChartConfig } from "./config";

const agCustom: Partial<DonutChartCustom<DonutChartConfig>> = {
  layout: (args, ctx) => Layout(args as any, ctx as any),
  dataView: ({ slices, centerContent }, ctx) =>
    Stack({
      fit: StackFit.expand,
      children: [
        PieDataView({ slices } as any, ctx as any),
        Center({ child: centerContent }),
      ],
    }),
  slice: (args, ctx) => agSlice(args as any, ctx as any),
  legend: (args, ctx) => agLegend(args as any, ctx as any, { markerShape: "circle" }),
  title: (args, ctx) => agTitle(args as any, ctx as any),
  centerContent: ({ total }, ctx) =>
    ctx.config.centerText == null
      ? SizedBox.shrink()
      : Text(ctx.config.centerText.toString(), {
          style: new TextStyle({
            fontFamily: ctx.config.font.family,
            fontSize: 22,
            fontWeight: "700",
            color: ctx.config.title.color,
          }),
        }),
};

export const styleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<DonutChartConfig>): DonutChartConfig =>
    deepMerge(defaultAgConfig, config),
};
