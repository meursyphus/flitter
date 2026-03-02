import {
	StatelessWidget,
	type Widget,
	type BuildContext,
	LayoutBuilder,
} from "flitter-core";
import { PieChartProvider } from "./provider";

class Chart extends StatelessWidget {
	override build(_: BuildContext): Widget {
		return new SizeTracker();
	}
}

class SizeTracker extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = PieChartProvider.of(context);
		return LayoutBuilder({
			builder: (_ctx: BuildContext, constraints) => {
				ctx.setSize(constraints.maxWidth, constraints.maxHeight);
				return new Layout();
			},
		});
	}
}

export default Chart;

class Layout extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = PieChartProvider.of(context);
		return ctx.custom.layout(
			{
				title: new Title(),
				legends: ctx.legends.map(
					(name, index) => new Legend({ name, index }),
				),
				series: new Series(),
			},
			ctx,
		);
	}
}

class Legend extends StatelessWidget {
	#name: string;
	#index: number;

	constructor({ name, index }: { name: string; index: number }) {
		super();
		this.#name = name;
		this.#index = index;
	}

	override build(context: BuildContext): Widget {
		const ctx = PieChartProvider.of(context);
		return ctx.custom.legend({ name: this.#name, index: this.#index }, ctx);
	}
}

class Title extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = PieChartProvider.of(context);
		return ctx.custom.title(undefined, ctx);
	}
}

class Series extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = PieChartProvider.of(context);
		const { data } = ctx;

		const total = data.values.reduce((sum, v) => sum + v, 0);
		let currentAngle = -Math.PI / 2;

		const pies = data.values.map((value, index) => {
			const percentage = total > 0 ? (value / total) * 100 : 0;
			const sweepAngle = total > 0 ? (value / total) * Math.PI * 2 : 0;
			const startAngle = currentAngle;
			currentAngle += sweepAngle;

			const label = data.labels[index];
			const widget = new Pie({
				index,
				label,
				value,
				percentage,
				startAngle,
				sweepAngle,
			});

			return { widget, startAngle, sweepAngle, percentage, index, label, value };
		});

		const dataLabels = data.values.map((value, index) => {
			const pie = pies[index];
			return new DataLabel({
				label: pie.label,
				value,
				percentage: pie.percentage,
				index,
				startAngle: pie.startAngle,
				sweepAngle: pie.sweepAngle,
			});
		});

		return ctx.custom.series({ pies, dataLabels }, ctx);
	}
}

class Pie extends StatelessWidget {
	#index: number;
	#label: string;
	#value: number;
	#percentage: number;
	#startAngle: number;
	#sweepAngle: number;

	constructor({
		index,
		label,
		value,
		percentage,
		startAngle,
		sweepAngle,
	}: {
		index: number;
		label: string;
		value: number;
		percentage: number;
		startAngle: number;
		sweepAngle: number;
	}) {
		super();
		this.#index = index;
		this.#label = label;
		this.#value = value;
		this.#percentage = percentage;
		this.#startAngle = startAngle;
		this.#sweepAngle = sweepAngle;
	}

	override build(context: BuildContext): Widget {
		const ctx = PieChartProvider.of(context);
		return ctx.custom.pie(
			{
				index: this.#index,
				label: this.#label,
				value: this.#value,
				percentage: this.#percentage,
				startAngle: this.#startAngle,
				sweepAngle: this.#sweepAngle,
			},
			ctx,
		);
	}
}

class DataLabel extends StatelessWidget {
	#label: string;
	#value: number;
	#percentage: number;
	#index: number;
	#startAngle: number;
	#sweepAngle: number;

	constructor({
		label,
		value,
		percentage,
		index,
		startAngle,
		sweepAngle,
	}: {
		label: string;
		value: number;
		percentage: number;
		index: number;
		startAngle: number;
		sweepAngle: number;
	}) {
		super();
		this.#label = label;
		this.#value = value;
		this.#percentage = percentage;
		this.#index = index;
		this.#startAngle = startAngle;
		this.#sweepAngle = sweepAngle;
	}

	override build(context: BuildContext): Widget {
		const ctx = PieChartProvider.of(context);
		return ctx.custom.dataLabel(
			{
				label: this.#label,
				value: this.#value,
				percentage: this.#percentage,
				index: this.#index,
				startAngle: this.#startAngle,
				sweepAngle: this.#sweepAngle,
			},
			ctx,
		);
	}
}
