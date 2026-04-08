import type { Widget } from "flitter-core";
import type { FunnelChartCustom } from "@headless/funnel-chart/types";
import type { FunnelChartConfig } from "../config";
import { cartesian } from "@styles/ag";

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
