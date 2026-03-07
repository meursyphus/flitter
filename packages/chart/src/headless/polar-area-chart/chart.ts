import {
	StatelessWidget,
	type Widget,
	type BuildContext,
	LayoutBuilder,
} from "flitter-core";
import { PolarAreaChartProvider } from "./provider";

class Chart extends StatelessWidget {
	override build(_: BuildContext): Widget {
		return new SizeTracker();
	}
}

class SizeTracker extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = PolarAreaChartProvider.of(context);
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
		const ctx = PolarAreaChartProvider.of(context);
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
		const ctx = PolarAreaChartProvider.of(context);
		return ctx.custom.legend({ name: this.#name, index: this.#index }, ctx);
	}
}

class Title extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = PolarAreaChartProvider.of(context);
		return ctx.custom.title(undefined, ctx);
	}
}

class DataView extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = PolarAreaChartProvider.of(context);
		const maxValue = ctx.maxValue;
		let currentAngle = 0;

		const sectors = ctx.data.datasets.map((dataset, index) => {
			const startAngle = currentAngle;
			currentAngle += ctx.angleStep;

			return ctx.custom.sector(
				{
					index,
					name: dataset.name,
					value: dataset.value,
					ratio: maxValue > 0 ? dataset.value / maxValue : 0,
					angle: ctx.angleStep,
					startAngle,
				},
				ctx,
			);
		});

		return ctx.custom.dataView(
			{
				sectors,
				scale: ctx.custom.scale(
					{
						maxValue,
						count: ctx.data.datasets.length,
					},
					ctx,
				),
			},
			ctx,
		);
	}
}
