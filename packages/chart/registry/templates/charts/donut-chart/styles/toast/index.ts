import type { PieChartContext, PieChartCustom } from "@headless/pie-chart/types";
import { Center, SizedBox, Stack, StackFit, Text, TextStyle } from "flitter-core";
import { DataView } from "../../pie-chart/base/data-view";
import type { DonutChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "@utils/index";
import { toastStyleConfig as pieToastStyleConfig } from "../../toast-pie-chart/style";

export { type DonutChartConfig } from "./config";

const toastCustom: Partial<PieChartCustom<DonutChartConfig>> = {
  ...(pieToastStyleConfig.custom as Partial<PieChartCustom<DonutChartConfig>>),
  dataView: ({ slices }, ctx) =>
    Stack({
      fit: StackFit.expand,
      children: [
        (pieToastStyleConfig.custom.dataView?.(
          { slices, dataLabels: [] },
          ctx as any,
        ) ?? DataView({ slices, dataLabels: [] }, ctx as any)),
        Center({ child: toastCenterContent(ctx) }),
      ],
    }),
  dataLabel: () => SizedBox.shrink(),
};

export const styleConfig = {
  custom: toastCustom,
  createConfig: (config?: DeepPartial<DonutChartConfig>): DonutChartConfig =>
    deepMerge(defaultToastConfig, config),
};

function toastCenterContent(ctx: PieChartContext<DonutChartConfig>) {
  const total = ctx.data.datasets.reduce((sum, dataset) => sum + dataset.value, 0);

  return Text((ctx.config.centerText ?? total.toString()).toString(), {
    style: new TextStyle({
      fontFamily: ctx.config.font.family,
      fontSize: 22,
      fontWeight: "700",
      color: "#333333",
    }),
  });
}
