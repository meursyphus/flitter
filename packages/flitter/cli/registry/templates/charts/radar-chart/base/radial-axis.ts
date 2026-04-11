import { SizedBox, type Widget } from "flitter-core";
import type { RadarChartCustom } from "@headless/radar-chart/types";

export function RadialAxis<TConfig extends object = object>(
	...[{ labels }]: Parameters<RadarChartCustom<TConfig>["radialAxis"]>
): Widget {
	return labels.length > 0 ? SizedBox.expand() : SizedBox.shrink();
}
