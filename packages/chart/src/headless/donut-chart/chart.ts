import {
	StatelessWidget,
	type Widget,
	type BuildContext,
	LayoutBuilder,
} from "flitter-core";
import { DonutChartProvider } from "./provider";

class Chart extends StatelessWidget {
	override build(_: BuildContext): Widget {
		return new SizeTracker();
	}
}

class SizeTracker extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = DonutChartProvider.of(context);
		return LayoutBuilder({
			builder: (_ctx, constraints) => {
				ctx.setSize(constraints.maxWidth, constraints.maxHeight);
				return new Layout();
			},
		});
	}
}

export default Chart;

class Layout extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = DonutChartProvider.of(context);
		return ctx.custom.layout(
			{
				title: new Title(),
				legends: ctx.legends.map((name, index) => new Legend({ name, index })),
				dataView: new DataView(),
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
		const ctx = DonutChartProvider.of(context);
		return ctx.custom.legend({ name: this.#name, index: this.#index }, ctx);
	}
}

class Title extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = DonutChartProvider.of(context);
		return ctx.custom.title(undefined, ctx);
	}
}

class DataView extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = DonutChartProvider.of(context);
		const { data } = ctx;
		const total = data.datasets.reduce((sum, dataset) => sum + dataset.value, 0);
		let currentAngle = 0;

		const slices = data.datasets.map((dataset, index) => {
			const percentage = total > 0 ? (dataset.value / total) * 100 : 0;
			const sweepAngle = total > 0 ? (dataset.value / total) * Math.PI * 2 : 0;
			const startAngle = currentAngle;
			currentAngle += sweepAngle;

			return {
				widget: ctx.custom.slice(
					{
						index,
						name: dataset.name,
						value: dataset.value,
						percentage,
						sweepAngle,
					},
					ctx,
				),
				startAngle,
				sweepAngle,
				percentage,
				index,
				name: dataset.name,
				value: dataset.value,
			};
		});

		return ctx.custom.dataView(
			{
				slices,
				centerContent: ctx.custom.centerContent({ total }, ctx),
			},
			ctx,
		);
	}
}
