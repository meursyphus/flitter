import { CustomPaint, type Widget } from "flitter-core";
import type { FunnelChartCustom } from "flitter-ui/chart";
import type { FunnelChartConfig } from "../config";
import {
	createConnectorPath,
	getTransitionRatios,
	hexToRgba,
} from "../../base/utils";

export function toastConnector(
	...[{ ratio, nextRatio, color, isHovered }, ctx]: Parameters<
		FunnelChartCustom<FunnelChartConfig>["connector"]
	>
): Widget {
	const { currentNormalized, nextNormalized } = getTransitionRatios(
		ratio,
		nextRatio,
		ctx.config.funnel.minSegmentRatio,
	);
	const fill = hexToRgba(
		color,
		isHovered ? 0.48 : 0.32,
	);
	const stroke = isHovered ? "rgba(255,255,255,0.95)" : "none";

	return CustomPaint({
		painter: {
			svg: {
				createDefaultSvgEl: (context) => ({
					connector: context.createSvgEl("path"),
				}),
				paint: ({ connector }, size) => {
					const path = createConnectorPath({
						direction: ctx.direction,
						width: size.width,
						height: size.height,
						currentRatio: currentNormalized,
						nextRatio: nextNormalized,
					});

					connector.setAttribute("d", path.getD());
					connector.setAttribute("fill", fill);
					connector.setAttribute("stroke", stroke);
					if (isHovered) {
						connector.setAttribute("stroke-width", "2");
					}
				},
			},
			canvas: {
				paint: (context, size) => {
					const path = createConnectorPath({
						direction: ctx.direction,
						width: size.width,
						height: size.height,
						currentRatio: currentNormalized,
						nextRatio: nextNormalized,
					});
					const canvas = context.canvas;

					canvas.fillStyle = fill;
					canvas.fill(path.toCanvasPath());

					if (isHovered) {
						canvas.strokeStyle = "rgba(255,255,255,0.95)";
						canvas.lineWidth = 2;
						canvas.stroke(path.toCanvasPath());
					}
				},
			},
		},
	});
}
