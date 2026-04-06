import {
	CustomPaint,
	Offset,
	Path,
	Rect,
	Radius,
	type Size,
	type Widget,
} from "flitter-core";
import type { PieChartContext } from "flitter-ui/chart";

const FULL_SWEEP_EPSILON = 0.0001;

function resolveAnglePadding(
	outerRadius: number,
	sweepAngle: number,
	padding: number,
): number {
	if (padding <= 0 || outerRadius <= 0) return 0;
	return Math.min(
		Math.max(0, sweepAngle / 2 - FULL_SWEEP_EPSILON),
		padding / (2 * outerRadius),
	);
}

function resolveTipRadius(
	outerRadius: number,
	sweepAngle: number,
	padding: number,
): number {
	if (padding <= 0 || outerRadius <= 0 || sweepAngle <= FULL_SWEEP_EPSILON) return 0;
	const halfSweep = sweepAngle / 2;
	const sinHalfSweep = Math.sin(halfSweep);
	if (sinHalfSweep <= FULL_SWEEP_EPSILON) return 0;
	return Math.min(outerRadius - FULL_SWEEP_EPSILON, padding / (2 * sinHalfSweep));
}

// ─── Geometry utilities ───

export function createSlicePath(
	cx: number,
	cy: number,
	outerRadius: number,
	innerRadius: number,
	sweepAngle: number,
	rotationOffset: number = 0,
	padding: number = 0,
): Path {
	const path = new Path();
	const isFullSweep = sweepAngle >= Math.PI * 2 - FULL_SWEEP_EPSILON;
	const anglePadding = isFullSweep ? 0 : resolveAnglePadding(outerRadius, sweepAngle, padding);
	const startAngle = -Math.PI / 2 + rotationOffset + anglePadding;
	const adjustedSweep = isFullSweep ? sweepAngle : Math.max(0, sweepAngle - anglePadding * 2);
	const endAngle = startAngle + adjustedSweep;
	const tipRadius = innerRadius > 0 || isFullSweep
		? innerRadius
		: resolveTipRadius(outerRadius, adjustedSweep, padding);
	const midAngle = startAngle + adjustedSweep / 2;

	const outerStart = new Offset({
		x: cx + outerRadius * Math.cos(startAngle),
		y: cy + outerRadius * Math.sin(startAngle),
	});
	const outerEnd = new Offset({
		x: cx + outerRadius * Math.cos(endAngle),
		y: cy + outerRadius * Math.sin(endAngle),
	});
	const tipPoint = new Offset({
		x: cx + tipRadius * Math.cos(midAngle),
		y: cy + tipRadius * Math.sin(midAngle),
	});

	if (isFullSweep) {
		const center = new Offset({ x: cx, y: cy });
		path.addOval(Rect.fromCircle({ center, radius: outerRadius }));

		if (innerRadius > 0) {
			const innerLeft = new Offset({ x: cx - innerRadius, y: cy });
			const innerRight = new Offset({ x: cx + innerRadius, y: cy });
			path.moveTo(innerLeft);
			path.arcToPoint({
				endPoint: innerRight,
				radius: Radius.circular(innerRadius),
				rotation: 0,
				largeArc: false,
				clockwise: false,
			});
			path.arcToPoint({
				endPoint: innerLeft,
				radius: Radius.circular(innerRadius),
				rotation: 0,
				largeArc: false,
				clockwise: false,
			});
			path.close();
		}

		return path;
	}

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
			largeArc: adjustedSweep > Math.PI,
			clockwise: true,
		});
		path.lineTo(innerEnd);
		path.arcToPoint({
			endPoint: innerStart,
			radius: Radius.circular(innerRadius),
			rotation: 0,
			largeArc: adjustedSweep > Math.PI,
			clockwise: false,
		});
		path.close();
	} else {
		path.moveTo(tipPoint);
		path.lineTo(outerStart);
		path.arcToPoint({
			endPoint: outerEnd,
			radius: Radius.circular(outerRadius),
			rotation: 0,
			largeArc: adjustedSweep > Math.PI,
			clockwise: true,
		});
		path.lineTo(tipPoint);
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
	padding: number = 0,
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
	const isFullSweep = sweepAngle >= Math.PI * 2 - FULL_SWEEP_EPSILON;
	const anglePadding = isFullSweep ? 0 : resolveAnglePadding(outerRadius, sweepAngle, padding);
	const adjustedSweep = isFullSweep ? sweepAngle : Math.max(0, sweepAngle - anglePadding * 2);
	const effectiveInnerRadius = innerRadius > 0 || isFullSweep
		? innerRadius
		: resolveTipRadius(outerRadius, adjustedSweep, padding);
	if (distance < effectiveInnerRadius) return false;
	const sliceStart = -Math.PI / 2 + rotationOffset + anglePadding;
	let relativeAngle = ((angle - sliceStart) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);

	return relativeAngle <= adjustedSweep;
}

// ─── Base slice widget ───

export function Slice({
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
	padding = 0,
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
	padding?: number;
}): Widget {
	const paint = CustomPaint({
		painter: {
			hitTest: (position, size) =>
				isPointInSlice(position, size, innerRadiusRatio, sweepAngle, startAngle, padding)
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
					const path = createSlicePath(cx, cy, radius, innerRadius, sweepAngle, startAngle, padding);
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
					const path = createSlicePath(cx, cy, radius, innerRadius, sweepAngle, startAngle, padding);
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

	return paint;
}
