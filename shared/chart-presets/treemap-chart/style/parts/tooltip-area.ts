import type { Widget } from "flitter-core";
import type { TreemapCustom } from "flitter-ui/chart";
import type { TreemapChartConfig } from "../config";
import { cartesian } from "../../../_styles/ag/index";

export function agTooltipArea(
	...[{ tooltip }, ctx]: Parameters<TreemapCustom<TreemapChartConfig>["tooltipArea"]>
): Widget {
	return cartesian.agMouseTooltipArea({
		tooltip,
		enabled: ctx.config.tooltip.enabled,
	});
}
