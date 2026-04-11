import type { RadarChartCustom } from "@headless/radar-chart/types";
import type { ToastRadarChartConfig } from "../config";
import { Plot as BasePlot } from "../../../base/plot";

export function toastPlot(
	args: Parameters<RadarChartCustom<ToastRadarChartConfig>["plot"]>[0],
	context: Parameters<RadarChartCustom<ToastRadarChartConfig>["plot"]>[1],
) {
	return BasePlot<ToastRadarChartConfig>({
		...args,
		gap: Math.max(0, context.config.radar.labelMargin ?? 5),
	});
}
