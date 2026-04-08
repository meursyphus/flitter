import { Path } from "flitter-core";
import type { FunnelChartDirection } from "../types";

export function getVisualRatio(ratio: number, minSegmentRatio: number): number {
	return Math.max(0, Math.min(1, Math.max(ratio, minSegmentRatio)));
}

export function getTransitionRatios(
	ratio: number,
	nextRatio: number | null,
	minSegmentRatio: number,
): {
	current: number;
	next: number;
	currentNormalized: number;
	nextNormalized: number;
} {
	const current = getVisualRatio(ratio, minSegmentRatio);
	const next = getVisualRatio(nextRatio ?? ratio, minSegmentRatio);
	const max = Math.max(current, next, 0.0001);
	return {
		current,
		next,
		currentNormalized: current / max,
		nextNormalized: next / max,
	};
}

export function createConnectorPath({
	direction,
	width,
	height,
	currentRatio,
	nextRatio,
}: {
	direction: FunnelChartDirection;
	width: number;
	height: number;
	currentRatio: number;
	nextRatio: number;
}): Path {
	const path = new Path();

	if (direction === "horizontal") {
		const leftHeight = height * currentRatio;
		const rightHeight = height * nextRatio;
		const leftTop = (height - leftHeight) / 2;
		const rightTop = (height - rightHeight) / 2;

		path.moveTo({ x: 0, y: leftTop });
		path.lineTo({ x: width, y: rightTop });
		path.lineTo({ x: width, y: rightTop + rightHeight });
		path.lineTo({ x: 0, y: leftTop + leftHeight });
		path.close();
		return path;
	}

	const topWidth = width * currentRatio;
	const bottomWidth = width * nextRatio;
	const topLeft = (width - topWidth) / 2;
	const bottomLeft = (width - bottomWidth) / 2;

	path.moveTo({ x: topLeft, y: 0 });
	path.lineTo({ x: topLeft + topWidth, y: 0 });
	path.lineTo({ x: bottomLeft + bottomWidth, y: height });
	path.lineTo({ x: bottomLeft, y: height });
	path.close();
	return path;
}

export function hexToRgba(color: string, alpha: number): string {
	if (!color.startsWith("#")) return color;
	const hex = color.slice(1);
	const normalized =
		hex.length === 3
			? hex
					.split("")
					.map((char) => `${char}${char}`)
					.join("")
			: hex;
	const r = parseInt(normalized.slice(0, 2), 16);
	const g = parseInt(normalized.slice(2, 4), 16);
	const b = parseInt(normalized.slice(4, 6), 16);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
