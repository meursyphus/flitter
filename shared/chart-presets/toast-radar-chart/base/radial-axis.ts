import { SizedBox, type Widget } from "flitter-ui";
import type { RadarChartCustom } from "flitter-ui/chart";

export function RadialAxis<TConfig = {}>(
	...[{ labels }]: Parameters<RadarChartCustom<TConfig>["radialAxis"]>
): Widget {
	return labels.length > 0 ? SizedBox.expand() : SizedBox.shrink();
}
