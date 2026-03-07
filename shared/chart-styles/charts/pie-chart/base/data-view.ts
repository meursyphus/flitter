import {
	Stack,
	StackFit,
	Transform,
	Alignment,
	type Widget,
} from "flitter-core";
import type { PieChartCustom } from "@headless/pie-chart/types";

export function DataView(
	...[{ slices }]: Parameters<PieChartCustom["dataView"]>
): Widget {
	const children = slices.map((pie) =>
		Transform.rotate({
			angle: pie.startAngle,
			alignment: Alignment.center,
			child: pie.widget,
		}),
	);

	return Stack({
		fit: StackFit.expand,
		children,
	});
}
