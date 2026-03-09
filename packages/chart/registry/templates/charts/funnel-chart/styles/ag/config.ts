import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "@styles/ag";

type AgFunnelSharedConfig = Pick<
  AgCartesianBaseConfig,
  "font" | "title" | "tooltip"
>;

export type FunnelChartConfig = AgFunnelSharedConfig & {
  funnel: {
    stageHeight: number;
  };
};

export const defaultAgConfig: FunnelChartConfig = {
  font: defaultAgCartesianBaseConfig.font,
  title: defaultAgCartesianBaseConfig.title,
  tooltip: defaultAgCartesianBaseConfig.tooltip,
  funnel: {
    stageHeight: 40,
  },
};
