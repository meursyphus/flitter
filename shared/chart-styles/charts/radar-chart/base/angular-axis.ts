import {
	Stack,
	StackFit,
	type Widget,
} from "flitter-core";
import type { RadarChartCustom } from "@headless/radar-chart/types";

export function AngularAxis(
	...[{ line, labels }]: Parameters<RadarChartCustom["angularAxis"]>
): Widget {
	return Stack({
		fit: StackFit.expand,
		children: [line, ...labels],
	});
}
