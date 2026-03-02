import {
	Stack,
	StackFit,
	Transform,
	Alignment,
	type Widget,
} from "flitter-core";
import type { PieChartCustom } from "@headless/pie-chart/types";

export function Series(
	...[{ pies }]: Parameters<PieChartCustom["series"]>
): Widget {
	const children = pies.map((pie) =>
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
