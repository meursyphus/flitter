import type { Widget } from "flitter-core";
import type { FunnelChartCustom } from "flitter-ui/chart";
import type { FunnelChartConfig } from "../config";
import { cartesian } from "../../../_styles/toast/index";

export function toastTooltipArea(
	...[{ tooltip, hoveredStage }, ctx]: Parameters<
		FunnelChartCustom<FunnelChartConfig>["tooltipArea"]
	>
): Widget {
	return cartesian.toastRectTooltipArea({
		tooltip,
		anchorRect: hoveredStage,
		enabled: ctx.config.tooltip.enabled,
		mode: { variant: "heatmap" },
	});
}
