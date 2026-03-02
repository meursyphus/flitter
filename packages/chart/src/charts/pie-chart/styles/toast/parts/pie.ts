import {
	CustomPaint,
	Path,
	Offset,
	Radius,
	type Widget,
} from "flitter-core";
import type { PieChartCustom } from "@headless/pie-chart/types";
import type { ToastPieChartConfig } from "../config";

export function toastPie(
	...[{ index, name, value, percentage, sweepAngle }, ctx]: Parameters<PieChartCustom<ToastPieChartConfig>["pie"]>
): Widget {
	const { colors, pie: pieConfig } = ctx.config;
	const color = colors[index % colors.length];

	return CustomPaint({
		painter: {
			svg: {
				createDefaultSvgEl: (context) => ({
					slice: context.createSvgEl("path"),
				}),
				paint: ({ slice }, size) => {
					const cx = size.width / 2;
					const cy = size.height / 2;
					const radius = Math.min(cx, cy);
					const innerRadius = radius * pieConfig.innerRadiusRatio;
					const path = createSlicePath(cx, cy, radius, innerRadius, sweepAngle);
					slice.setAttribute("d", path.getD());
					slice.setAttribute("fill", color);
					slice.setAttribute("stroke", pieConfig.strokeColor);
					slice.setAttribute("stroke-width", String(pieConfig.strokeWidth));
				},
			},
			canvas: {
				paint: (context, size) => {
					const cx = size.width / 2;
					const cy = size.height / 2;
					const radius = Math.min(cx, cy);
					const innerRadius = radius * pieConfig.innerRadiusRatio;
					const path = createSlicePath(cx, cy, radius, innerRadius, sweepAngle);
					const canvasPath = path.toCanvasPath();
					context.canvas.fillStyle = color;
					context.canvas.fill(canvasPath);
					context.canvas.strokeStyle = pieConfig.strokeColor;
					context.canvas.lineWidth = pieConfig.strokeWidth;
					context.canvas.stroke(canvasPath);
				},
			},
		},
	});
}

function createSlicePath(
	cx: number,
	cy: number,
	outerRadius: number,
	innerRadius: number,
	sweepAngle: number,
): Path {
	const path = new Path();

	// 12시 방향(위)부터 시작, 시계방향
	const startAngle = -Math.PI / 2;
	const endAngle = startAngle + sweepAngle;

	const outerStart = new Offset({
		x: cx + outerRadius * Math.cos(startAngle),
		y: cy + outerRadius * Math.sin(startAngle),
	});
	const outerEnd = new Offset({
		x: cx + outerRadius * Math.cos(endAngle),
		y: cy + outerRadius * Math.sin(endAngle),
	});

	if (innerRadius > 0) {
		// Donut shape
		const innerStart = new Offset({
			x: cx + innerRadius * Math.cos(startAngle),
			y: cy + innerRadius * Math.sin(startAngle),
		});
		const innerEnd = new Offset({
			x: cx + innerRadius * Math.cos(endAngle),
			y: cy + innerRadius * Math.sin(endAngle),
		});

		path.moveTo(outerStart);
		path.arcToPoint({
			endPoint: outerEnd,
			radius: Radius.circular(outerRadius),
			rotation: 0,
			largeArc: sweepAngle > Math.PI,
			clockwise: true,
		});
		path.lineTo(innerEnd);
		path.arcToPoint({
			endPoint: innerStart,
			radius: Radius.circular(innerRadius),
			rotation: 0,
			largeArc: sweepAngle > Math.PI,
			clockwise: false,
		});
		path.close();
	} else {
		// Full pie slice
		path.moveTo(new Offset({ x: cx, y: cy }));
		path.lineTo(outerStart);
		path.arcToPoint({
			endPoint: outerEnd,
			radius: Radius.circular(outerRadius),
			rotation: 0,
			largeArc: sweepAngle > Math.PI,
			clockwise: true,
		});
		path.close();
	}

	return path;
}
