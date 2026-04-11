import {
	Alignment,
	Container,
	FractionallySizedBox,
	Stack,
	StackFit,
	Transform,
	type Widget,
} from "flitter-ui";
import type { RadarChartCustom } from "flitter-ui/chart";

export function Web(
	...[{ angularLines, radialLines }]: Parameters<RadarChartCustom["web"]>
): Widget {
	return Stack({
		fit: StackFit.expand,
		children: [
			...angularLines.map(({ ratio, line }) =>
				CenterGuide({
					ratio,
					child: line,
				}),
			),
			...radialLines.map(({ angle, line }) =>
				Transform.rotate({
					angle: angle + Math.PI / 2,
					alignment: Alignment.center,
					child: Container({
						width: Infinity,
						height: Infinity,
						child: line,
					}),
				}),
			),
		],
	});
}

function CenterGuide({ ratio, child }: { ratio: number; child: Widget }): Widget {
	return FractionallySizedBox({
		alignment: Alignment.center,
		widthFactor: ratio,
		heightFactor: ratio,
		child,
	});
}
