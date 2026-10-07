import type { Widget } from "flitter-ui";
import { FunnelChart as HeadlessFunnelChart } from "flitter-ui/chart";
import type { DeepPartial } from "flitter-ui/chart";
import type { FunnelChartData, FunnelChartCustom } from "./types";
import { styleConfig, type FunnelChartConfig } from "./style";

export type {
  FunnelChartData,
  FunnelChartContext,
  FunnelChartCustom,
  FunnelStage,
} from "./types";
export { FunnelChartController } from "./types";
export type { FunnelChartConfig } from "./style";

export default function FunnelChart({
  data,
  config,
  custom,
}: {
  data: FunnelChartData;
  config?: DeepPartial<FunnelChartConfig>;
  custom?: Partial<FunnelChartCustom<FunnelChartConfig>>;
}): Widget {
  return HeadlessFunnelChart({
    data,
    config: styleConfig.createConfig(config),
    custom: { ...styleConfig.custom, ...custom },
  });
}
