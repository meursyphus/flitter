import type { Widget } from "flitter-ui";
import { BulletChart as HeadlessBulletChart } from "flitter-ui/chart";
import type {
  BulletChartCustom,
  BulletChartData,
  BulletChartDirection,
  GetScaleFn,
  GetScaleOptionsFn,
} from "./types";
import * as Base from "./base";
import { styleConfig, type BulletChartConfig } from "./style";
import type { DeepPartial } from "flitter-ui/chart";
import * as Cartesian from "flitter-ui/chart";

export type {
  BulletChartContext,
  BulletChartCustom,
  BulletChartData,
  BulletChartDataset,
  BulletChartDirection,
  BulletChartScale,
  BulletChartScaleOptions,
  GetScaleFn,
  GetScaleOptionsFn,
} from "./types";
export { BulletChartController } from "./types";
export { type BulletChartConfig } from "./style";

const baseDefaults: Partial<BulletChartCustom> = {
  bulletGroup: Base.BulletGroup,
  bulletBox: Base.BulletBox,
  dataView: Base.BulletDataView,
  grid: Base.BulletGrid,
  plot: (args) => Cartesian.Plot(args),
  tooltip: Base.BulletTooltip,
  tooltipArea: Base.BulletTooltipArea,
};

export default function BulletChart({
  config,
  custom,
  getScale = Base.defaultGetScale,
  getScaleOptions,
  direction = "horizontal",
  ...rest
}: {
  config?: DeepPartial<BulletChartConfig>;
  custom?: Partial<BulletChartCustom<BulletChartConfig>>;
  data: BulletChartData;
  direction?: BulletChartDirection;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
}): Widget {
  return HeadlessBulletChart({
    ...rest,
    getScale,
    direction,
    config: styleConfig.createConfig(config, direction),
    getScaleOptions: getScaleOptions ?? styleConfig.getScaleOptions,
    custom: { ...baseDefaults, ...styleConfig.custom, ...custom } as BulletChartCustom<BulletChartConfig>,
  });
}
