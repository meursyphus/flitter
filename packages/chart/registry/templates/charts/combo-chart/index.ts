import type { Widget } from "flitter-core";
import { ComboChart as HeadlessComboChart } from "flitter-ui/chart";
import type { ComboChartCustom, ComboChartData } from "./types";
import { styleConfig, type ComboChartConfig } from "./style";
import type { DeepPartial } from "@utils/index";

export type {
  ComboChartContext,
  ComboDataset,
  ComboChartData,
  ComboAxisScale,
  ComboChartScale,
  ComboChartCustom,
} from "./types";
export { ComboChartController } from "./types";
export { type ComboChartConfig } from "./style";

export default function ComboChart({
  data,
  config,
  custom,
}: {
  custom?: Partial<ComboChartCustom<ComboChartConfig>>;
  data: ComboChartData;
  config?: DeepPartial<ComboChartConfig>;
}): Widget {
  return HeadlessComboChart({
    data,
    config: styleConfig.createConfig(config),
    custom: { ...styleConfig.custom, ...custom } as ComboChartCustom<ComboChartConfig>,
  });
}
