import type { SunburstChartCustom } from "flitter-ui/chart";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import {
	agLegend,
	agTitle,
	agTooltipContent,
	defaultAgCartesianBaseConfig,
} from "../../_styles/ag/index";
import {
	agPieLikeLayout,
	agPieLikeTooltipArea,
} from "../../_styles/ag/polar-like";
import type { SunburstChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { agDataLabel } from "./parts/data-label";
import { agSegment } from "./parts/segment";

export { type SunburstChartConfig } from "./config";

function agTooltip(
	...[args, ctx]: Parameters<SunburstChartCustom<SunburstChartConfig>["tooltip"]>
) {
	const color =
		ctx.config.colors.fills[
			args.branchIndex % ctx.config.colors.fills.length
		] ?? "";

	return agTooltipContent({
		label: args.pathLabels.join(" / "),
		items: {
			legend: args.branchLabel,
			color,
			value: args.value,
		},
		config: ctx.config as typeof defaultAgCartesianBaseConfig,
	});
}

const agCustom: Partial<SunburstChartCustom<SunburstChartConfig>> = {
	layout: (args, context) => agPieLikeLayout(args, context),
	segment: agSegment,
	dataLabel: agDataLabel,
	legend: (args, context) => agLegend(args, context as any, { markerShape: "circle" }),
	title: agTitle as SunburstChartCustom<SunburstChartConfig>["title"],
	tooltip: agTooltip,
	tooltipArea: (args, context) => agPieLikeTooltipArea(args as any, context as any),
};

export const styleConfig = {
	custom: agCustom,
	createConfig: (config?: DeepPartial<SunburstChartConfig>): SunburstChartConfig =>
		deepMerge(defaultAgConfig, config),
};
