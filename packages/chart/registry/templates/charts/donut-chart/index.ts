import type { Widget } from "flitter-core";
import { BasePieChart } from "../pie-chart/base";
import type { DonutChartCustom, DonutChartData } from "./types";
import { styleConfig, type DonutChartConfig } from "./style";
import type { DeepPartial } from "@utils/index";

export type {
  DonutChartContext,
  DonutChartData,
  DonutChartCustom,
} from "./types";
export { DonutChartController } from "./types";
export { type DonutChartConfig } from "./style";

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
  return BasePieChart({
    data,
    config: styleConfig.createConfig({
      ...config,
      pie: {
        ...(config?.pie ?? {}),
        innerRadiusRatio,
      },
    }),
    custom: { ...styleConfig.custom, ...custom } as DonutChartCustom<DonutChartConfig>,
  });
}
