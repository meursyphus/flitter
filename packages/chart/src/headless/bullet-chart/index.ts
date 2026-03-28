import type { Widget } from "flitter-core";
import type { BulletChartCustom, BulletChartData, GetScaleFn, GetScaleOptionsFn } from "./types";
import { BulletChartProvider } from "./provider";

export default function BulletChart<TConfig = {}>(props: {
  custom: BulletChartCustom<TConfig>;
  data: BulletChartData;
  getScale: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: TConfig;
}): Widget {
  return BulletChartProvider(props as any);
}
