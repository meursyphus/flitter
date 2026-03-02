import {
	StatelessWidget,
	type Widget,
	type BuildContext,
	LayoutBuilder,
} from "flitter-core";
import { RadarChartProvider } from "./provider";
import type { RadarVertex } from "./types";

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
				plot: new Plot(),
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

/**
 * Computes normalized vertex positions for a set of values.
 * Each vertex is on a spoke from the center, with the first spoke pointing up (12 o'clock).
 */
function computeVertices(
	values: number[],
	labels: string[],
	maxValue: number,
): RadarVertex[] {
	const axisCount = labels.length;
	const angleStep = (2 * Math.PI) / axisCount;
	const startAngle = -Math.PI / 2; // 12 o'clock

	return labels.map((label, i) => {
		const angle = startAngle + i * angleStep;
		const value = values[i] ?? 0;
		const ratio = maxValue > 0 ? Math.min(value / maxValue, 1) : 0;
		// Normalized positions: 0.5 is center, range is 0..1
		const nx = 0.5 + 0.5 * ratio * Math.cos(angle);
		const ny = 0.5 + 0.5 * ratio * Math.sin(angle);
		return { nx, ny, angle, ratio, value, label, index: i };
	});
}

class Plot extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = RadarChartProvider.of(context);
		return ctx.custom.plot(
			{
				angularAxis: new AngularAxis(),
				radialAxis: new RadialAxis(),
				series: new Series(),
			},
			ctx,
		);
	}
}

// --- Angular axis (spokes + category labels) ---

class AngularAxis extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = RadarChartProvider.of(context);
		const { data } = ctx;
		const axisCount = data.labels.length;
		const angleStep = (2 * Math.PI) / axisCount;
		const startAngle = -Math.PI / 2;

		const labels = data.labels.map((label, i) => {
			const angle = startAngle + i * angleStep;
			const nx = 0.5 + 0.5 * Math.cos(angle);
			const ny = 0.5 + 0.5 * Math.sin(angle);
			return new AngularAxisLabel({ index: i, label, angle, nx, ny });
		});

		return ctx.custom.angularAxis(
			{
				line: new AngularAxisLine({ axisCount }),
				labels,
			},
			ctx,
		);
	}
}

class AngularAxisLine extends StatelessWidget {
	#axisCount: number;

	constructor({ axisCount }: { axisCount: number }) {
		super();
		this.#axisCount = axisCount;
	}

	override build(context: BuildContext): Widget {
		const ctx = RadarChartProvider.of(context);
		return ctx.custom.angularAxisLine({ axisCount: this.#axisCount }, ctx);
	}
}

class AngularAxisLabel extends StatelessWidget {
	#index: number;
	#label: string;
	#angle: number;
	#nx: number;
	#ny: number;

	constructor({ index, label, angle, nx, ny }: { index: number; label: string; angle: number; nx: number; ny: number }) {
		super();
		this.#index = index;
		this.#label = label;
		this.#angle = angle;
		this.#nx = nx;
		this.#ny = ny;
	}

	override build(context: BuildContext): Widget {
		const ctx = RadarChartProvider.of(context);
		return ctx.custom.angularAxisLabel(
			{ index: this.#index, label: this.#label, angle: this.#angle, nx: this.#nx, ny: this.#ny },
			ctx,
		);
	}
}

// --- Radial axis (concentric polygons + scale labels) ---

class RadialAxis extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = RadarChartProvider.of(context);
		const { data, scale } = ctx;
		const axisCount = data.labels.length;
		const levels = scale != null ? Math.round((scale.max - scale.min) / scale.step) : 0;

		const labels: Widget[] = [];
		if (scale != null) {
			for (let i = 0; i <= levels; i++) {
				const value = scale.min + scale.step * i;
				labels.push(new RadialAxisLabel({ value, index: i }));
			}
		}

		return ctx.custom.radialAxis(
			{
				line: new RadialAxisLine({ levels, axisCount }),
				labels,
			},
			ctx,
		);
	}
}

class RadialAxisLine extends StatelessWidget {
	#levels: number;
	#axisCount: number;

	constructor({ levels, axisCount }: { levels: number; axisCount: number }) {
		super();
		this.#levels = levels;
		this.#axisCount = axisCount;
	}

	override build(context: BuildContext): Widget {
		const ctx = RadarChartProvider.of(context);
		return ctx.custom.radialAxisLine(
			{ levels: this.#levels, axisCount: this.#axisCount },
			ctx,
		);
	}
}

class RadialAxisLabel extends StatelessWidget {
	#value: number;
	#index: number;

	constructor({ value, index }: { value: number; index: number }) {
		super();
		this.#value = value;
		this.#index = index;
	}

	override build(context: BuildContext): Widget {
		const ctx = RadarChartProvider.of(context);
		return ctx.custom.radialAxisLabel(
			{ value: this.#value, index: this.#index },
			ctx,
		);
	}
}

// --- Series ---

class Series extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = RadarChartProvider.of(context);
		const { data, scale } = ctx;
		const maxValue = scale?.max ?? 0;

		const radars = data.datasets.map((ds, index) => {
			const vertices = computeVertices(ds.values, data.labels, maxValue);
			return new Radar({ legend: ds.legend, index, vertices });
		});

		return ctx.custom.series({ radars }, ctx);
	}
}

class Radar extends StatelessWidget {
	#legend: string;
	#index: number;
	#vertices: RadarVertex[];

	constructor({ legend, index, vertices }: { legend: string; index: number; vertices: RadarVertex[] }) {
		super();
		this.#legend = legend;
		this.#index = index;
		this.#vertices = vertices;
	}

	override build(context: BuildContext): Widget {
		const ctx = RadarChartProvider.of(context);
		return ctx.custom.radar(
			{ legend: this.#legend, index: this.#index, vertices: this.#vertices },
			ctx,
		);
	}
}
