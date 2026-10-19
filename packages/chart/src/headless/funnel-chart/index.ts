import type { Widget } from "flitterjs";
import { FunnelChartProvider } from "./provider";
import type { FunnelChartCustom, FunnelChartData } from "./types";

export default function FunnelChart<TConfig extends object>(props: {
  data: FunnelChartData;
  custom: FunnelChartCustom<TConfig>;
  config: TConfig;
}): Widget {
  return FunnelChartProvider(props);
}
