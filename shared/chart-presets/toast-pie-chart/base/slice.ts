import {
	CustomPaint,
	GestureDetector,
	Offset,
	Path,
	Radius,
	type Size,
	type Widget,
} from "flitter-core";
import type { PieChartContext } from "flitter-ui/chart";

// ─── Geometry utilities ───

export function createSlicePath(
	cx: number,
	cy: number,
	outerRadius: number,
	innerRadius: number,
	sweepAngle: number,
	rotationOffset: number = 0,
): Path {
	const path = new Path();
	const startAngle = -Math.PI / 2 + rotationOffset;
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

export function isPointInSlice(
	position: { x: number; y: number },
	size: Size,
	innerRadiusRatio: number,
	sweepAngle: number,
	rotationOffset: number = 0,
): boolean {
	const cx = size.width / 2;
	const cy = size.height / 2;
	const dx = position.x - cx;
	const dy = position.y - cy;
	const distance = Math.sqrt(dx * dx + dy * dy);

	const outerRadius = Math.min(cx, cy);
	const innerRadius = outerRadius * innerRadiusRatio;

	if (distance < innerRadius || distance > outerRadius) return false;

	const angle = Math.atan2(dy, dx);
	const sliceStart = -Math.PI / 2 + rotationOffset;
	let relativeAngle = ((angle - sliceStart) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);

	return relativeAngle <= sweepAngle;
}

// ─── Base slice widget ───

export function baseSlice({
	index,
	startAngle,
	sweepAngle,
	innerRadiusRatio,
	ctx,
	fill,
	strokeColor,
	strokeWidth,
	svgFilter,
	extraHitTest,
}: {
	index: number;
	startAngle: number;
	sweepAngle: number;
	innerRadiusRatio: number;
	ctx: PieChartContext<any>;
	fill: string;
	strokeColor: string;
	strokeWidth: number;
	svgFilter?: string;
	/** Optional additional hit test (e.g. for callout label regions). */
	extraHitTest?: (position: { x: number; y: number }, size: Size) => boolean;
}): Widget {
	const paint = CustomPaint({
		painter: {
			hitTest: (position, size) =>
				isPointInSlice(position, size, innerRadiusRatio, sweepAngle, startAngle)
				|| (extraHitTest != null && extraHitTest(position, size)),
			svg: {
				createDefaultSvgEl: (context) => ({
					slice: context.createSvgEl("path"),
				}),
				paint: ({ slice }, size) => {
					const cx = size.width / 2;
					const cy = size.height / 2;
					const radius = Math.min(cx, cy);
					const innerRadius = radius * innerRadiusRatio;
					const path = createSlicePath(cx, cy, radius, innerRadius, sweepAngle, startAngle);
					slice.setAttribute("d", path.getD());
					slice.setAttribute("fill", fill);
					slice.setAttribute("stroke", strokeColor);
					slice.setAttribute("stroke-width", String(strokeWidth));
					if (svgFilter) {
						slice.setAttribute("filter", svgFilter);
					} else {
						slice.removeAttribute("filter");
					}
				},
			},
			canvas: {
				paint: (context, size) => {
					const cx = size.width / 2;
					const cy = size.height / 2;
					const radius = Math.min(cx, cy);
					const innerRadius = radius * innerRadiusRatio;
					const path = createSlicePath(cx, cy, radius, innerRadius, sweepAngle, startAngle);
					const canvasPath = path.toCanvasPath();
					context.canvas.fillStyle = fill;
					context.canvas.fill(canvasPath);
					if (svgFilter) {
						context.canvas.save();
						context.canvas.shadowColor = "rgba(0,0,0,0.3)";
						context.canvas.shadowBlur = 8;
					}
					context.canvas.strokeStyle = strokeColor;
					context.canvas.lineWidth = strokeWidth;
					context.canvas.stroke(canvasPath);
					if (svgFilter) {
						context.canvas.restore();
					}
				},
			},
		},
	});

	return GestureDetector({
		behavior: "deferToChild",
		cursor: "default",
		child: paint,
		onMouseEnter: () => ctx.hoverSlice(index),
		onMouseLeave: () => {
			if (ctx.hoveredIndex === index) ctx.unhoverSlice();
		},
	});
}
