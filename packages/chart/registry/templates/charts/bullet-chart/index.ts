import type { Widget } from "flitter-core";
import HeadlessBulletChart from "@headless/bullet-chart";
import type {
  BulletChartCustom,
  BulletChartData,
  GetScaleFn,
  GetScaleOptionsFn,
} from "./types";
import * as Base from "./base";
import { styleConfig, type BulletChartConfig } from "./style";
import type { DeepPartial } from "@utils/index";

export type {
  BulletChartContext,
  BulletChartCustom,
  BulletChartData,
  BulletChartDataset,
  BulletChartScale,
  BulletChartScaleOptions,
  GetScaleFn,
  GetScaleOptionsFn,
} from "./types";
export { BulletChartController } from "./types";
export { type BulletChartConfig } from "./style";

const baseDefaults: Partial<BulletChartCustom> = {
  bulletGroup: Base.BulletGroup,
  dataView: Base.BulletDataView,
  grid: Base.BulletGrid,
};

export default function BulletChart({
  config,
  custom,
  getScale = Base.defaultGetScale,
  getScaleOptions,
  ...rest
}: {
  config?: DeepPartial<BulletChartConfig>;
  custom?: Partial<BulletChartCustom<BulletChartConfig>>;
  data: BulletChartData;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
}): Widget {
  return HeadlessBulletChart({
    ...rest,
    getScale,
    config: styleConfig.createConfig(config),
    getScaleOptions: getScaleOptions ?? styleConfig.getScaleOptions,
    custom: { ...baseDefaults, ...styleConfig.custom, ...custom } as BulletChartCustom<BulletChartConfig>,
  });
}
