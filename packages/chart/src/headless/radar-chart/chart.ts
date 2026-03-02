import {
	StatelessWidget,
	type Widget,
	type BuildContext,
	LayoutBuilder,
} from "flitter-core";
import { RadarChartProvider } from "./provider";

class Chart extends StatelessWidget {
	override build(_: BuildContext): Widget {
		return new SizeTracker();
	}
}

class SizeTracker extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = RadarChartProvider.of(context);
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
		const ctx = RadarChartProvider.of(context);
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
		const ctx = RadarChartProvider.of(context);
		return ctx.custom.legend({ name: this.#name, index: this.#index }, ctx);
	}
}

class Title extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = RadarChartProvider.of(context);
		return ctx.custom.title(undefined, ctx);
	}
}

class Series extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = RadarChartProvider.of(context);
		const { data, scale } = ctx;
		const levels = scale != null ? Math.round((scale.max - scale.min) / scale.step) : 0;

		const datasets = data.datasets.map((ds, index) =>
			new Dataset({ values: ds.values, legend: ds.legend, index }),
		);

		return ctx.custom.series(
			{
				grid: new Grid({ levels }),
				axes: new Axes(),
				datasets,
				axisLabels: new AxisLabels(),
			},
			ctx,
		);
	}
}

class Grid extends StatelessWidget {
	#levels: number;

	constructor({ levels }: { levels: number }) {
		super();
		this.#levels = levels;
	}

	override build(context: BuildContext): Widget {
		const ctx = RadarChartProvider.of(context);
		return ctx.custom.grid({ levels: this.#levels }, ctx);
	}
}

class Axes extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = RadarChartProvider.of(context);
		const { data } = ctx;
		// Render all axes as a single composite widget via the axis slot
		// The axis slot receives each individual axis
		const axisWidgets = data.labels.map((label, index) =>
			new Axis({ index, label }),
		);
		// We render axes by calling the axis custom for each label
		// But the old pattern passed all axes at once to the radar slot.
		// In the new pattern, each axis is rendered individually.
		// Since axes is a single Widget in the series slot, we use the first axis call
		// to represent the collection. However, looking at the old code,
		// the `axis` custom was called once with index: -1 for the whole set.
		// Let's follow the old pattern: axis is called once for the whole set.
		return ctx.custom.axis({ index: -1, label: "" }, ctx);
	}
}

class Axis extends StatelessWidget {
	#index: number;
	#label: string;

	constructor({ index, label }: { index: number; label: string }) {
		super();
		this.#index = index;
		this.#label = label;
	}

	override build(context: BuildContext): Widget {
		const ctx = RadarChartProvider.of(context);
		return ctx.custom.axis({ index: this.#index, label: this.#label }, ctx);
	}
}

class AxisLabels extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = RadarChartProvider.of(context);
		// Same pattern as axes: called once with index: -1 for the whole set
		return ctx.custom.axisLabel({ index: -1, label: "" }, ctx);
	}
}

class Dataset extends StatelessWidget {
	#values: number[];
	#legend: string;
	#index: number;

	constructor({ values, legend, index }: { values: number[]; legend: string; index: number }) {
		super();
		this.#values = values;
		this.#legend = legend;
		this.#index = index;
	}

	override build(context: BuildContext): Widget {
		const ctx = RadarChartProvider.of(context);
		return ctx.custom.dataset(
			{ values: this.#values, legend: this.#legend, index: this.#index },
			ctx,
		);
	}
}
