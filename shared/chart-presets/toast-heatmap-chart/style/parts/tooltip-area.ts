import type { Widget } from "flitterjs";
import type { HeatmapCustom } from "@flitterjs/chart";
import type { ToastHeatmapChartConfig } from "../config";
import { cartesian } from "../../../_shared/toast/index";

export function toastTooltipArea(
	...[{ tooltip, hoveredSegment }, ctx]: Parameters<
		HeatmapCustom<ToastHeatmapChartConfig>["tooltipArea"]
	>
): Widget {
	return cartesian.toastRectTooltipArea({
		tooltip,
		anchorRect: hoveredSegment,
		enabled: ctx.config.tooltip.enabled,
		mode: { variant: "heatmap" },
	});
}
