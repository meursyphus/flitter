import {
	Stack,
	StackFit,
	type Widget,
} from "flitter-core";
import type { PieChartCustom } from "@headless/pie-chart/types";

export function DataView(
	...[{ slices }]: Parameters<PieChartCustom["dataView"]>
): Widget {
	const sliceChildren = slices.map((pie) => pie.widget);

	return Stack({
		fit: StackFit.expand,
		clipped: false,
		children: [Stack({ fit: StackFit.expand, clipped: false, children: sliceChildren })],
	});
}
