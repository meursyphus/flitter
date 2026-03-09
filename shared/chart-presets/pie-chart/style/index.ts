import type { PieChartCustom } from "flitter-ui/chart";
import { BoxDecoration, Container, Text, TextStyle, type Widget } from "flitter-core";
import type { AgPieChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import { agSlice } from "./parts/slice";
import { agDataView } from "./parts/data-view";
import { Layout as BaseLayout } from "../base/layout";
import { agLegend } from "../../_styles/ag/index";

export { type AgPieChartConfig } from "./config";

function agPieTitle(
  _args: undefined,
  context: { config: AgPieChartConfig },
): Widget {
  const { title, font } = context.config;
  return Text(title.text, {
    style: new TextStyle({
      fontFamily: title.fontFamily ?? font.family,
      fontSize: title.fontSize,
      fontWeight: title.fontWeight,
      color: title.color,
    }),
  });
}

function agLayout(
  args: Parameters<PieChartCustom<AgPieChartConfig>["layout"]>[0],
  context: Parameters<PieChartCustom<AgPieChartConfig>["layout"]>[1],
): Widget {
  return Container({
    decoration: new BoxDecoration({
      color: context.config.background,
    }),
    child: BaseLayout(args as any, context as any),
  });
}

const agCustom: Partial<PieChartCustom<AgPieChartConfig>> = {
  layout: agLayout,
  slice: agSlice,
  dataView: agDataView,
  legend: (args, context) => agLegend(args, context as any, { markerShape: "circle" }),
  title: agPieTitle,
};

export const agStyleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<AgPieChartConfig>): AgPieChartConfig =>
    deepMerge(defaultAgConfig, config),
};
