import { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "../../_styles/ag/index";

type AgFunnelSharedConfig = Pick<
  AgCartesianBaseConfig,
  "font" | "title" | "subtitle" | "tooltip" | "padding" | "colors"
>;

export type FunnelChartConfig = AgFunnelSharedConfig & {
  funnel: {
    connectorSize: number;
    minSegmentRatio: number;
    labelGap: number;
    labelColumnWidth: number;
    labelBandSize: number;
    segmentRadius: number;
    dimOpacity: number;
  };
};

export const defaultAgConfig: FunnelChartConfig = {
  colors: defaultAgCartesianBaseConfig.colors,
  font: defaultAgCartesianBaseConfig.font,
  title: defaultAgCartesianBaseConfig.title,
  subtitle: defaultAgCartesianBaseConfig.subtitle,
  tooltip: defaultAgCartesianBaseConfig.tooltip,
  padding: defaultAgCartesianBaseConfig.padding,
  funnel: {
    connectorSize: 24,
    minSegmentRatio: 0.15,
    labelGap: 16,
    labelColumnWidth: 150,
    labelBandSize: 36,
    segmentRadius: 4,
    dimOpacity: 0.34,
  },
};
