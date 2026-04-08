export type PieLikeDatum = {
	name: string;
	value: number;
};

export type PieLikeData = {
	datasets: PieLikeDatum[];
};

export type PieLikeSegmentMeta = {
	index: number;
	name: string;
	value: number;
	percentage: number;
	startAngle: number;
	sweepAngle: number;
	angle: number;
};

export type HoveredPieLikeSegmentMeta = PieLikeSegmentMeta & {
	midAngle: number;
	anchorX: number;
	anchorY: number;
	directionX: number;
	directionY: number;
};

export function buildPieLikeSegmentMeta(data: PieLikeData): PieLikeSegmentMeta[] {
	const total = data.datasets.reduce((sum, dataset) => sum + dataset.value, 0);
	let currentAngle = 0;

	return data.datasets.map((dataset, index) => {
		const percentage = total > 0 ? (dataset.value / total) * 100 : 0;
		const sweepAngle = total > 0 ? (dataset.value / total) * Math.PI * 2 : 0;
		const startAngle = currentAngle;
		const angle = -Math.PI / 2 + startAngle + sweepAngle / 2;
		currentAngle += sweepAngle;

		return {
			index,
			name: dataset.name,
			value: dataset.value,
			percentage,
			startAngle,
			sweepAngle,
			angle,
		};
	});
}

export function resolveHoveredPieLikeSegment(
	segments: PieLikeSegmentMeta[],
	hoveredIndex: number | null,
): PieLikeSegmentMeta | null {
	if (hoveredIndex == null || hoveredIndex < 0 || hoveredIndex >= segments.length) {
		return null;
	}

	return segments[hoveredIndex] ?? null;
}

export function resolveHoveredPieLikeSegmentAnchor({
	segments,
	hoveredIndex,
	width,
	height,
	innerRadiusRatio = 0,
}: {
	segments: PieLikeSegmentMeta[];
	hoveredIndex: number | null;
	width: number;
	height: number;
	innerRadiusRatio?: number;
}): HoveredPieLikeSegmentMeta | null {
	const segment = resolveHoveredPieLikeSegment(segments, hoveredIndex);
	if (segment == null) return null;
	if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
		return null;
	}

	const outerRadius = Math.min(width, height) / 2;
	const innerRadius = outerRadius * innerRadiusRatio;
	const anchorRadius = innerRadius + (outerRadius - innerRadius) * 0.5;
	const midAngle = segment.angle;
	const directionX = Math.cos(midAngle);
	const directionY = Math.sin(midAngle);

	return {
		...segment,
		midAngle,
		anchorX: width / 2 + anchorRadius * directionX,
		anchorY: height / 2 + anchorRadius * directionY,
		directionX,
		directionY,
	};
}
