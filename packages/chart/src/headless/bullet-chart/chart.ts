import {
	StatelessWidget,
	type Widget,
	type BuildContext,
	SizedBox,
	Stack,
} from "flitter-core";
import {
	createCartesianChart,
	getScaleLabels,
	type CartesianScaffoldBehavior,
} from "@headless/_shared/cartesian-scaffold";
import { BulletChartProvider } from "./provider";

class BulletGroup extends StatelessWidget {
	#index: number;

	constructor({ index }: { index: number }) {
		super();
		this.#index = index;
	}

	override build(context: BuildContext): Widget {
		const ctx = BulletChartProvider.of(context);
		const { data } = ctx;
		if (ctx.scale == null) return SizedBox.shrink();

		const dataset = data.datasets[this.#index];
		const label = data.labels[this.#index];

		const ranges = Stack({
			children: dataset.ranges
				.slice()
				.sort((a, b) => b - a)
				.map((rangeValue, rangeIndex) =>
					new RangeBar({
						rangeValue,
						rangeIndex,
						index: this.#index,
						label,
					}),
				),
		});

		return ctx.custom.bulletGroup(
			{
				ranges,
				valueBar: new ValueBar({
					value: dataset.value,
					index: this.#index,
					label,
				}),
				targetMarker: new TargetMarker({
					target: dataset.target,
					index: this.#index,
					label,
				}),
				index: this.#index,
				label,
			},
			ctx,
		);
	}
}

class RangeBar extends StatelessWidget {
	#rangeValue: number;
	#rangeIndex: number;
	#index: number;
	#label: string;

	constructor({
		rangeValue,
		rangeIndex,
		index,
		label,
	}: {
		rangeValue: number;
		rangeIndex: number;
		index: number;
		label: string;
	}) {
		super();
		this.#rangeValue = rangeValue;
		this.#rangeIndex = rangeIndex;
		this.#index = index;
		this.#label = label;
	}

	override build(context: BuildContext): Widget {
		const ctx = BulletChartProvider.of(context);
		return ctx.custom.rangeBar(
			{
				rangeValue: this.#rangeValue,
				rangeIndex: this.#rangeIndex,
				index: this.#index,
				label: this.#label,
			},
			ctx,
		);
	}
}

class ValueBar extends StatelessWidget {
	#value: number;
	#index: number;
	#label: string;

	constructor({ value, index, label }: { value: number; index: number; label: string }) {
		super();
		this.#value = value;
		this.#index = index;
		this.#label = label;
	}

	override build(context: BuildContext): Widget {
		const ctx = BulletChartProvider.of(context);
		return ctx.custom.valueBar(
			{ value: this.#value, index: this.#index, label: this.#label },
			ctx,
		);
	}
}

class TargetMarker extends StatelessWidget {
	#target: number;
	#index: number;
	#label: string;

	constructor({ target, index, label }: { target: number; index: number; label: string }) {
		super();
		this.#target = target;
		this.#index = index;
		this.#label = label;
	}

	override build(context: BuildContext): Widget {
		const ctx = BulletChartProvider.of(context);
		return ctx.custom.targetMarker(
			{ target: this.#target, index: this.#index, label: this.#label },
			ctx,
		);
	}
}

const behavior: CartesianScaffoldBehavior<ReturnType<typeof BulletChartProvider.of>> = {
	of: (context) => BulletChartProvider.of(context),
	buildLayout: (ctx, { title, plot, legends }) =>
		ctx.custom.layout({ title, plot, legends }, ctx),
	buildPlot: (ctx, { xAxis, yAxis, dataView, grid, axisCorner }) =>
		ctx.custom.plot({ xAxis, yAxis, dataView, grid, axisCorner }, ctx),
	getLegends: (ctx) =>
		ctx.legends.map((name, index) => ({
			name,
			index,
		})),
	buildLegend: (ctx, { name, index }) =>
		ctx.custom.legend({ name, index }, ctx),
	getXAxisLabels: (ctx) => getScaleLabels(ctx.scale),
	getYAxisLabels: (ctx) => ctx.data.labels,
	shouldRenderDataView: (ctx) => ctx.scale != null,
	buildDataView: (ctx) =>
		ctx.custom.dataView(
			{
				bulletGroups: Array.from(
					{ length: ctx.data.labels.length },
					(_, index) => new BulletGroup({ index }),
				),
			},
			ctx,
		),
};

export default class Chart extends StatelessWidget {
	override build(_: BuildContext): Widget {
		return createCartesianChart(behavior);
	}
}
