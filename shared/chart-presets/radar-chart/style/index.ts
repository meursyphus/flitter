import type { RadarChartCustom } from "flitter-ui/chart";
import { BoxDecoration, Container, type Widget } from "flitter-core";
import type { AgRadarChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import { agRadar } from "./parts/radar";
import { agAngularAxisLine } from "./parts/angular-axis-line";
import { agAngularAxisLabel } from "./parts/angular-axis-label";
import { agRadialAxisLine } from "./parts/radial-axis-line";
import { agRadialAxisLabel } from "./parts/radial-axis-label";
import { Layout as BaseLayout } from "../base/layout";
import { agTitle, agLegend } from "../../_styles/ag/index";

export { type AgRadarChartConfig } from "./config";

function agLayout(
  args: Parameters<RadarChartCustom<AgRadarChartConfig>["layout"]>[0],
  context: Parameters<RadarChartCustom<AgRadarChartConfig>["layout"]>[1],
): Widget {
  return Container({
    decoration: new BoxDecoration({
      color: context.config.background,
    }),
    child: BaseLayout(args as any, context as any),
  });
}

const agCustom: Partial<RadarChartCustom<AgRadarChartConfig>> = {
  layout: agLayout,
  radar: agRadar,
  angularAxisLine: agAngularAxisLine,
  angularAxisLabel: agAngularAxisLabel,
  radialAxisLine: agRadialAxisLine,
  radialAxisLabel: agRadialAxisLabel,
  legend: (args, context) => agLegend(args, context as any, { markerShape: "circle" }),
  title: agTitle,
};

export const agStyleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<AgRadarChartConfig>): AgRadarChartConfig =>
    deepMerge(defaultAgConfig, config),
};
