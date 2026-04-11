import type { RadarChartCustom } from "@headless/radar-chart/types";
import type { AgRadarChartConfig } from "../config";
import { Plot as BasePlot } from "../../../base/plot";

export function agPlot(
	args: Parameters<RadarChartCustom<AgRadarChartConfig>["plot"]>[0],
	context: Parameters<RadarChartCustom<AgRadarChartConfig>["plot"]>[1],
) {
	return BasePlot<AgRadarChartConfig>({
		...args,
		gap: Math.max(0, (context.config.radar.labelMargin ?? 20) / 2),
	});
}
