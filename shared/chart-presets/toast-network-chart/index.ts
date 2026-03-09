import type { Widget } from "flitter-core";
import { NetworkChart as HeadlessNetworkChart } from "flitter-ui/chart";
import type { NetworkChartCustom, NetworkChartData } from "./types";
import { styleConfig, type NetworkChartConfig } from "./style";
import type { DeepPartial } from "flitter-ui/chart";

export type {
  NetworkChartContext,
  NetworkNode,
  NetworkEdge,
  NetworkChartData,
  NetworkNodeLayout,
  NetworkEdgeLayout,
  NetworkLayout,
  NetworkChartCustom,
} from "./types";
export { NetworkChartController } from "./types";
export { type NetworkChartConfig } from "./style";

export default function NetworkChart({
  data,
  config,
  custom,
}: {
  custom?: Partial<NetworkChartCustom<NetworkChartConfig>>;
  data: NetworkChartData;
  config?: DeepPartial<NetworkChartConfig>;
}): Widget {
  return HeadlessNetworkChart({
    data,
    config: styleConfig.createConfig(config),
    custom: { ...styleConfig.custom, ...custom } as NetworkChartCustom<NetworkChartConfig>,
  });
}
