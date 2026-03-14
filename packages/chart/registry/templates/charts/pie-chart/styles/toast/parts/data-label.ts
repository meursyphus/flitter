import {
	ConstraintsTransformBox,
	FractionalTranslation,
	LayoutBuilder,
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
import type { PieChartCustom } from "@headless/pie-chart/types";
import type { ToastPieChartConfig } from "../config";

export function toastDataLabel(
	...[args, ctx]: Parameters<
		PieChartCustom<ToastPieChartConfig>["dataLabel"]
	>
): Widget {
	const { dataLabel: labelConfig, pie: pieConfig, font } = ctx.config;
	const { startAngle, sweepAngle } = args;

	if (!labelConfig.visible) return SizedBox.shrink();

	const text = labelConfig.formatter(args);

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

			// For donut charts, position between inner and outer radius
			const effectiveRadius = innerRadius > 0
				? innerRadius + (outerRadius - innerRadius) * labelConfig.radiusRatio
				: outerRadius * labelConfig.radiusRatio;

			const labelX = cxPx + effectiveRadius * Math.cos(midAngle);
			const labelY = cyPx + effectiveRadius * Math.sin(midAngle);

			return Stack({
				fit: StackFit.expand,
				children: [
					Positioned({
						left: labelX,
						top: labelY,
						child: ConstraintsTransformBox({
							constraintsTransform: ConstraintsTransformBox.unconstrained,
							child: FractionalTranslation({
								translation: new Offset({ x: -0.5, y: -0.5 }),
								child: Text(text, {
									textAlign: TextAlign.center,
									style: new TextStyle({
										fontFamily: labelConfig.fontFamily ?? font.family,
										fontSize: labelConfig.fontSize,
										fontWeight: labelConfig.fontWeight,
										color: labelConfig.fontColor,
									}),
								}),
							}),
						}),
					}),
				],
			});
		},
	});
}
