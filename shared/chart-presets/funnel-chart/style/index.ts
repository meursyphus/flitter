import { SizedBox, type Widget } from "flitter-core";
import type { FunnelChartCustom } from "flitter-ui/chart";
import type { FunnelChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import * as Base from "../base";

export { type FunnelChartConfig } from "./config";

const agCustom: Partial<FunnelChartCustom<FunnelChartConfig>> = {
  layout: Base.Layout,
  funnel: Base.Funnel,
  stage: Base.Stage,
  stageLabel: Base.StageLabel,
  dataLabel: Base.DataLabel,
  legend: () => SizedBox.shrink(),
  title: Base.Title,
};

export const styleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<FunnelChartConfig>): FunnelChartConfig =>
    deepMerge(defaultAgConfig, config),
};
