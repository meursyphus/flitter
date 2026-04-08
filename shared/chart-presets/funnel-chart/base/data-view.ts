import {
	Positioned,
	SizedBox,
	Stack,
	StackFit,
	type Widget,
} from "flitter-core";
import type { FunnelChartCustom } from "../types";

export function DataView(
	...[{ stages }]: Parameters<FunnelChartCustom["dataView"]>
): Widget {
	if (stages.length === 0) return SizedBox.shrink();

	return Stack({
		fit: StackFit.expand,
		children: stages.map((stage) =>
			Positioned.fill({
				child: stage,
			}),
		),
	});
}
