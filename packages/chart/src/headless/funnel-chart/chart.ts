import {
	StatefulWidget,
	State,
	GlobalKey,
	StatelessWidget,
	type Widget,
	type BuildContext,
	LayoutBuilder,
	GestureDetector,
	SizedBox,
	Stack,
	StackFit,
} from "flitter-core";
import { resolveOverlayRect } from "@headless/_shared/cartesian-scaffold";
import { FunnelChartProvider } from "./provider";

class FunnelChart extends StatelessWidget {
	override build(_: BuildContext): Widget {
		return new SizeTracker();
	}
}

export default FunnelChart;

class SizeTracker extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = FunnelChartProvider.of(context);
		return LayoutBuilder({
			builder: (_ctx, constraints) => {
				ctx.setSize(constraints.maxWidth, constraints.maxHeight);
				return new Layout();
			},
		});
	}
}

class Layout extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = FunnelChartProvider.of(context);
		return ctx.custom.layout(
			{
				title: new TitleWidget(),
				plot: new PlotWidget(),
				funnel: new FunnelWidget(),
				legends: ctx.stages.map((_, index) => new LegendWidget({ index })),
			},
			ctx,
		);
	}
}

class TitleWidget extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = FunnelChartProvider.of(context);
		return ctx.custom.title(undefined, ctx);
	}
}

class LegendWidget extends StatelessWidget {
	#index: number;

	constructor({ index }: { index: number }) {
		super();
		this.#index = index;
	}

	override build(context: BuildContext): Widget {
		const ctx = FunnelChartProvider.of(context);
		const stage = ctx.stages[this.#index];
		return ctx.custom.legend(
			{ label: stage.label, color: stage.color, index: this.#index },
			ctx,
		);
	}
}

class FunnelWidget extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = FunnelChartProvider.of(context);
		return ctx.custom.funnel(
			{
				stages: ctx.stages.map((_, index) => new StageWidget({ index })),
			},
			ctx,
		);
	}
}

class PlotWidget extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = FunnelChartProvider.of(context);
		return ctx.custom.plot(
			{
				labels: ctx.stages.map((_, index) => new StageLabelWidget({ index })),
				dataView: new DataViewWidget(),
				tooltipArea: new TooltipAreaWidget(),
			},
			ctx,
		);
	}
}

class DataViewWidget extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = FunnelChartProvider.of(context);
		return GestureDetector({
			behavior: "translucent",
			onMouseLeave: () => ctx.unhoverAllStages(),
			child: ctx.custom.dataView(
				{
					stages: ctx.stages.map((_, index) => new StageWidget({ index })),
				},
				ctx,
			),
		});
	}
}

class StageWidget extends StatelessWidget {
	#index: number;

	constructor({ index }: { index: number }) {
		super();
		this.#index = index;
	}

