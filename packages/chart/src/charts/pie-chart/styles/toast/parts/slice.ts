import {
	CustomPaint,
	Path,
	Offset,
	Radius,
	GestureDetector,
	ZIndex,
	type Widget,
	type Size,
} from "flitter-core";
import type { PieChartCustom } from "@headless/pie-chart/types";
import type { ToastPieChartConfig } from "../config";

export function toastSlice(
	...[{ index, name, value, percentage, sweepAngle }, ctx]: Parameters<PieChartCustom<ToastPieChartConfig>["slice"]>
): Widget {
	const { colors, pie: pieConfig } = ctx.config;
	const colorIndex = ctx.legends.indexOf(name);
	const color = colors[(colorIndex >= 0 ? colorIndex : index) % colors.length];
	const hovered = ctx.isSliceHovered(index);

	const paint = CustomPaint({
		painter: {
			hitTest: (position, size) =>
				isPointInSlice(position, size, pieConfig.innerRadiusRatio, sweepAngle),
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
					if (hovered) {
						slice.setAttribute("stroke", "white");
						slice.setAttribute("stroke-width", "4");
						slice.setAttribute("filter", "drop-shadow(0 0 8px rgba(0,0,0,0.3))");
					} else {
						slice.setAttribute("stroke", pieConfig.strokeColor);
						slice.setAttribute("stroke-width", String(pieConfig.strokeWidth));
						slice.removeAttribute("filter");
					}
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
					if (hovered) {
						context.canvas.save();
						context.canvas.shadowColor = "rgba(0,0,0,0.3)";
						context.canvas.shadowBlur = 8;
						context.canvas.strokeStyle = "white";
						context.canvas.lineWidth = 4;
						context.canvas.stroke(canvasPath);
						context.canvas.restore();
					} else {
						context.canvas.strokeStyle = pieConfig.strokeColor;
						context.canvas.lineWidth = pieConfig.strokeWidth;
						context.canvas.stroke(canvasPath);
					}
				},
			},
		},
	});

	const detector = GestureDetector({
		behavior: "deferToChild",
		cursor: "default",
		child: paint,
		onMouseEnter: () => ctx.hoverSlice(index),
		onMouseLeave: () => {
			if (ctx.hoveredIndex === index) ctx.unhoverSlice();
		},
	});

	return ZIndex({
		zIndex: hovered ? 9999 : 0,
		child: detector,
	});
}

function isPointInSlice(
	position: { x: number; y: number },
	size: Size,
	innerRadiusRatio: number,
	sweepAngle: number,
): boolean {
	const cx = size.width / 2;
	const cy = size.height / 2;
	const dx = position.x - cx;
	const dy = position.y - cy;
	const distance = Math.sqrt(dx * dx + dy * dy);

	const outerRadius = Math.min(cx, cy);
	const innerRadius = outerRadius * innerRadiusRatio;

	if (distance < innerRadius || distance > outerRadius) return false;

	// slice는 -π/2(12시)에서 시작, sweepAngle만큼 시계방향
	// atan2는 양의 x축 기준, 반시계 양수
	let angle = Math.atan2(dy, dx);
	let relativeAngle = angle - (-Math.PI / 2);
	if (relativeAngle < 0) relativeAngle += 2 * Math.PI;

	return relativeAngle <= sweepAngle;
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
