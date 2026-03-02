import {
	Stack,
	StackFit,
	Center,
	AspectRatio,
	type Widget,
} from "flitter-core";
import type { RadarChartCustom } from "@headless/radar-chart/types";

export function Plot(
	...[{ angularAxis, radialAxis, series }]: Parameters<RadarChartCustom["plot"]>
): Widget {
	return Center({
		child: AspectRatio({
			aspectRatio: 1,
			child: Stack({
				fit: StackFit.expand,
				children: [
					radialAxis,
					angularAxis,
					series,
				],
			}),
		}),
	});
}

export function Series(
	...[{ radars }]: Parameters<RadarChartCustom["series"]>
): Widget {
	return Stack({
		fit: StackFit.expand,
		children: radars,
	});
}
