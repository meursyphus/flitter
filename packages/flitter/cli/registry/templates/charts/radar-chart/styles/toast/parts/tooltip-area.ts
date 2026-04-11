import type { RadarChartCustom } from "@headless/radar-chart/types";
import type { ToastRadarChartConfig } from "../config";
import { cartesian } from "@styles/toast";

export function toastTooltipArea(
	...[{ hoveredPoint }, ctx]: Parameters<RadarChartCustom<ToastRadarChartConfig>["tooltipArea"]>
) {
	if (hoveredPoint == null || !ctx.config.tooltip.enabled) {
		return cartesian.toastPointTooltipArea({
			tooltip: null,
			anchorPoint: null,
			enabled: false,
			dotColor: "#000000",
		});
	}

	const vertex = ctx.getRadarPoint(
		hoveredPoint.index,
		hoveredPoint.legend,
		hoveredPoint.pointIndex,
	);
	const anchorPoint = ctx.getRadarPointPosition(
		hoveredPoint.index,
		hoveredPoint.legend,
		hoveredPoint.pointIndex,
	);
	if (vertex == null || anchorPoint == null) {
		return cartesian.toastPointTooltipArea({
			tooltip: null,
			anchorPoint: null,
			enabled: false,
			dotColor: "#000000",
		});
	}

	const legendIndex = ctx.legends.indexOf(hoveredPoint.legend);
	const color = ctx.config.colors[
		(legendIndex >= 0 ? legendIndex : hoveredPoint.index) % ctx.config.colors.length
	];
	const tooltip = ctx.custom.tooltip(
		{
			label: vertex.label,
			items: [{ legend: hoveredPoint.legend, color, value: vertex.value }],
		},
		ctx,
	);

	return cartesian.toastPointTooltipArea({
		tooltip,
		anchorPoint,
		enabled: true,
		dotColor: color,
	});
}
