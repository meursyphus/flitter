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
import type { PieChartCustom } from "flitter-ui/chart";
import type { AgPieChartConfig } from "../config";

export function agDataLabel(
	...[args, ctx]: Parameters<PieChartCustom<AgPieChartConfig>["dataLabel"]>
): Widget {
	const { dataLabel: labelConfig, pie: pieConfig, font } = ctx.config;
	const { startAngle, sweepAngle } = args;

	if (!labelConfig.visible) return SizedBox.shrink();

	const text = labelConfig.formatter(args);
	const angle = -Math.PI / 2 + startAngle + sweepAngle / 2;

	return LayoutBuilder({
		builder: (_buildCtx, constraints) => {
			const width = constraints.maxWidth;
			const height = constraints.maxHeight;
			if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
				return SizedBox.shrink();
			}

			const cx = width / 2;
			const cy = height / 2;
			const outerRadius = Math.min(cx, cy);
			const innerRadius = outerRadius * pieConfig.innerRadiusRatio;
			const effectiveRadius = innerRadius > 0
				? innerRadius + (outerRadius - innerRadius) * labelConfig.radiusRatio
				: outerRadius * labelConfig.radiusRatio;
			const labelX = cx + effectiveRadius * Math.cos(angle);
			const labelY = cy + effectiveRadius * Math.sin(angle);

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
