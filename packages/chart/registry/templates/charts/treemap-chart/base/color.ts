import { interpolateColor } from "@utils/color";

export function resolveTreemapNodeColor(baseColor: string, ratio: number): string {
	const t = Math.max(0, Math.min(1, Math.sqrt(ratio)));
	const dark = interpolateColor(baseColor, "#111111", 0.22);
	return interpolateColor(dark, baseColor, t);
}
