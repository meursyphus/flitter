import type { RadarVertex } from "./types";

type Point = { x: number; y: number };

export function computeRadarVertices(
	values: number[],
	labels: string[],
	maxValue: number,
): RadarVertex[] {
	const axisCount = labels.length;
	const angleStep = axisCount > 0 ? (2 * Math.PI) / axisCount : 0;
	const startAngle = -Math.PI / 2;

	return labels.map((label, i) => {
		const angle = startAngle + i * angleStep;
		const value = values[i] ?? 0;
		const ratio = maxValue > 0 ? Math.min(value / maxValue, 1) : 0;
		const nx = 0.5 + 0.5 * ratio * Math.cos(angle);
		const ny = 0.5 + 0.5 * ratio * Math.sin(angle);
		return { nx, ny, angle, ratio, value, label, index: i };
	});
}

export function radarVerticesToPoints(
	vertices: { nx: number; ny: number }[],
	width: number,
	height: number,
): Point[] {
	return vertices.map((vertex) => ({
		x: vertex.nx * width,
		y: vertex.ny * height,
	}));
}

export function getRadarAnchorPoint(
	vertices: { nx: number; ny: number }[],
	width: number,
	height: number,
): Point | null {
	const points = radarVerticesToPoints(vertices, width, height);
	if (points.length === 0) return null;

	let anchor = points[0];
	for (const point of points) {
		if (
			point.y < anchor.y ||
			(point.y === anchor.y && point.x < anchor.x)
		) {
			anchor = point;
		}
	}

	return anchor;
}

export function isPointInPolygon(
	point: Point,
	polygon: Point[],
): boolean {
	let inside = false;
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const xi = polygon[i].x;
		const yi = polygon[i].y;
		const xj = polygon[j].x;
		const yj = polygon[j].y;

		const intersects =
			yi > point.y !== yj > point.y &&
			point.x < ((xj - xi) * (point.y - yi)) / ((yj - yi) || 0.00001) + xi;

		if (intersects) inside = !inside;
	}

	return inside;
}

export function getDistanceToPolygon(
	point: Point,
	polygon: Point[],
): number {
	if (polygon.length === 0) return Infinity;

	let minDistance = Infinity;
	for (let i = 0; i < polygon.length; i += 1) {
		const start = polygon[i];
		const end = polygon[(i + 1) % polygon.length];
		minDistance = Math.min(minDistance, distanceToSegment(point, start, end));
	}

	return minDistance;
}

function distanceToSegment(point: Point, start: Point, end: Point): number {
	const dx = end.x - start.x;
	const dy = end.y - start.y;

	if (dx === 0 && dy === 0) {
		return Math.sqrt((point.x - start.x) ** 2 + (point.y - start.y) ** 2);
	}

	const t = Math.max(
		0,
		Math.min(
			1,
			((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy),
		),
	);

	const projectionX = start.x + t * dx;
	const projectionY = start.y + t * dy;

	return Math.sqrt(
		(point.x - projectionX) ** 2 + (point.y - projectionY) ** 2,
	);
}
