import {
	Stack,
	StackFit,
	Center,
	AspectRatio,
	type Widget,
} from "flitter-core";
import type { RadarChartCustom } from "@headless/radar-chart/types";

export function Series(
	...[{ datasets, grid, axisLabels }]: Parameters<RadarChartCustom["series"]>
): Widget {
	return Center({
		child: AspectRatio({
			aspectRatio: 1,
			child: Stack({
				fit: StackFit.expand,
				children: [
					grid,
					...datasets.map((ds) => ds.widget),
					...axisLabels,
				],
			}),
		}),
	});
}