	override build(context: BuildContext): Widget {
		const ctx = FunnelChartProvider.of(context);
		const stage = ctx.stages[this.#index];
		const hoveredIndex = ctx.hoveredIndex;
		const isHovered = ctx.isStageHovered(this.#index);
		const isDimmed = hoveredIndex != null && !isHovered;

		return ctx.custom.stage(
			{
				index: this.#index,
				label: stage.label,
				value: stage.value,
				ratio: stage.ratio,
				percentage: stage.percentage,
				stepPercentage: stage.stepPercentage,
				color: stage.color,
				previousValue: stage.previousValue,
				nextValue: stage.nextValue,
				previousRatio: stage.previousRatio,
				nextRatio: stage.nextRatio,
				isHovered,
				isDimmed,
				segment: new SegmentWidget({ index: this.#index }),
				connector:
					stage.nextRatio == null
						? null
						: new ConnectorWidget({ index: this.#index }),
				dataLabel: new DataLabelWidget({
					index: this.#index,
					percentage: stage.percentage,
					stepPercentage: stage.stepPercentage,
				}),
			},
			ctx,
		);
	}
}

class SegmentWidget extends StatefulWidget {
	#index: number;

	constructor({ index }: { index: number }) {
		super();
		this.#index = index;
	}

	get index(): number {
		return this.#index;
	}

	createState() {
		return new SegmentWidgetState();
	}
}

class SegmentWidgetState extends State<SegmentWidget> {
	anchorKey = new GlobalKey();

	override build(context: BuildContext): Widget {
		const ctx = FunnelChartProvider.of(context);
		const stage = ctx.stages[this.widget.index];
		const hoveredIndex = ctx.hoveredIndex;
		const isHovered = ctx.isStageHovered(this.widget.index);
		const isDimmed = hoveredIndex != null && !isHovered;

		return GestureDetector({
			key: this.anchorKey,
			cursor: "default",
			onMouseEnter: () => ctx.hoverStage(this.widget.index, this.anchorKey),
			onMouseLeave: () => ctx.unhoverStage(this.widget.index),
			child: ctx.custom.segment(
				{
					index: this.widget.index,
					label: stage.label,
					value: stage.value,
					ratio: stage.ratio,
					percentage: stage.percentage,
					stepPercentage: stage.stepPercentage,
					color: stage.color,
					isHovered,
					isDimmed,
					dataLabel: new DataLabelWidget({
						index: this.widget.index,
						percentage: stage.percentage,
						stepPercentage: stage.stepPercentage,
					}),
				},
				ctx,
			),
		});
	}
}

class ConnectorWidget extends StatelessWidget {
	#index: number;

	constructor({ index }: { index: number }) {
		super();
		this.#index = index;
	}

	override build(context: BuildContext): Widget {
		const ctx = FunnelChartProvider.of(context);
		const stage = ctx.stages[this.#index];
		const hoveredIndex = ctx.hoveredIndex;
		const isHovered = ctx.isStageHovered(this.#index);
		const isDimmed = hoveredIndex != null && !isHovered;
		return ctx.custom.connector(
			{
				index: this.#index,
				label: stage.label,
				value: stage.value,
				ratio: stage.ratio,
				percentage: stage.percentage,
				stepPercentage: stage.stepPercentage,
				color: stage.color,
				previousRatio: stage.previousRatio,
				nextRatio: stage.nextRatio,
				isHovered,
				isDimmed,
			},
			ctx,
		);
	}
}

class StageLabelWidget extends StatelessWidget {
	#index: number;

	constructor({ index }: { index: number }) {
		super();
		this.#index = index;
	}

	override build(context: BuildContext): Widget {
		const ctx = FunnelChartProvider.of(context);
		const stage = ctx.stages[this.#index];
		return ctx.custom.stageLabel(
			{
				label: stage.label,
				index: this.#index,
				value: stage.value,
				percentage: stage.percentage,
				stepPercentage: stage.stepPercentage,
			},
			ctx,
		);
	}
}

class DataLabelWidget extends StatelessWidget {
	#index: number;
	#percentage: number;
	#stepPercentage: number | null;

	constructor({
		index,
		percentage,
		stepPercentage,
	}: {
		index: number;
		percentage: number;
		stepPercentage: number | null;
	}) {
		super();
		this.#index = index;
		this.#percentage = percentage;
		this.#stepPercentage = stepPercentage;
	}

	override build(context: BuildContext): Widget {
		const ctx = FunnelChartProvider.of(context);
		const stage = ctx.stages[this.#index];
		return ctx.custom.dataLabel(
			{
				value: stage.value,
				percentage: this.#percentage,
				stepPercentage: this.#stepPercentage,
				label: stage.label,
				index: this.#index,
			},
			ctx,
		);
	}
}

class TooltipAreaWidget extends StatefulWidget {
	createState() {
		return new TooltipAreaWidgetState();
	}
}

class TooltipAreaWidgetState extends State<TooltipAreaWidget> {
	overlayKey = new GlobalKey();

	override build(context: BuildContext): Widget {
		const ctx = FunnelChartProvider.of(context);
		const hoveredStage = ctx.hoveredStage;
		const anchorKey = ctx.hoveredStageAnchorKey;
		const rect =
			hoveredStage == null || anchorKey == null
				? null
				: resolveOverlayRect(this.overlayKey, anchorKey);
		const resolvedHoveredStage =
			hoveredStage == null || rect == null ? null : { ...hoveredStage, ...rect };
		const tooltip =
			hoveredStage == null
				? null
				: ctx.custom.tooltip(
						{
							label: hoveredStage.label,
							items: [
								{
									legend: "Value",
									color: hoveredStage.color,
									value: hoveredStage.value,
								},
								{
									legend: "Retained",
									color: hoveredStage.color,
									value: `${hoveredStage.percentage.toFixed(1)}%`,
								},
								...(hoveredStage.stepPercentage == null
									? []
									: [
											{
												legend: "Step",
												color: hoveredStage.color,
												value: `${hoveredStage.stepPercentage.toFixed(1)}%`,
											},
									  ]),
							],
						},
						ctx,
					);

		return Stack({
			fit: StackFit.expand,
			clipped: false,
			children: [
				SizedBox({ key: this.overlayKey, width: Infinity, height: Infinity }),
				ctx.custom.tooltipArea(
					{ tooltip, hoveredStage: resolvedHoveredStage },
					ctx,
				),
			],
		});
	}
}
