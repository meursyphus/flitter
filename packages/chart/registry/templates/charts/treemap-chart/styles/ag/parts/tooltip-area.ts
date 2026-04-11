import type { Widget } from "flitter-core";
import type { TreemapCustom } from "@headless/treemap-chart/types";
import type { TreemapChartConfig } from "../config";
import { cartesian } from "@styles/ag";

export function agTooltipArea(
	...[{ tooltip }, ctx]: Parameters<TreemapCustom<TreemapChartConfig>["tooltipArea"]>
): Widget {
	return cartesian.agMouseTooltipArea({
		tooltip,
		enabled: ctx.config.tooltip.enabled,
	});
}
