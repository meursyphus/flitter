import type { Widget } from "flitter-core";
import type { HeatmapCustom } from "@headless/heatmap-chart/types";
import type { ToastHeatmapChartConfig } from "../config";
import { cartesian } from "@styles/toast";

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
