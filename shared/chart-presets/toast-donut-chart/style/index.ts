import type { DonutChartContext, DonutChartCustom } from "flitter-ui/chart";
import { Column, MainAxisSize, SizedBox, Text, TextStyle } from "flitter-ui";
import type { DonutChartConfig } from "./config";
import { defaultToastConfig, normalizeDonutToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import {
	toastPieLikeDataLabel,
	toastPieLikeDataView,
	toastPieLikeRadialLabel,
	toastPieLikeRadialTick,
	toastPieLikeSegment,
	toastPieLikeTooltip,
	toastPieLikeTooltipArea,
} from "../../_shared/toast/polar-like";
import { toastLegend, toastTitle } from "../../_shared/toast/index";

export { type DonutChartConfig } from "./config";

const toastCustom: Partial<DonutChartCustom<DonutChartConfig>> = {
	segment: (args, context) => toastPieLikeSegment(args, context),
	dataView: ({ segments, dataCenter }, context) =>
		toastPieLikeDataView({ segments, dataCenter }, context),
	dataLabel: (args, context) => toastPieLikeDataLabel(args, context),
	radialLabel: (args, context) => toastPieLikeRadialLabel(args, context),
	radialTick: (args, context) => toastPieLikeRadialTick(args, context),
	legend: (args, context) => toastLegend(args, context, { markerShape: "circle" }),
	title: toastTitle,
	dataCenter: (args, context) => toastDataCenter(args, context),
	tooltip: (args, context) => toastPieLikeTooltip(args, context),
	tooltipArea: ({ tooltip, hoveredSegment }, context) =>
		toastPieLikeTooltipArea({ tooltip, hoveredSegment }, context),
};

export const styleConfig = {
  custom: toastCustom,
  createConfig: (config?: DeepPartial<DonutChartConfig>): DonutChartConfig =>
    normalizeDonutToastConfig(deepMerge(defaultToastConfig, config)),
};

function toastDataCenter(
	args: Parameters<DonutChartCustom<DonutChartConfig>["dataCenter"]>[0],
	ctx: DonutChartContext<DonutChartConfig>,
) {
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
