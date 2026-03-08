import type { Widget } from "flitter-core";
import { FunnelChart as HeadlessFunnelChart } from "flitter-ui/chart";
import type { FunnelChartCustom, FunnelChartData } from "./types";
import * as Base from "./base";

export type {
  FunnelChartContext,
  FunnelChartStage,
  FunnelChartStageView,
  FunnelChartData,
  FunnelChartCustom,
} from "./types";
export { FunnelChartController } from "./types";

const baseDefaults: Partial<FunnelChartCustom> = {
  layout: Base.Layout,
  funnel: Base.Funnel,
  stage: Base.Stage,
  stageLabel: Base.StageLabel,
  dataLabel: Base.DataLabel,
  legend: Base.Legend,
  title: Base.Title,
};

export default function FunnelChart<TConfig = {}>({
  custom,
  ...rest
}: {
  custom?: Partial<FunnelChartCustom<TConfig>>;
  data: FunnelChartData;
  config?: TConfig;
}): Widget {
  return HeadlessFunnelChart({
    ...rest,
    custom: { ...baseDefaults, ...custom } as FunnelChartCustom<TConfig>,
  });
}
