import type { Widget } from "flitter-core";
import { lineChartStyles, type LineChartStyleMap } from "./plugin";
import type { LineChartCustom, LineChartData, LineChartScale } from "@headless/line-chart/types";

export default function LineChart<S extends keyof LineChartStyleMap>({
  style,
  config,
  data,
  custom,
  ...rest
}: {
  style: S;
  config?: Partial<LineChartStyleMap[S]>;
  data: LineChartData;
  custom?: Partial<LineChartCustom<LineChartStyleMap[S]>>;
  title?: string;
  getScale?: (data: LineChartData) => LineChartScale;
}): Widget {
  const factory = lineChartStyles[style];
  return factory({ data, config, custom, ...rest } as any);
}
