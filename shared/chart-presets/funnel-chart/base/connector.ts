import { CustomPaint, type Widget } from "flitter-core";
import type { FunnelChartCustom } from "../types";
import {
	createConnectorPath,
	getTransitionRatios,
	hexToRgba,
} from "./utils";

type ConnectorConfig = {
	funnel: {
		minSegmentRatio: number;
		dimOpacity: number;
	};
};

export function Connector<TConfig extends ConnectorConfig>(
	...[{ ratio, nextRatio, color, isDimmed }, ctx]: Parameters<
		FunnelChartCustom<TConfig>["connector"]
	>
): Widget {
	const { currentNormalized, nextNormalized } = getTransitionRatios(
		ratio,
		nextRatio,
		ctx.config.funnel.minSegmentRatio,
	);
	const fill = hexToRgba(color, isDimmed ? 0.1 : 0.2);

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
