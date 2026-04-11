import type { RadarChartCustom } from "flitter-ui/chart";
import type { AgRadarChartConfig } from "../config";
import { cartesian } from "../../../_shared/ag/index";

export function agTooltipArea(
	...[{ hoveredRadar }, ctx]: Parameters<RadarChartCustom<AgRadarChartConfig>["tooltipArea"]>
) {
	let tooltip = null;

	if (hoveredRadar != null) {
		const dataset = ctx.data.datasets[hoveredRadar.index];
		if (dataset != null && dataset.legend === hoveredRadar.legend) {
			const legendIndex = ctx.legends.indexOf(hoveredRadar.legend);
			const color = ctx.config.colors.fills[
				(legendIndex >= 0 ? legendIndex : hoveredRadar.index) % ctx.config.colors.fills.length
			];

			tooltip = ctx.custom.tooltip(
				{
					label: hoveredRadar.legend,
					items: dataset.values.map((value, pointIndex) => ({
						legend: ctx.data.labels[pointIndex] ?? "",
						color,
						value,
					})),
				},
				ctx,
			);
		}
	}

	return cartesian.agMouseTooltipArea({
		tooltip,
		enabled: ctx.config.tooltip.enabled,
	});
}
