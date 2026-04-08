import {
	Stack,
	StackFit,
	type Widget,
} from "flitter-core";
import type { RadarChartCustom } from "@headless/radar-chart/types";

export function DataView(
	...[{ radars }]: Parameters<RadarChartCustom["dataView"]>
): Widget {
	return Stack({
		fit: StackFit.expand,
		children: radars,
	});
}
