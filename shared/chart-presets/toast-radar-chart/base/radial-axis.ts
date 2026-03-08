import {
	Stack,
	StackFit,
	type Widget,
} from "flitter-core";
import type { RadarChartCustom } from "../../_flitter/headless/radar-chart";

export function RadialAxis(
	...[{ line, labels: _labels }]: Parameters<RadarChartCustom["radialAxis"]>
): Widget {
	// Default: just render the concentric polygons.
	// Scale labels are not shown by default (toast overrides radialAxisLabel to hide them).
	return Stack({
		fit: StackFit.expand,
		children: [line],
	});
}
