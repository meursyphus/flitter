import {
  type AgCartesianBaseConfig,
  defaultAgCartesianBaseConfig,
} from "../../_shared/ag/index";
import {
  defaultFunnelAppearance,
  type FunnelAppearance,
} from "../base/config";

export type FunnelChartConfig = Pick<
  AgCartesianBaseConfig,
  | "colors"
  | "font"
  | "title"
  | "legend"
  | "padding"
  | "tooltip"
  | "background"
  | "subtitle"
> &
  FunnelAppearance;

export const defaultConfig: FunnelChartConfig = {
  ...defaultAgCartesianBaseConfig,
  ...defaultFunnelAppearance,
  legend: { ...defaultAgCartesianBaseConfig.legend, visible: false },
  dataLabel: {
    ...defaultFunnelAppearance.dataLabel,
    color: defaultAgCartesianBaseConfig.legend.color,
    fontSize: defaultAgCartesianBaseConfig.font.size,
  },
};
