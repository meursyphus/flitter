import {
	Stack,
	StackFit,
	Transform,
	Alignment,
	type Widget,
} from "flitter-core";
import type { PieChartCustom } from "../../_flitter/headless/pie-chart";

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
