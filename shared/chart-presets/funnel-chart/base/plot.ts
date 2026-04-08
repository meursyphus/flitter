import {
	Container,
	EdgeInsets,
	LayoutBuilder,
	Positioned,
	Stack,
	StackFit,
	type Widget,
} from "flitter-core";
import type { FunnelChartCustom } from "../types";

type PlotConfig = {
	funnel: {
		labelGap: number;
		labelColumnWidth: number;
		labelBandSize: number;
	};
};

export function Plot<TConfig extends PlotConfig>(
	...[{ labels, dataView, tooltipArea }, ctx]: Parameters<FunnelChartCustom<TConfig>["plot"]>
): Widget {
	return LayoutBuilder({
		builder: (_context, constraints) => {
			const stageCount = Math.max(labels.length, 1);
			const { funnel } = ctx.config;

			if (ctx.direction === "horizontal") {
				const labelBandSize = Math.min(funnel.labelBandSize, constraints.maxHeight);
				const dataTop = labelBandSize;
				const dataHeight = Math.max(0, constraints.maxHeight - labelBandSize);
				const bandWidth = constraints.maxWidth / stageCount;

				return Stack({
					fit: StackFit.expand,
					clipped: false,
					children: [
						...labels.map((label, index) =>
							Positioned({
								left: bandWidth * index,
								top: 0,
								width: bandWidth,
								height: labelBandSize,
								child: Container({
									padding: EdgeInsets.only({ bottom: funnel.labelGap }),
									child: label,
								}),
							}),
						),
						Positioned({
							left: 0,
							top: dataTop,
							width: constraints.maxWidth,
							height: dataHeight,
							child: dataView,
						}),
						Positioned({
							left: 0,
							top: dataTop,
							width: constraints.maxWidth,
							height: dataHeight,
							child: tooltipArea,
						}),
					],
				});
			}

			const labelColumnWidth = Math.min(
				funnel.labelColumnWidth,
				Math.max(0, constraints.maxWidth * 0.36),
			);
			const dataLeft = labelColumnWidth + funnel.labelGap;
			const dataWidth = Math.max(0, constraints.maxWidth - dataLeft);
			const bandHeight = constraints.maxHeight / stageCount;

			return Stack({
				fit: StackFit.expand,
				clipped: false,
				children: [
					...labels.map((label, index) =>
						Positioned({
							left: 0,
							top: bandHeight * index,
							width: labelColumnWidth,
							height: bandHeight,
							child: Container({
								padding: EdgeInsets.only({ right: funnel.labelGap }),
								child: label,
							}),
						}),
					),
					Positioned({
						left: dataLeft,
						top: 0,
						width: dataWidth,
						height: constraints.maxHeight,
						child: dataView,
					}),
					Positioned({
						left: dataLeft,
						top: 0,
						width: dataWidth,
						height: constraints.maxHeight,
						child: tooltipArea,
					}),
				],
			});
		},
	});
}
