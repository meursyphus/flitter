import {
	Column,
	ConstraintsTransformBox,
	CrossAxisAlignment,
	CustomPaint,
	FractionalTranslation,
	LayoutBuilder,
	MainAxisSize,
	Offset,
	Positioned,
	SizedBox,
	Stack,
	StackFit,
	Text,
	TextAlign,
	TextStyle,
	type Widget,
} from "flitter-core";
import type { PieChartCustom } from "flitter-ui/chart";
import type { AgPieChartConfig } from "../config";

/**
 * Computes the callout endpoint position for a slice.
 * Exported so the data-view overlay can place hover hit regions at the same coordinates.
 */
export function computeCalloutPosition(
	startAngle: number,
	sweepAngle: number,
	width: number,
	height: number,
	config: AgPieChartConfig,
): { lineX2: number; lineY2: number; midAngle: number } {
	const { dataLabel: labelConfig, pie: pieConfig } = config;
	const midAngle = -Math.PI / 2 + startAngle + sweepAngle / 2;
	const cxPx = width / 2;
	const cyPx = height / 2;
	const outerRadius = Math.min(cxPx, cyPx);
	const lineEndRadius = outerRadius + labelConfig.offset;
	const labelMargin = labelConfig.fontSize + 4;

	let lineX2 = cxPx + lineEndRadius * Math.cos(midAngle);
	let lineY2 = cyPx + lineEndRadius * Math.sin(midAngle);

	lineX2 = Math.max(labelMargin, Math.min(width - labelMargin, lineX2));
	lineY2 = Math.max(labelMargin, Math.min(height - labelMargin, lineY2));

	return { lineX2, lineY2, midAngle };
}

export function agDataLabel(
	...[args, ctx]: Parameters<
		PieChartCustom<AgPieChartConfig>["dataLabel"]
	>
): Widget {
	const { dataLabel: labelConfig, pie: pieConfig, font } = ctx.config;
	const { index, name, value, startAngle, sweepAngle, percentage } = args;

	if (!labelConfig.visible) return SizedBox.shrink();

	const valueText = labelConfig.formatter(args);
	const sectorText = `${percentage.toFixed(1)}%`;

	const midAngle = -Math.PI / 2 + startAngle + sweepAngle / 2;

	return LayoutBuilder({
		builder: (_buildCtx, constraints) => {
			const width = constraints.maxWidth;
			const height = constraints.maxHeight;
			if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
				return SizedBox.shrink();
			}

			const cxPx = width / 2;
			const cyPx = height / 2;
			const outerRadius = Math.min(cxPx, cyPx);
			const innerRadius = outerRadius * pieConfig.innerRadiusRatio;

			const children: Widget[] = [];

			// --- Inside sector label (white percentage) ---
			const sectorRadiusRatio = 0.65;
			const effectiveSectorRadius = innerRadius > 0
				? innerRadius + (outerRadius - innerRadius) * sectorRadiusRatio
				: outerRadius * sectorRadiusRatio;
			const sectorX = cxPx + effectiveSectorRadius * Math.cos(midAngle);
			const sectorY = cyPx + effectiveSectorRadius * Math.sin(midAngle);

			children.push(
				Positioned({
					left: sectorX,
					top: sectorY,
					child: ConstraintsTransformBox({
						constraintsTransform: ConstraintsTransformBox.unconstrained,
						child: FractionalTranslation({
							translation: new Offset({ x: -0.5, y: -0.5 }),
							child: Text(sectorText, {
								textAlign: TextAlign.center,
								style: new TextStyle({
									fontFamily: font.family,
									fontSize: 12,
									fontWeight: "bold",
									color: "white",
								}),
							}),
						}),
					}),
				}),
			);

			// --- Outside callout label ---
			const pos = computeCalloutPosition(startAngle, sweepAngle, width, height, ctx.config);
			const { lineX2, lineY2 } = pos;

			const lineStartRadius = outerRadius * 1.02;
			const lineX1 = cxPx + lineStartRadius * Math.cos(midAngle);
			const lineY1 = cyPx + lineStartRadius * Math.sin(midAngle);

			// Callout line
			children.push(
				CustomPaint({
					painter: {
						hitTest: () => false,
						svg: {
							createDefaultSvgEl: (context) => ({
								line: context.createSvgEl("line"),
							}),
							paint: ({ line }) => {
								line.setAttribute("x1", String(lineX1));
								line.setAttribute("y1", String(lineY1));
								line.setAttribute("x2", String(lineX2));
								line.setAttribute("y2", String(lineY2));
								line.setAttribute("stroke", labelConfig.lineColor);
								line.setAttribute("stroke-width", String(labelConfig.lineWidth));
							},
						},
						canvas: {
							paint: (context) => {
								context.canvas.beginPath();
								context.canvas.moveTo(lineX1, lineY1);
								context.canvas.lineTo(lineX2, lineY2);
								context.canvas.strokeStyle = labelConfig.lineColor;
								context.canvas.lineWidth = labelConfig.lineWidth;
								context.canvas.stroke();
							},
						},
					},
				}),
			);

			// --- Callout text (visual only, no GestureDetector) ---
			const isRightSide = Math.cos(midAngle) >= 0;
			const subtitleFontSize = Math.max(9, Math.round(labelConfig.fontSize * 0.68));
			const estimatedTextHeight = labelConfig.fontSize + subtitleFontSize + 4;
			const textTop = Math.max(0, lineY2 - estimatedTextHeight / 2);

			const calloutContent = Column({
				mainAxisSize: MainAxisSize.min,
				crossAxisAlignment: isRightSide
					? CrossAxisAlignment.start
					: CrossAxisAlignment.end,
				children: [
					Text(valueText, {
						textAlign: isRightSide ? TextAlign.left : TextAlign.right,
						style: new TextStyle({
							fontFamily: labelConfig.fontFamily ?? font.family,
							fontSize: labelConfig.fontSize,
							fontWeight: "bold",
							color: labelConfig.fontColor,
						}),
					}),
					Text(name, {
						textAlign: isRightSide ? TextAlign.left : TextAlign.right,
						style: new TextStyle({
							fontFamily: labelConfig.fontFamily ?? font.family,
							fontSize: subtitleFontSize,
							color: "#666666",
						}),
					}),
				],
			});

			const positioned = isRightSide
				? Positioned({ left: lineX2, top: textTop, child: calloutContent })
				: Positioned({ right: width - lineX2, top: textTop, child: calloutContent });

			children.push(positioned);

			return Stack({
				fit: StackFit.expand,
				clipped: false,
				children,
			});
		},
	});
}
