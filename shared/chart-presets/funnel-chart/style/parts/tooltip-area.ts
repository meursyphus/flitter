import type { Widget } from "flitter-core";
import type { FunnelChartCustom } from "flitter-ui/chart";
import type { FunnelChartConfig } from "../config";
import { cartesian } from "../../../_styles/ag/index";

export function agTooltipArea(
	...[{ tooltip }, ctx]: Parameters<
		FunnelChartCustom<FunnelChartConfig>["tooltipArea"]
	>
): Widget {
	return cartesian.agMouseTooltipArea({
		tooltip,
		enabled: ctx.config.tooltip.enabled,
	});
}
