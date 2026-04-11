import type { Widget } from "flitter-core";
import type {
  BulletChartCustom,
  BulletChartData,
  BulletChartDirection,
  GetScaleFn,
  GetScaleOptionsFn,
} from "./types";
import { BulletChartProvider } from "./provider";

export default function BulletChart<TConfig extends object = object>(props: {
  custom: BulletChartCustom<TConfig>;
  data: BulletChartData;
  direction?: BulletChartDirection;
  getScale: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: TConfig;
}): Widget {
  return BulletChartProvider(props);
}
