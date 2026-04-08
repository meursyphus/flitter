import type { DonutChartContext, DonutChartCustom } from "flitter-ui/chart";
import { Column, MainAxisSize, SizedBox, Text, TextStyle, type Widget } from "flitter-core";
import type { DonutChartConfig } from "./config";
import { defaultAgConfig, normalizeDonutAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
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
} from "../../_styles/ag/polar-like";
import { agLegend } from "../../_styles/ag/index";

export { type DonutChartConfig } from "./config";

const agCustom: Partial<DonutChartCustom<DonutChartConfig>> = {
	layout: (args, context) => agPieLikeLayout(args, context),
	segment: (args, context) => agPieLikeSegment(args, context),
	dataView: ({ segments, dataCenter }) =>
		agPieLikeDataView({ segments, dataCenter }),
	dataLabel: (args, context) => agPieLikeDataLabel(args, context),
	radialLabel: (args, context) => agPieLikeRadialLabel(args, context),
	radialTick: (args, context) => agPieLikeRadialTick(args, context),
	legend: (args, context) => agLegend(args, context as any, { markerShape: "circle" }),
	title: (args, context) => agPieLikeTitle(args, context),
	dataCenter: (args, context) => agDataCenter(args, context),
	tooltip: (args, context) => agPieLikeTooltip(args, context),
	tooltipArea: ({ tooltip, hoveredSegment }, context) =>
		agPieLikeTooltipArea({ tooltip, hoveredSegment }, context),
};

export const styleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<DonutChartConfig>): DonutChartConfig =>
    normalizeDonutAgConfig(deepMerge(defaultAgConfig, config)),
};

function agDataCenter(
	args: Parameters<DonutChartCustom<DonutChartConfig>["dataCenter"]>[0],
	ctx: DonutChartContext<DonutChartConfig>,
): Widget {
	const centerConfig = ctx.config.dataCenter;
	if (!centerConfig.visible) return SizedBox.shrink();

	const content = centerConfig.formatter({
		total: args.total,
		hoveredSegment: args.hoveredSegment,
		mode: centerConfig.mode,
	});

	if (!content.value) return SizedBox.shrink();

	return Column({
		mainAxisSize: MainAxisSize.min,
		children: [
			...(content.label
				? [
					Text(content.label, {
						style: new TextStyle({
							fontFamily: centerConfig.labelFontFamily ?? ctx.config.font.family,
							fontSize: centerConfig.labelFontSize,
							fontWeight: centerConfig.labelFontWeight,
							color: centerConfig.labelColor,
						}),
					}),
					SizedBox({ height: centerConfig.gap }),
				]
				: []),
			Text(content.value, {
				style: new TextStyle({
					fontFamily: centerConfig.valueFontFamily ?? ctx.config.font.family,
					fontSize: centerConfig.valueFontSize,
					fontWeight: centerConfig.valueFontWeight,
					color: centerConfig.valueColor,
				}),
			}),
		],
	});
}
