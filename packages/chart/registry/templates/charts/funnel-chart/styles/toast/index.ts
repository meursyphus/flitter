import type { FunnelChartCustom } from "@headless/funnel-chart/types";
import { SizedBox } from "flitter-core";
import type { FunnelChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "@utils/index";
import { toastTitle, tooltipContent, type ToastBaseConfig, defaultToastBaseConfig } from "@styles/toast";
import { toastConnector } from "./parts/connector";
import { toastDataLabel } from "./parts/data-label";
import { toastSegment } from "./parts/segment";
import { toastStageLabel } from "./parts/stage-label";
import { toastTooltipArea } from "./parts/tooltip-area";

export { type FunnelChartConfig } from "./config";

function toToastBaseConfig(config: FunnelChartConfig): ToastBaseConfig {
	return {
		...defaultToastBaseConfig,
		colors: config.colors,
		font: config.font,
		title: config.title,
		padding: config.padding,
		tooltip: config.tooltip,
		animation: config.animation,
	};
}

function toastFunnelTitle(
	_args: undefined,
	ctx: Parameters<FunnelChartCustom<FunnelChartConfig>["title"]>[1],
) {
	return toastTitle(undefined, { config: toToastBaseConfig(ctx.config) });
}

function toastTooltip(
	...[args, ctx]: Parameters<FunnelChartCustom<FunnelChartConfig>["tooltip"]>
) {
	return tooltipContent({
		label: args.label,
		items: args.items,
		config: toToastBaseConfig(ctx.config),
	});
}

const toastCustom: Partial<FunnelChartCustom<FunnelChartConfig>> = {
	title: toastFunnelTitle,
	stageLabel: toastStageLabel,
	dataLabel: toastDataLabel,
	segment: toastSegment,
	connector: toastConnector,
	legend: () => SizedBox.shrink(),
	tooltip: toastTooltip,
	tooltipArea: toastTooltipArea,
};

export const styleConfig = {
	custom: toastCustom,
	defaultDirection: "horizontal" as const,
	createConfig: (config?: DeepPartial<FunnelChartConfig>): FunnelChartConfig =>
		deepMerge(defaultToastConfig, config),
};
