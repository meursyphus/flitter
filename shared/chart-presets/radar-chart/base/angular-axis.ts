import {
	Stack,
	StackFit,
	type Widget,
} from "flitter-ui";
import type { RadarChartCustom } from "flitter-ui/chart";

export function AngularAxis(
	...[{ line, labels }]: Parameters<RadarChartCustom["angularAxis"]>
): Widget {
	return Stack({
		fit: StackFit.expand,
		children: [line, ...labels],
	});
}
