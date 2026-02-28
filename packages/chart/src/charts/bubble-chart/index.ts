import type { Widget } from "flitter-core";
import { HeadlessBubbleChart } from "./headless";
import type {
  BubbleChartCustom,
  BubbleChartData,
  GetScaleFn,
  GetScaleOptionsFn,
} from "./headless";
import {
  bubbleChartStyleConfigs,
  type BubbleChartStyleMap,
} from "./plugin";

export default function BubbleChart<S extends keyof BubbleChartStyleMap>({
  style,
  config,
  data,
  custom,
  getScaleOptions,
  ...rest
}: {
  style: S;
  config?: Partial<BubbleChartStyleMap[S]>;
  data: BubbleChartData;
  custom?: Partial<BubbleChartCustom<BubbleChartStyleMap[S]>>;
  title?: string;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
}): Widget {
  const sc = bubbleChartStyleConfigs[style];
  return HeadlessBubbleChart({
    data,
    config: sc.createConfig(config),
    custom: { ...sc.custom, ...custom },
    getScaleOptions: getScaleOptions ?? sc.getScaleOptions,
    ...rest,
  });
}
