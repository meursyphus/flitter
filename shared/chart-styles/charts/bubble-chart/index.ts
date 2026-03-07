import type { Widget } from "flitter-core";
import { BaseBubbleChart } from "./base";
import type {
  BubbleChartCustom,
  BubbleChartData,
  GetScaleFn,
  GetScaleOptionsFn,
} from "./base";
import type { DeepPartial } from "@utils/index";
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
  config?: DeepPartial<BubbleChartStyleMap[S]>;
  data: BubbleChartData;
  custom?: Partial<BubbleChartCustom<BubbleChartStyleMap[S]>>;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
}): Widget {
  const sc = bubbleChartStyleConfigs[style];
  return BaseBubbleChart({
    data,
    config: sc.createConfig(config),
    custom: { ...sc.custom, ...custom },
    getScaleOptions: getScaleOptions ?? sc.getScaleOptions,
    ...rest,
  });
}
