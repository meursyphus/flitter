import {
	LayoutBuilder,
	Positioned,
	SizedBox,
	Stack,
	StackFit,
	type Widget,
} from "flitter-core";
import type { FunnelChartCustom } from "../types";
import { getVisualRatio } from "./utils";

type StageLayoutConfig = {
	funnel: {
		connectorSize: number;
		minSegmentRatio: number;
		labelGap: number;
		labelColumnWidth: number;
		labelBandSize: number;
	};
};

export function Stage<TConfig extends StageLayoutConfig>(
	...[stageArgs, ctx]: Parameters<FunnelChartCustom<TConfig>["stage"]>
): Widget {
	const { index, ratio, nextRatio, segment, connector } = stageArgs;
	const { funnel } = ctx.config;

	return LayoutBuilder({
		builder: (_context, constraints) => {
			if (ctx.direction === "vertical") {
				return buildVerticalStage({
					index,
					stageCount: Math.max(ctx.stages.length, 1),
					constraints,
					funnel,
					ratio,
					nextRatio,
					segment,
					connector,
				});
			}

			return buildHorizontalStage({
				index,
				stageCount: Math.max(ctx.stages.length, 1),
				constraints,
				funnel,
				ratio,
				nextRatio,
				segment,
				connector,
			});
		},
	});
}

function buildVerticalStage({
	index,
	stageCount,
	constraints,
	funnel,
	ratio,
	nextRatio,
	segment,
	connector,
}: {
	index: number;
	stageCount: number;
	constraints: { maxWidth: number; maxHeight: number };
	funnel: StageLayoutConfig["funnel"];
	ratio: number;
	nextRatio: number | null;
	segment: Widget;
	connector: Widget | null;
}): Widget {
	const currentRatio = getVisualRatio(ratio, funnel.minSegmentRatio);
	const nextVisualRatio =
		nextRatio == null
			? currentRatio
			: getVisualRatio(nextRatio, funnel.minSegmentRatio);
	const transitionRatio = Math.max(currentRatio, nextVisualRatio);
	const connectorExtent = connector == null ? 0 : funnel.connectorSize;
	const bandHeight = constraints.maxHeight / stageCount;
	const top = bandHeight * index;
	const segmentHeight = Math.max(0, bandHeight - connectorExtent);
	const segmentWidth = constraints.maxWidth * currentRatio;
	const connectorWidth = constraints.maxWidth * transitionRatio;
	const segmentLeft = (constraints.maxWidth - segmentWidth) / 2;
	const connectorLeft = (constraints.maxWidth - connectorWidth) / 2;

	return Stack({
		fit: StackFit.expand,
		children: [
			Positioned({
				left: segmentLeft,
				top,
				width: segmentWidth,
				height: segmentHeight,
				child: segment,
			}),
			connector == null
				? SizedBox.shrink()
				: Positioned({
						left: connectorLeft,
						top: top + segmentHeight,
						width: connectorWidth,
						height: connectorExtent,
						child: connector,
				  }),
		],
	});
}

function buildHorizontalStage({
	index,
	stageCount,
	constraints,
	funnel,
	ratio,
	nextRatio,
	segment,
	connector,
}: {
	index: number;
	stageCount: number;
	constraints: { maxWidth: number; maxHeight: number };
	funnel: StageLayoutConfig["funnel"];
	ratio: number;
	nextRatio: number | null;
	segment: Widget;
	connector: Widget | null;
}): Widget {
	const currentRatio = getVisualRatio(ratio, funnel.minSegmentRatio);
	const nextVisualRatio =
		nextRatio == null
			? currentRatio
			: getVisualRatio(nextRatio, funnel.minSegmentRatio);
	const transitionRatio = Math.max(currentRatio, nextVisualRatio);
	const connectorExtent = connector == null ? 0 : funnel.connectorSize;
	const bandWidth = constraints.maxWidth / stageCount;
	const left = bandWidth * index;
	const segmentWidth = Math.max(0, bandWidth - connectorExtent);
	const segmentHeight = constraints.maxHeight * currentRatio;
	const connectorHeight = constraints.maxHeight * transitionRatio;
	const segmentTop = (constraints.maxHeight - segmentHeight) / 2;
	const connectorTop = (constraints.maxHeight - connectorHeight) / 2;

	return Stack({
		fit: StackFit.expand,
		children: [
			Positioned({
				left,
				top: segmentTop,
				width: segmentWidth,
				height: segmentHeight,
				child: segment,
			}),
			connector == null
				? SizedBox.shrink()
				: Positioned({
						left: left + segmentWidth,
						top: connectorTop,
						width: connectorExtent,
						height: connectorHeight,
						child: connector,
				  }),
		],
	});
}
