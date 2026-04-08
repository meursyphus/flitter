import {
	Stack,
	StackFit,
	type Widget,
} from "flitter-core";
import type { RadarChartCustom } from "flitter-ui/chart";

export function DataView(
	...[{ radars }]: Parameters<RadarChartCustom["dataView"]>
): Widget {
	return Stack({
		fit: StackFit.expand,
		children: radars,
	});
}
