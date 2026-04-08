import type { FunnelChartCustom } from "@headless/funnel-chart/types";
import type { FunnelChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "@utils/index";
import { SizedBox } from "flitter-core";
import {
	agTitle,
	agTooltipContent,
	type AgCartesianBaseConfig,
	defaultAgCartesianBaseConfig,
} from "@styles/ag";
import { agConnector } from "./parts/connector";
import { agDataLabel } from "./parts/data-label";
import { agSegment } from "./parts/segment";
import { agStageLabel } from "./parts/stage-label";
import { agTooltipArea } from "./parts/tooltip-area";

export { type FunnelChartConfig } from "./config";

function toAgBaseConfig(config: FunnelChartConfig): AgCartesianBaseConfig {
	return {
		...defaultAgCartesianBaseConfig,
		colors: config.colors,
		font: config.font,
		title: config.title,
		subtitle: config.subtitle,
		padding: config.padding,
		tooltip: config.tooltip,
	};
}

function agFunnelTitle(
	_args: undefined,
	ctx: Parameters<FunnelChartCustom<FunnelChartConfig>["title"]>[1],
) {
	return agTitle(undefined, { config: toAgBaseConfig(ctx.config) });
}

function agTooltip(
	...[args, ctx]: Parameters<FunnelChartCustom<FunnelChartConfig>["tooltip"]>
) {
	return agTooltipContent({
		label: args.label,
		items: args.items,
		config: toAgBaseConfig(ctx.config),
	});
}

const agCustom: Partial<FunnelChartCustom<FunnelChartConfig>> = {
	title: agFunnelTitle,
	stageLabel: agStageLabel,
	dataLabel: agDataLabel,
	segment: agSegment,
	connector: agConnector,
	legend: () => SizedBox.shrink(),
	tooltip: agTooltip,
	tooltipArea: agTooltipArea,
};

export const styleConfig = {
	custom: agCustom,
	defaultDirection: "vertical" as const,
	createConfig: (config?: DeepPartial<FunnelChartConfig>): FunnelChartConfig =>
		deepMerge(defaultAgConfig, config),
};
