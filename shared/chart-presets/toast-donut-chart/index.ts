import type { Widget } from "flitter-ui";
import { BaseDonutChart } from "./base";
import type { DonutChartCustom, DonutChartData } from "./types";
import { styleConfig, type DonutChartConfig } from "./style";
import type { DeepPartial } from "flitter-ui/chart";

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
  thicknessRatio,
  innerRadiusRatio,
}: {
  config?: DeepPartial<DonutChartConfig>;
  data: DonutChartData;
  custom?: Partial<DonutChartCustom<DonutChartConfig>>;
  thicknessRatio?: number;
  innerRadiusRatio?: number;
}): Widget {
  const resolvedThicknessRatio = thicknessRatio
    ?? (innerRadiusRatio == null ? undefined : 1 - innerRadiusRatio);

  return BaseDonutChart({
    data,
    config: styleConfig.createConfig({
      ...config,
      donut: {
        ...(config?.donut ?? {}),
        ...(resolvedThicknessRatio == null ? {} : { thicknessRatio: resolvedThicknessRatio }),
      },
    }),
    custom: { ...styleConfig.custom, ...custom } as DonutChartCustom<DonutChartConfig>,
  });
}
