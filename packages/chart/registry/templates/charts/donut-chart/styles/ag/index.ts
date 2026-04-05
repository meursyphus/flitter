import type { PieChartContext, PieChartCustom } from "@headless/pie-chart/types";
import { Center, SizedBox, Stack, StackFit, Text, TextStyle } from "flitter-core";
import { DataView } from "../../pie-chart/base/data-view";
import type { DonutChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "@utils/index";
import { agStyleConfig as pieAgStyleConfig } from "../../pie-chart/styles/ag";

export { type DonutChartConfig } from "./config";

const agCustom: Partial<PieChartCustom<DonutChartConfig>> = {
  ...(pieAgStyleConfig.custom as Partial<PieChartCustom<DonutChartConfig>>),
  dataView: ({ slices }, ctx) =>
    Stack({
      fit: StackFit.expand,
      children: [
        (pieAgStyleConfig.custom.dataView?.(
          { slices, dataLabels: [] },
          ctx as any,
        ) ?? DataView({ slices, dataLabels: [] }, ctx as any)),
        Center({ child: agCenterContent(ctx) }),
      ],
    }),
  dataLabel: () => SizedBox.shrink(),
};

export const styleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<DonutChartConfig>): DonutChartConfig =>
    deepMerge(defaultAgConfig, config),
};

function agCenterContent(ctx: PieChartContext<DonutChartConfig>) {
  if (ctx.config.centerText == null) return SizedBox.shrink();

  return Text(ctx.config.centerText.toString(), {
    style: new TextStyle({
      fontFamily: ctx.config.font.family,
      fontSize: 22,
      fontWeight: "700",
      color: ctx.config.title.color,
    }),
  });
}
