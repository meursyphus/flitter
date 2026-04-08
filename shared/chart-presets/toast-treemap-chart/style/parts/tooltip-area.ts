import type { Widget } from "flitter-core";
import type { TreemapCustom } from "flitter-ui/chart";
import type { TreemapChartConfig } from "../config";
import { cartesian } from "../../../_styles/toast/index";

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
