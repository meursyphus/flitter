import type { RadarChartCustom } from "flitter-ui/chart";
import type { RadarChartContext } from "flitter-ui/chart";
import { BoxDecoration, Container, type Widget } from "flitter-ui";
import type { AgRadarChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import { agRadar } from "./parts/radar";
import { agPlot } from "./parts/plot";
import { agTooltipArea } from "./parts/tooltip-area";
import { agAngularAxisLine } from "./parts/angular-axis-line";
import { agAngularAxisLabel } from "./parts/angular-axis-label";
import { agRadialAxis } from "./parts/radial-axis";
import { agRadialAxisLine } from "./parts/radial-axis-line";
import { agRadialAxisLabel } from "./parts/radial-axis-label";
import { Layout as BaseLayout } from "../base/layout";
import { agTitle, agLegend, agTooltipContent } from "../../_shared/ag/index";

export { type AgRadarChartConfig } from "./config";

function agLayout(
  args: Parameters<RadarChartCustom<AgRadarChartConfig>["layout"]>[0],
  context: Parameters<RadarChartCustom<AgRadarChartConfig>["layout"]>[1],
): Widget {
  return Container({
    decoration: new BoxDecoration({
      color: context.config.background,
    }),
    child: BaseLayout<AgRadarChartConfig>(args, context),
  });
}

function agTooltip(
  args: { label: string; items: { legend: string; color: string; value: number }[] },
  context: RadarChartContext<AgRadarChartConfig>,
): Widget {
  return agTooltipContent({ label: args.label, items: args.items, config: context.config });
}

const agCustom: Partial<RadarChartCustom<AgRadarChartConfig>> = {
  layout: agLayout,
  plot: agPlot,
  radar: agRadar,
  angularLine: agAngularAxisLine,
  angularAxisLabel: agAngularAxisLabel,
  radialAxis: agRadialAxis,
  radialLine: agRadialAxisLine,
  radialAxisLabel: agRadialAxisLabel,
  tooltipArea: agTooltipArea,
  tooltip: agTooltip,
  legend: (args, context) => agLegend(args, context, { markerShape: "circle" }),
  title: agTitle,
};

export const agStyleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<AgRadarChartConfig>): AgRadarChartConfig =>
    deepMerge(defaultAgConfig, config),
};
