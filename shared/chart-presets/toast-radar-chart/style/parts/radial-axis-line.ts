import {
	CustomPaint,
	Path,
	Offset,
	type Widget,
} from "flitter-ui";
import type { RadarChartCustom } from "flitter-ui/chart";
import type { ToastRadarChartConfig } from "../config";

export function toastRadialAxisLine(
	...[_args, ctx]: Parameters<RadarChartCustom<ToastRadarChartConfig>["radialLine"]>
): Widget {
	const { radar: radarConfig } = ctx.config;

	return CustomPaint({
		painter: {
			svg: {
				createDefaultSvgEl: (context) => ({
					gridLines: context.createSvgEl("path"),
				}),
					paint: ({ gridLines }, size) => {
						const cx = size.width / 2;
						const cy = size.height / 2;
						const gridPath = createSpokePath(cx, cy);
						gridLines.setAttribute("d", gridPath.getD());
						gridLines.setAttribute("fill", "none");
						gridLines.setAttribute("stroke", radarConfig.axisColor);
						gridLines.setAttribute("stroke-width", String(radarConfig.axisWidth));
					},
				},
				canvas: {
					paint: (context, size) => {
						const cx = size.width / 2;
						const cy = size.height / 2;
						const canvas = context.canvas;

						const gridPath = createSpokePath(cx, cy);
						canvas.strokeStyle = radarConfig.axisColor;
						canvas.lineWidth = radarConfig.axisWidth;
						canvas.stroke(gridPath.toCanvasPath());
					},
				},
		},
	});
}

function createSpokePath(
	cx: number,
	cy: number,
): Path {
	const path = new Path();
	path.moveTo(new Offset({ x: cx, y: cy }));
	path.lineTo(new Offset({ x: cx, y: 0 }));
	return path;
}
