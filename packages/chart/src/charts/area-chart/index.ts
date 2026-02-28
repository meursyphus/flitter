import type { Widget } from "flitter-core";
import { areaChartStyles, type AreaChartStyleMap } from "./plugin";
import type { LineChartCustom, LineChartData } from "@headless/line-chart/types";

export default function AreaChart<S extends keyof AreaChartStyleMap>({
  style,
  config,
  data,
  custom,
  ...rest
}: {
  style: S;
  config?: Partial<AreaChartStyleMap[S]>;
  data: LineChartData;
  custom?: Partial<LineChartCustom<AreaChartStyleMap[S]>>;
  title?: string;
}): Widget {
  const factory = areaChartStyles[style];
  return factory({ data, config, custom, ...rest } as any);
}
