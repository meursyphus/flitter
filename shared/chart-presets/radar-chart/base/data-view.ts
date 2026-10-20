import {
	Stack,
	StackFit,
	type Widget,
} from "flitterjs";
import type { RadarChartCustom } from "@flitterjs/chart";

export function DataView(
	...[{ radars }]: Parameters<RadarChartCustom["dataView"]>
): Widget {
	return Stack({
		fit: StackFit.expand,
		children: radars,
	});
}
