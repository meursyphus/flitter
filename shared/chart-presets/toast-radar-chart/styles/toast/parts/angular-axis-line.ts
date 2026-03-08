import {
	CustomPaint,
	Path,
	Offset,
	type Widget,
} from "flitter-core";
import type { RadarChartCustom } from "flitter-ui/chart";
import type { ToastRadarChartConfig } from "../config";

export function toastAngularAxisLine(
	...[{ axisCount }, ctx]: Parameters<RadarChartCustom<ToastRadarChartConfig>["angularAxisLine"]>
): Widget {
	const { radar: radarConfig } = ctx.config;

	return CustomPaint({
		painter: {
			svg: {
				createDefaultSvgEl: (context) => ({
					axisLines: context.createSvgEl("path"),
				}),
				paint: ({ axisLines }, size) => {
					const cx = size.width / 2;
					const cy = size.height / 2;
					const maxRadius = Math.min(cx, cy);

					const axisPath = createAxisPath(cx, cy, maxRadius, axisCount);
					axisLines.setAttribute("d", axisPath.getD());
					axisLines.setAttribute("fill", "none");
					axisLines.setAttribute("stroke", radarConfig.axisColor);
					axisLines.setAttribute("stroke-width", String(radarConfig.axisWidth));
				},
			},
			canvas: {
				paint: (context, size) => {
					const cx = size.width / 2;
					const cy = size.height / 2;
					const maxRadius = Math.min(cx, cy);
					const canvas = context.canvas;

					const axisPath = createAxisPath(cx, cy, maxRadius, axisCount);
					canvas.strokeStyle = radarConfig.axisColor;
					canvas.lineWidth = radarConfig.axisWidth;
					canvas.stroke(axisPath.toCanvasPath());
				},
			},
		},
	});
}

function createAxisPath(
	cx: number,
	cy: number,
	maxRadius: number,
	axisCount: number,
): Path {
	const path = new Path();
	const angleStep = (2 * Math.PI) / axisCount;
	const startAngle = -Math.PI / 2;

	for (let i = 0; i < axisCount; i++) {
		const angle = startAngle + i * angleStep;
		const x = cx + maxRadius * Math.cos(angle);
		const y = cy + maxRadius * Math.sin(angle);
		path.moveTo(new Offset({ x: cx, y: cy }));
		path.lineTo(new Offset({ x, y }));
	}
	return path;
}
