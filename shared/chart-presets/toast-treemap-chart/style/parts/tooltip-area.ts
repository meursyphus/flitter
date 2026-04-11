import type { Widget } from "flitter-ui";
import type { TreemapCustom } from "flitter-ui/chart";
import type { TreemapChartConfig } from "../config";
import { cartesian } from "../../../_shared/toast/index";

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
