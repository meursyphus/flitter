import {
	CustomPaint,
	Opacity,
	Stack,
	StackFit,
	type Widget,
} from "flitter-core";
import type { SunburstChartCustom } from "flitter-ui/chart";
import type { SunburstChartConfig } from "../config";
import {
	createArcCanvasPath,
	createArcPath,
	getRingMetrics,
	isPointInSegment,
} from "../../base/geometry";

function resolveFill(config: SunburstChartConfig, branchIndex: number): string {
	return config.colors.fills[branchIndex % config.colors.fills.length] ?? "";
}

export function agSegment(
	...[args, ctx]: Parameters<SunburstChartCustom<SunburstChartConfig>["segment"]>
): Widget {
	const fill = resolveFill(ctx.config, args.branchIndex);
	const hasHover = ctx.hoveredSegment != null;
	const opacity = hasHover
		? (args.isHovered ? 1 : ctx.config.sunburst.dimOpacity)
		: 1;

	return Opacity({
		opacity,
		child: Stack({
			fit: StackFit.expand,
			clipped: false,
			children: [
				CustomPaint({
					painter: {
						hitTest: (position, size) => {
							const metrics = getRingMetrics(
								size.width,
								size.height,
								ctx.segments,
								ctx.config.sunburst.innerRadiusRatio,
							);
							if (!metrics) return false;
							return isPointInSegment(position, metrics, args);
						},
						svg: {
							createDefaultSvgEl: (context) => ({
								path: context.createSvgEl("path"),
							}),
							paint: ({ path }, size) => {
								const metrics = getRingMetrics(
									size.width,
									size.height,
									ctx.segments,
									ctx.config.sunburst.innerRadiusRatio,
								);
								if (!metrics) return;

								path.setAttribute("d", createArcPath(metrics, args));
								path.setAttribute("fill", fill);
								path.setAttribute("stroke", ctx.config.sunburst.strokeColor);
								path.setAttribute(
									"stroke-width",
									String(
										args.isHovered
											? ctx.config.sunburst.hoverStrokeWidth
											: ctx.config.sunburst.strokeWidth,
									),
								);
								if (args.isHovered) {
									path.setAttribute(
										"filter",
										`drop-shadow(0 0 8px ${ctx.config.sunburst.hoverShadowColor})`,
									);
								} else {
									path.removeAttribute("filter");
								}
							},
						},
						canvas: {
							paint: (context, size) => {
								const metrics = getRingMetrics(
									size.width,
									size.height,
									ctx.segments,
									ctx.config.sunburst.innerRadiusRatio,
								);
								if (!metrics) return;

								const canvasPath = createArcCanvasPath(metrics, args);
								const canvas = context.canvas;
								canvas.fillStyle = fill;
								canvas.fill(canvasPath);
								canvas.strokeStyle = ctx.config.sunburst.strokeColor;
								canvas.lineWidth = args.isHovered
									? ctx.config.sunburst.hoverStrokeWidth
									: ctx.config.sunburst.strokeWidth;
								if (args.isHovered) {
									canvas.shadowColor = ctx.config.sunburst.hoverShadowColor;
									canvas.shadowBlur = 8;
								}
								canvas.stroke(canvasPath);
								canvas.shadowBlur = 0;
							},
						},
					},
				}),
				args.dataLabel,
			],
		}),
	});
}
