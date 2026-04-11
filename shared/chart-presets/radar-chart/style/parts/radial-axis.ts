import {
	FractionalTranslation,
	LayoutBuilder,
	Offset,
	Positioned,
	Stack,
	StackFit,
	type BuildContext,
	type Widget,
} from "flitter-ui";
import type { RadarChartCustom } from "flitter-ui/chart";
import type { AgRadarChartConfig } from "../config";

export function agRadialAxis(
	...[{ labels }]: Parameters<RadarChartCustom<AgRadarChartConfig>["radialAxis"]>
): Widget {
	return LayoutBuilder({
		builder: (_context: BuildContext, constraints) => {
			const width = constraints.maxWidth;
			const height = constraints.maxHeight;
			const radius = Math.min(width, height) / 2;
			const centerX = width / 2;
			const centerY = height / 2;

			return Stack({
				fit: StackFit.expand,
				children: [
					...labels.map((item) =>
						Positioned({
							left: centerX,
							top: centerY - radius * item.ratio,
							child: FractionalTranslation({
								translation: new Offset({ x: -1, y: -0.5 }),
								child: item.label,
							}),
						}),
					),
				],
			});
		},
	});
}
