import { SizedBox } from "flitter-core";
import type { TreemapCustom } from "@headless/treemap-chart/types";
import { deepMerge, type DeepPartial } from "@utils/index";
import { toastLegend, toastTitle, tooltipContent } from "@styles/toast";
import type { TreemapChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { toastDataLabel } from "./parts/data-label";
import { toastGroup } from "./parts/group";
import { toastNode } from "./parts/node";
import { toastTooltipArea } from "./parts/tooltip-area";

export { type TreemapChartConfig } from "./config";

function toastTooltip(
	...[args, ctx]: Parameters<TreemapCustom<TreemapChartConfig>["tooltip"]>
) {
	return tooltipContent({
		label: args.label,
		items: args.items,
		config: ctx.config as any,
	});
}

const toastCustom: Partial<TreemapCustom<TreemapChartConfig>> = {
	title: toastTitle as TreemapCustom<TreemapChartConfig>["title"],
	legend: (args, ctx) => toastLegend(args, ctx as any),
	group: toastGroup,
	groupTitle: () => SizedBox.shrink(),
	node: toastNode,
	dataLabel: toastDataLabel,
	tooltip: toastTooltip,
	tooltipArea: toastTooltipArea,
};

export const styleConfig = {
	custom: toastCustom,
	createConfig: (config?: DeepPartial<TreemapChartConfig>): TreemapChartConfig =>
		deepMerge(defaultToastConfig, config),
};
