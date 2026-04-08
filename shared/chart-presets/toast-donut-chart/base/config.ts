import type { DonutChartSegmentArgs } from "flitter-ui/chart";

export type DonutDataCenterMode = "total" | "hovered" | "hovered-or-total";

export type DonutDataCenterFormatterArgs = {
	total: number;
	hoveredSegment: DonutChartSegmentArgs | null;
	mode: DonutDataCenterMode;
};

export type DonutDataCenterFormatterResult = {
	label?: string;
	value: string;
};

export function clampRatio(value: number, fallback: number): number {
	const next = Number.isFinite(value) ? value : fallback;
	return Math.max(0.05, Math.min(0.95, next));
}

export function resolveInnerRadiusRatioFromThicknessRatio(
	thicknessRatio: number,
): number {
	return 1 - clampRatio(thicknessRatio, 0.4);
}
