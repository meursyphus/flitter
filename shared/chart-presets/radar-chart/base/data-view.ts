import {
	Stack,
	StackFit,
	Center,
	AspectRatio,
	Padding,
	EdgeInsets,
	type Widget,
} from "flitter-core";
import type { RadarChartCustom } from "flitter-ui/chart";

export function Plot(
	...[{ angularAxis, radialAxis, dataView }, context]: Parameters<RadarChartCustom["plot"]>
): Widget {
	const labelMargin = (context as any).config?.radar?.labelMargin ?? 0;

	return Center({
		child: AspectRatio({
			aspectRatio: 1,
			child: Padding({
				padding: EdgeInsets.all(labelMargin),
				child: Stack({
					fit: StackFit.expand,
					children: [
						radialAxis,
						angularAxis,
						dataView,
					],
				}),
			}),
		}),
	});
}

export function DataView(
	...[{ radars }]: Parameters<RadarChartCustom["dataView"]>
): Widget {
	return Stack({
		fit: StackFit.expand,
		children: radars,
	});
}
