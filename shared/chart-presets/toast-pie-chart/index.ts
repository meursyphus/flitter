import type { Widget } from "flitter-ui";
import type { DeepPartial } from "flitter-ui/chart";
import { BasePieChart } from "./base";
import type { PieChartCustom, PieChartData } from "./base";
import { toastStyleConfig, type ToastPieChartConfig } from "./style";

export * from "./base";
export { type ToastPieChartConfig } from "./style";

export default function ToastPieChart({
  config,
  data,
  custom,
  ...rest
}: {
  config?: DeepPartial<ToastPieChartConfig>;
  data: PieChartData;
  custom?: Partial<PieChartCustom<ToastPieChartConfig>>;
}): Widget {
  return BasePieChart({
    data,
    config: toastStyleConfig.createConfig(config),
    custom: { ...toastStyleConfig.custom, ...custom },
    ...rest,
  });
}
