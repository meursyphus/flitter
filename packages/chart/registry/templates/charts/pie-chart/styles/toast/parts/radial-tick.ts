import {
	CustomPaint,
	SizedBox,
	type Widget,
} from "flitter-core";
import type { PieChartCustom } from "@headless/pie-chart/types";
import type { ToastPieChartConfig } from "../config";

export function toastRadialTick(
	...[args, ctx]: Parameters<PieChartCustom<ToastPieChartConfig>["radialTick"]>
): Widget {
	const { radial, radialTick, colors } = ctx.config;

	if (!radial.visible || radialTick.length <= 0) {
		return SizedBox.shrink();
	}

	const colorIndex = ctx.legends.indexOf(args.name);
	const seriesColor =
		colors[(colorIndex >= 0 ? colorIndex : args.index) % colors.length]
		?? radialTick.color;

	return SizedBox({
		width: radialTick.strokeWidth,
		height: radialTick.length,
		child: CustomPaint({
			painter: {
				hitTest: () => false,
				svg: {
					createDefaultSvgEl: (context) => ({
						line: context.createSvgEl("line"),
					}),
					paint: ({ line }, size) => {
						line.setAttribute("x1", String(size.width / 2));
						line.setAttribute("y1", String(size.height));
						line.setAttribute("x2", String(size.width / 2));
						line.setAttribute("y2", "0");
						line.setAttribute("stroke", seriesColor);
						line.setAttribute("stroke-width", String(radialTick.strokeWidth));
					},
				},
				canvas: {
					paint: (context, size) => {
						context.canvas.beginPath();
						context.canvas.moveTo(size.width / 2, size.height);
						context.canvas.lineTo(size.width / 2, 0);
						context.canvas.strokeStyle = seriesColor;
						context.canvas.lineWidth = radialTick.strokeWidth;
						context.canvas.stroke();
					},
				},
			},
		}),
	});
}
