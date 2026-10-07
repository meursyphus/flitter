import type { Widget } from "flitter-core";
import type { FunnelChartController } from "./controller";

export type FunnelChartData = {
  stages: { label: string; value: number }[];
};

/** Normalized geometry. Stage order and color indices follow the input. */
export type FunnelStage = {
  index: number;
  label: string;
  value: number;
  percentage: number;
  conversion: number | null;
  top: number;
  height: number;
  topWidth: number;
  bottomWidth: number;
};

export type FunnelChartContext<TConfig extends object = object> =
  FunnelChartController<TConfig>;

type Builder<T, TConfig extends object> = (
  args: T,
  context: FunnelChartContext<TConfig>,
) => Widget;

export type FunnelChartCustom<TConfig extends object = object> = {
  layout: Builder<{ title: Widget; legends: Widget[]; plot: Widget }, TConfig>;
  title: Builder<undefined, TConfig>;
  legend: Builder<{ name: string; index: number; isVisible: boolean }, TConfig>;
  plot: Builder<
    { stages: { stage: FunnelStage; widget: Widget }[]; tooltipArea: Widget },
    TConfig
  >;
  stage: Builder<
    FunnelStage & { isHovered: boolean; dataLabel: Widget },
    TConfig
  >;
  dataLabel: Builder<FunnelStage, TConfig>;
  tooltip: Builder<FunnelStage, TConfig>;
  tooltipArea: Builder<
    { stage: FunnelStage | null; tooltip: Widget | null },
    TConfig
  >;
};
