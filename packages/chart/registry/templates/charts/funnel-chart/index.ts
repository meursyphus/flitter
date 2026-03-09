import type { Widget } from "flitter-core";
import { FunnelChart as HeadlessFunnelChart } from "flitter-ui/chart";
import type { FunnelChartCustom, FunnelChartData } from "./types";
import { styleConfig, type FunnelChartConfig } from "./style";
import type { DeepPartial } from "@utils/index";

export type {
  FunnelChartContext,
  FunnelChartStage,
  FunnelChartStageView,
  FunnelChartData,
  FunnelChartCustom,
} from "./types";
export { FunnelChartController } from "./types";
export { type FunnelChartConfig } from "./style";

export default function FunnelChart({
  data,
  config,
  custom,
}: {
  custom?: Partial<FunnelChartCustom<FunnelChartConfig>>;
  data: FunnelChartData;
  config?: DeepPartial<FunnelChartConfig>;
}): Widget {
  return HeadlessFunnelChart({
    data,
    config: styleConfig.createConfig(config),
    custom: { ...styleConfig.custom, ...custom } as FunnelChartCustom<FunnelChartConfig>,
  });
}
