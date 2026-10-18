/**
 * Label collision policy shared by every pie-like chart and style.
 *
 * 1. A slice smaller than `dataLabel.outsideThreshold` (percent) has no room
 *    for its data label inside the pie.
 *    - Radial labels hidden: the label moves outside and is drawn through the
 *      radial label/tick slots (the tick is the leader line).
 *    - Radial labels shown: they already own the space outside and name the
 *      slice, so the inside label is dropped instead of drawing over its
 *      neighbours.
 * 2. Labels outside the pie are stacked per side (left/right) so that
 *    neighbouring small slices never draw on top of each other.
 */

export type PieLikeDataLabelPlacementConfig = {
	radial: { visible: boolean };
	dataLabel: { visible: boolean; outsideThreshold?: number };
};

export const DEFAULT_OUTSIDE_THRESHOLD = 10;

export type PieLikeDataLabelPlacement = "inside" | "outside" | "hidden";

export function resolveDataLabelPlacement(
	percentage: number,
	config: PieLikeDataLabelPlacementConfig,
): PieLikeDataLabelPlacement {
	if (!config.dataLabel.visible) return "hidden";
	const threshold = config.dataLabel.outsideThreshold ?? DEFAULT_OUTSIDE_THRESHOLD;
	if (percentage >= threshold) return "inside";
	return config.radial.visible ? "hidden" : "outside";
}

/**
 * Rebuilds the data label formatter args from radial item args, so an outside
 * label shows exactly the text it would have shown inside its slice.
 */
export function toDataLabelArgs(args: {
	index: number;
	name: string;
	value: number;
	percentage: number;
	angle: number;
}) {
	const sweepAngle = (args.percentage / 100) * Math.PI * 2;
	return {
		index: args.index,
		name: args.name,
		value: args.value,
		percentage: args.percentage,
		startAngle: args.angle + Math.PI / 2 - sweepAngle / 2,
		sweepAngle,
	};
}

export type StackedLabel = {
	top: number;
	height: number;
};

/**
 * Pushes overlapping labels apart vertically, keeping their order, and keeps
 * them inside `[minY, maxY]` whenever they fit there. Returns the new tops.
 * Zero-height labels are left where they are and never push anything.
 */
export function stackLabels(
	labels: StackedLabel[],
	{ minY, maxY, gap }: { minY: number; maxY: number; gap: number },
): number[] {
	const tops = labels.map((label) => label.top);
	const order = labels
		.map((label, index) => ({ index, top: label.top, height: label.height }))
		.filter((label) => label.height > 0)
		.sort((a, b) => a.top - b.top || a.index - b.index);

	if (order.length < 2) return tops;

	// Downwards: each label starts below the previous one.
	let cursor = -Infinity;
	for (const label of order) {
		const top = Math.max(label.top, cursor);
		tops[label.index] = top;
		cursor = top + label.height + gap;
	}

	// Upwards: whatever ran past maxY is pulled back, pushing earlier labels up.
	cursor = maxY;
	for (let i = order.length - 1; i >= 0; i -= 1) {
		const label = order[i];
		const top = Math.min(tops[label.index], cursor - label.height);
		tops[label.index] = top;
		cursor = top - gap;
	}

	// The stack is taller than the space: start it at minY and let the bottom overflow.
	const first = order[0];
	if (tops[first.index] < minY) {
		cursor = minY;
		for (const label of order) {
			const top = Math.max(tops[label.index], cursor);
			tops[label.index] = top;
			cursor = top + label.height + gap;
		}
	}

	return tops;
}
