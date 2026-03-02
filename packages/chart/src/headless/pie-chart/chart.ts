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

		const total = data.datasets.reduce((sum, d) => sum + d.value, 0);
		let currentAngle = 0;

		const pies = data.datasets.map((d, index) => {
			const percentage = total > 0 ? (d.value / total) * 100 : 0;
			const sweepAngle = total > 0 ? (d.value / total) * Math.PI * 2 : 0;
			const startAngle = currentAngle;
			currentAngle += sweepAngle;

			return {
				widget: ctx.custom.pie(
					{ index, name: d.name, value: d.value, percentage, sweepAngle },
					ctx,
				),
				startAngle,
				sweepAngle,
				percentage,
				index,
				name: d.name,
				value: d.value,
			};
		});

		return ctx.custom.series({ pies }, ctx);
	}
}
