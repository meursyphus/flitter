import { Opacity, type Widget } from "flitter-core";
import type { PieChartCustom } from "flitter-ui/chart";
import type { AgPieChartConfig } from "../config";
import { baseSlice } from "../../base/slice";
import { computeCalloutPosition } from "./data-label";

export function agSlice(
	...[{ index, name, startAngle, sweepAngle }, ctx]: Parameters<PieChartCustom<AgPieChartConfig>["slice"]>
): Widget {
	const { colors, pie: pieConfig, dataLabel: labelConfig } = ctx.config;
	const colorIndex = ctx.legends.indexOf(name);
	const fill = colors.fills[(colorIndex >= 0 ? colorIndex : index) % colors.fills.length];

	let opacity = 1;
	if (ctx.hoveredIndex != null) {
		opacity = ctx.isSliceHovered(index) ? 1 : 0.35;
	}

	// Build an extraHitTest that covers this slice's callout label bounding box,
	// so hovering on the callout text also triggers the slice hover.
	let extraHitTest: ((position: { x: number; y: number }, size: { width: number; height: number }) => boolean) | undefined;

	if (labelConfig.visible) {
		const subtitleFontSize = Math.max(9, Math.round(labelConfig.fontSize * 0.68));
		const hitHeight = labelConfig.fontSize + subtitleFontSize + 8;
		const hitWidth = 80;

		extraHitTest = (position, size) => {
			const pos = computeCalloutPosition(
				startAngle,
				sweepAngle,
				size.width,
				size.height,
				ctx.config,
			);
			const isRightSide = Math.cos(pos.midAngle) >= 0;
			// Extend hit region with padding around the callout text area
			const pad = 10;
			const top = Math.max(0, pos.lineY2 - hitHeight / 2 - pad);
			const totalHeight = hitHeight + pad * 2;
			const left = isRightSide
				? pos.lineX2 - pad
				: Math.max(0, pos.lineX2 - hitWidth - pad);
			const totalWidth = hitWidth + pad * 2;

			return (
				position.x >= left &&
				position.x <= left + totalWidth &&
				position.y >= top &&
				position.y <= top + totalHeight
			);
		};
	}

	const slice = baseSlice({
		index,
		startAngle,
		sweepAngle,
		innerRadiusRatio: pieConfig.innerRadiusRatio,
		ctx,
		fill,
		strokeColor: pieConfig.strokeColor,
		strokeWidth: pieConfig.strokeWidth,
		extraHitTest,
	});

	return Opacity({ opacity, child: slice });
}
