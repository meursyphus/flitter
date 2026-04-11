import type { HoveredPieChartSegment, PieChartCustom } from "@headless/pie-chart/types";
import type { Widget } from "flitter-core";
import type { AgPieChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "@utils/index";
import {
	agPieLikeDataLabel,
	agPieLikeDataView,
	agPieLikeLayout,
	agPieLikeRadialLabel,
	agPieLikeRadialTick,
	agPieLikeSegment,
	agPieLikeTitle,
	agPieLikeTooltip,
	agPieLikeTooltipArea,
} from "@styles/ag/polar-like";
import { agLegend } from "@styles/ag";

export { type AgPieChartConfig } from "./config";

const agCustom: Partial<PieChartCustom<AgPieChartConfig>> = {
  layout: (args, context) => agPieLikeLayout(args, context),
  segment: (args, context) => agPieLikeSegment(args, context),
  dataView: ({ segments }) => agPieLikeDataView({ segments }),
  dataLabel: (args, context) => agPieLikeDataLabel(args, context),
  radialLabel: (args, context) => agPieLikeRadialLabel(args, context),
  radialTick: (args, context) => agPieLikeRadialTick(args, context),
  legend: (args, context) => agLegend(args, context, { markerShape: "circle" }),
  title: (args, context) => agPieLikeTitle(args, context),
  tooltip: (args, context) => agTooltip(args, context),
  tooltipArea: ({ tooltip, hoveredSegment }, context) =>
    agPieLikeTooltipArea({ tooltip, hoveredSegment }, context),
};

export const agStyleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<AgPieChartConfig>): AgPieChartConfig =>
    deepMerge(defaultAgConfig, config),
};

function agTooltip(
  args: HoveredPieChartSegment,
  context: { config: AgPieChartConfig; legends: string[] },
): Widget {
	return agPieLikeTooltip(args, context);
}
