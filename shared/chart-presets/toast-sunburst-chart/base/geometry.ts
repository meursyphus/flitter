import type { FlatSegment } from "../types";
import { Offset, Path, Radius } from "flitter-core";

export type RingMetrics = {
	cx: number;
	cy: number;
	innerRadius: number;
	ringWidth: number;
	maxRadius: number;
};

export function getRingMetrics(
	width: number,
	height: number,
	segments: FlatSegment[],
	innerRadiusRatio = 0.18,
): RingMetrics | null {
	const maxDepth = segments.reduce((max, entry) => Math.max(max, entry.depth), 0);
	if (maxDepth <= 0 || width <= 20 || height <= 20) return null;

	const cx = width / 2;
	const cy = height / 2;
	const maxRadius = Math.min(cx, cy) - 10;
	if (maxRadius <= 0) return null;

	const innerRadius = maxRadius * innerRadiusRatio;
	const ringWidth = (maxRadius - innerRadius) / maxDepth;
	if (ringWidth <= 0) return null;

	return { cx, cy, innerRadius, ringWidth, maxRadius };
}

export function getSegmentRadii(depth: number, innerRadius: number, ringWidth: number) {
	const r1 = Math.max(innerRadius + (depth - 1) * ringWidth, 0);
	const r2 = Math.max(innerRadius + depth * ringWidth, r1 + 0.001);
	return { r1, r2 };
}

export function polarToCartesian(cx: number, cy: number, radius: number, angle: number) {
	const actualAngle = angle - Math.PI / 2;
	return {
		x: cx + radius * Math.cos(actualAngle),
		y: cy + radius * Math.sin(actualAngle),
	};
}

function polarToOffset(cx: number, cy: number, radius: number, angle: number) {
	const point = polarToCartesian(cx, cy, radius, angle);
	return new Offset({ x: point.x, y: point.y });
}

export function createArcPath(metrics: RingMetrics, segment: FlatSegment): string {
	const { cx, cy, innerRadius, ringWidth } = metrics;
	const { r1, r2 } = getSegmentRadii(segment.depth, innerRadius, ringWidth);
	const outerStart = polarToCartesian(cx, cy, r2, segment.startAngle);
	const outerEnd = polarToCartesian(cx, cy, r2, segment.endAngle);
	const innerStart = polarToCartesian(cx, cy, r1, segment.startAngle);
	const innerEnd = polarToCartesian(cx, cy, r1, segment.endAngle);
	const largeArc = segment.sweepAngle > Math.PI ? 1 : 0;

	return [
		`M ${outerStart.x} ${outerStart.y}`,
		`A ${r2} ${r2} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
		`L ${innerEnd.x} ${innerEnd.y}`,
		`A ${r1} ${r1} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
		"Z",
	].join(" ");
}

export function createArcCanvasPath(metrics: RingMetrics, segment: FlatSegment) {
	const { cx, cy, innerRadius, ringWidth } = metrics;
	const { r1, r2 } = getSegmentRadii(segment.depth, innerRadius, ringWidth);
	const path = new Path();
	path.moveTo(polarToOffset(cx, cy, r2, segment.startAngle));
	path.arcToPoint({
		endPoint: polarToOffset(cx, cy, r2, segment.endAngle),
		radius: Radius.circular(r2),
		rotation: 0,
		largeArc: segment.sweepAngle > Math.PI,
		clockwise: true,
	});
	path.lineTo(polarToOffset(cx, cy, r1, segment.endAngle));
	path.arcToPoint({
		endPoint: polarToOffset(cx, cy, r1, segment.startAngle),
		radius: Radius.circular(r1),
		rotation: 0,
		largeArc: segment.sweepAngle > Math.PI,
		clockwise: false,
	});
	path.close();
	return path.toCanvasPath();
}

export function isPointInSegment(
	position: { x: number; y: number },
	metrics: RingMetrics,
	segment: FlatSegment,
) {
	const { cx, cy, innerRadius, ringWidth } = metrics;
	const { r1, r2 } = getSegmentRadii(segment.depth, innerRadius, ringWidth);
	const dx = position.x - cx;
	const dy = position.y - cy;
	const distance = Math.sqrt(dx * dx + dy * dy);
	if (distance < r1 || distance > r2) return false;

	let angle = Math.atan2(dy, dx) + Math.PI / 2;
	if (angle < 0) angle += Math.PI * 2;
	return angle >= segment.startAngle && angle <= segment.endAngle;
}

export function getSegmentLabelMetrics(
	metrics: RingMetrics,
	segment: FlatSegment,
) {
	const { cx, cy, innerRadius, ringWidth } = metrics;
	const { r1, r2 } = getSegmentRadii(segment.depth, innerRadius, ringWidth);
	const midRadius = (r1 + r2) / 2;
	const midAngle = (segment.startAngle + segment.endAngle) / 2;
	const arcLength = segment.sweepAngle * midRadius;
	const point = polarToCartesian(cx, cy, midRadius, midAngle);

	return {
		midRadius,
		midAngle,
		arcLength,
		ringWidth,
		x: point.x,
		y: point.y,
	};
}
