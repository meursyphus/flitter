import {
	Stack,
	StackFit,
	Center,
	AspectRatio,
	type Widget,
} from "flitter-core";
import type { RadarChartCustom } from "../../_flitter/headless/radar-chart";

export function Plot(
	...[{ angularAxis, radialAxis, dataView }]: Parameters<RadarChartCustom["plot"]>
): Widget {
	return Center({
		child: AspectRatio({
			aspectRatio: 1,
			child: Stack({
				fit: StackFit.expand,
				children: [
					radialAxis,
					angularAxis,
					dataView,
				],
			}),
		}),
	});
}

export function DataView(
	...[{ radars }]: Parameters<RadarChartCustom["dataView"]>
): Widget {
	return Stack({
		fit: StackFit.expand,
		children: radars,
	});
}
