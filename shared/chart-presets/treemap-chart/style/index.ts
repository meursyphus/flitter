import type { TreemapCustom } from "flitter-ui/chart";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import {
	agLegend,
	agTitle,
	agTooltipContent,
	defaultAgCartesianBaseConfig,
} from "../../_shared/ag/index";
import type { TreemapChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { agDataLabel } from "./parts/data-label";
import { agGroup } from "./parts/group";
import { agGroupTitle } from "./parts/group-title";
import { agNode } from "./parts/node";
import { agTooltipArea } from "./parts/tooltip-area";

export { type TreemapChartConfig } from "./config";

function agTooltip(
	...[args, ctx]: Parameters<TreemapCustom<TreemapChartConfig>["tooltip"]>
) {
	return agTooltipContent({
		label: args.label,
		items: args.items,
		config: ctx.config as typeof defaultAgCartesianBaseConfig,
	});
}

const agCustom: Partial<TreemapCustom<TreemapChartConfig>> = {
	title: agTitle as TreemapCustom<TreemapChartConfig>["title"],
	legend: (args, ctx) => agLegend(args, ctx as any),
	group: agGroup,
	groupTitle: agGroupTitle,
	node: agNode,
	dataLabel: agDataLabel,
	tooltip: agTooltip,
	tooltipArea: agTooltipArea,
};

export const styleConfig = {
	custom: agCustom,
	createConfig: (config?: DeepPartial<TreemapChartConfig>): TreemapChartConfig =>
		deepMerge(defaultAgConfig, config),
};
