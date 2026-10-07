import type { Widget } from "flitter-core";
import { FunnelChartProvider } from "./provider";
import type { FunnelChartCustom, FunnelChartData } from "./types";

export default function FunnelChart<TConfig extends object>(props: {
  data: FunnelChartData;
  custom: FunnelChartCustom<TConfig>;
  config: TConfig;
}): Widget {
  return FunnelChartProvider(props);
}
