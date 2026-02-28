import type { Widget } from "flitter-core";
import { bubbleChartStyles, type BubbleChartStyleMap } from "./plugin";
import type { BubbleChartCustom, BubbleChartData, BubbleChartScale } from "@headless/bubble-chart/types";

export default function BubbleChart<S extends keyof BubbleChartStyleMap>({
  style,
  config,
  data,
  custom,
  ...rest
}: {
  style: S;
  config?: Partial<BubbleChartStyleMap[S]>;
  data: BubbleChartData;
  custom?: Partial<BubbleChartCustom<BubbleChartStyleMap[S]>>;
  title?: string;
  getScale?: (data: BubbleChartData) => BubbleChartScale;
}): Widget {
  const factory = bubbleChartStyles[style];
  return factory({ data, config, custom, ...rest } as any);
}
