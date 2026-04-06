import {
	CustomPaint,
	SizedBox,
	type Widget,
} from "flitter-core";
import type { PieChartCustom } from "@headless/pie-chart/types";
import type { AgPieChartConfig } from "../config";

export function agRadialTick(
	...[_, ctx]: Parameters<PieChartCustom<AgPieChartConfig>["radialTick"]>
): Widget {
	const { radial, radialTick } = ctx.config;

	if (!radial.visible || radialTick.length <= 0) {
		return SizedBox.shrink();
	}

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
						line.setAttribute("stroke", radialTick.color);
						line.setAttribute("stroke-width", String(radialTick.strokeWidth));
					},
				},
				canvas: {
					paint: (context, size) => {
						context.canvas.beginPath();
						context.canvas.moveTo(size.width / 2, size.height);
						context.canvas.lineTo(size.width / 2, 0);
						context.canvas.strokeStyle = radialTick.color;
						context.canvas.lineWidth = radialTick.strokeWidth;
						context.canvas.stroke();
					},
				},
			},
		}),
	});
}
