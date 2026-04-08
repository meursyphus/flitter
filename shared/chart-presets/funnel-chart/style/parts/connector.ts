import { CustomPaint, type Widget } from "flitter-core";
import type { FunnelChartCustom } from "flitter-ui/chart";
import type { FunnelChartConfig } from "../config";
import {
	createConnectorPath,
	getTransitionRatios,
	hexToRgba,
} from "../../base/utils";

export function agConnector(
	...[{ ratio, nextRatio, color, isHovered, isDimmed }, ctx]: Parameters<
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
		isDimmed ? 0.08 : isHovered ? 0.24 : 0.16,
	);

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
					connector.setAttribute("stroke", "none");
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

					context.canvas.fillStyle = fill;
					context.canvas.fill(path.toCanvasPath());
				},
			},
		},
	});
}
