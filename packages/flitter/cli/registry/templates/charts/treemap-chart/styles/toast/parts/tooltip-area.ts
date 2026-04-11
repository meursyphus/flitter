import type { Widget } from "flitter-core";
import type { TreemapCustom } from "@headless/treemap-chart/types";
import type { TreemapChartConfig } from "../config";
import { cartesian } from "@styles/toast";

export function toastTooltipArea(
	...[{ tooltip, hoveredNode }, ctx]: Parameters<
		TreemapCustom<TreemapChartConfig>["tooltipArea"]
	>
): Widget {
	return cartesian.toastRectTooltipArea({
		tooltip,
		anchorRect: hoveredNode,
		enabled: ctx.config.tooltip.enabled,
		mode: { variant: "heatmap" },
	});
}
