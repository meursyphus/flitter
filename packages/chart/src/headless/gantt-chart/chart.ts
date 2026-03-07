import {
	StatelessWidget,
	type Widget,
	type BuildContext,
	LayoutBuilder,
	SizedBox,
} from "flitter-core";
import { GanttChartProvider } from "./provider";

function formatTick(value: number): string {
	return new Date(value).toISOString().slice(0, 10);
}

class Chart extends StatelessWidget {
	override build(_: BuildContext): Widget {
		return new SizeTracker();
	}
}

class SizeTracker extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = GanttChartProvider.of(context);
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
		const ctx = GanttChartProvider.of(context);
		return ctx.custom.layout(
			{
				title: new Title(),
				plot: new Plot(),
				legends: ctx.groups.map((name, index) => new Legend({ name, index })),
			},
			ctx,
		);
	}
}

class Title extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = GanttChartProvider.of(context);
		return ctx.custom.title(undefined, ctx);
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
		const ctx = GanttChartProvider.of(context);
		return ctx.custom.legend({ name: this.#name, index: this.#index }, ctx);
	}
}

class Plot extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = GanttChartProvider.of(context);
		return ctx.custom.plot(
			{
				xAxis: new XAxis(),
				yAxisLabels: ctx.tasks.map(
					(task, index) => new YAxisLabel({ name: task.label, index }),
				),
				dataView: new DataView(),
				grid: new Grid(),
			},
			ctx,
		);
	}
}

class XAxis extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = GanttChartProvider.of(context);
		if (ctx.scale == null) return SizedBox.shrink();

		const labels: Widget[] = [];
		for (let tick = 0; tick <= 5; tick++) {
			const value = ctx.scale.min + ctx.scale.step * tick;
			labels.push(new XAxisLabel({ name: formatTick(value), index: tick }));
		}

		return ctx.custom.xAxis(
			{
				line: new XAxisLine(),
				labels,
				tick: new XAxisTick(),
			},
			ctx,
		);
	}
}

class XAxisLabel extends StatelessWidget {
	#name: string;
	#index: number;

	constructor({ name, index }: { name: string; index: number }) {
		super();
		this.#name = name;
		this.#index = index;
	}

	override build(context: BuildContext): Widget {
		const ctx = GanttChartProvider.of(context);
		return ctx.custom.xAxisLabel({ name: this.#name, index: this.#index }, ctx);
	}
}

class XAxisTick extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = GanttChartProvider.of(context);
		return ctx.custom.xAxisTick(undefined, ctx);
	}
}

class XAxisLine extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = GanttChartProvider.of(context);
		return ctx.custom.xAxisLine(undefined, ctx);
	}
}

class YAxisLabel extends StatelessWidget {
	#name: string;
	#index: number;

	constructor({ name, index }: { name: string; index: number }) {
		super();
		this.#name = name;
		this.#index = index;
	}

	override build(context: BuildContext): Widget {
		const ctx = GanttChartProvider.of(context);
		return ctx.custom.yAxisLabel({ name: this.#name, index: this.#index }, ctx);
	}
}

class DataView extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = GanttChartProvider.of(context);
		if (ctx.scale == null) return SizedBox.shrink();

		const taskIndexMap = new Map(ctx.tasks.map((task, index) => [task.id, index]));

		return ctx.custom.dataView(
			{
				taskBars: ctx.tasks.map((task, index) =>
					task.start === task.end
						? new Milestone({ index })
						: new TaskBar({ index }),
				),
				dependencies: ctx.tasks.flatMap((task, toIndex) =>
					(task.dependencies ?? []).flatMap((dependencyId) => {
						const fromIndex = taskIndexMap.get(dependencyId);
						if (fromIndex == null) return [];
						const fromTask = ctx.tasks[fromIndex];
						return [
							new Dependency({
								fromTaskId: fromTask.id,
								toTaskId: task.id,
								fromIndex,
								toIndex,
								fromRatio: ctx.getRatio(fromTask.end),
								toRatio: ctx.getRatio(task.start),
							}),
						];
					}),
				),
			},
			ctx,
		);
	}
}

class TaskBar extends StatelessWidget {
	#index: number;

	constructor({ index }: { index: number }) {
		super();
		this.#index = index;
	}

	override build(context: BuildContext): Widget {
		const ctx = GanttChartProvider.of(context);
		const task = ctx.tasks[this.#index];
		return ctx.custom.taskBar(
			{
				task,
				index: this.#index,
				startRatio: ctx.getRatio(task.start),
				widthRatio: ctx.getRatio(task.end) - ctx.getRatio(task.start),
			},
			ctx,
		);
	}
}

class Milestone extends StatelessWidget {
	#index: number;

	constructor({ index }: { index: number }) {
		super();
		this.#index = index;
	}

	override build(context: BuildContext): Widget {
		const ctx = GanttChartProvider.of(context);
		const task = ctx.tasks[this.#index];
		return ctx.custom.milestone(
			{
				task,
				index: this.#index,
				startRatio: ctx.getRatio(task.start),
			},
			ctx,
		);
	}
}

class Dependency extends StatelessWidget {
	#props: {
		fromTaskId: string;
		toTaskId: string;
		fromIndex: number;
		toIndex: number;
		fromRatio: number;
		toRatio: number;
	};

	constructor(props: {
		fromTaskId: string;
		toTaskId: string;
		fromIndex: number;
		toIndex: number;
		fromRatio: number;
		toRatio: number;
	}) {
		super();
		this.#props = props;
	}

	override build(context: BuildContext): Widget {
		const ctx = GanttChartProvider.of(context);
		return ctx.custom.dependency(this.#props, ctx);
	}
}

class Grid extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = GanttChartProvider.of(context);
		return ctx.custom.grid(
			{
				xLine: Array.from({ length: 6 }, (_, index) => new GridXLine({ index })),
			},
			ctx,
		);
	}
}

class GridXLine extends StatelessWidget {
	#index: number;

	constructor({ index }: { index: number }) {
		super();
		this.#index = index;
	}

	override build(context: BuildContext): Widget {
		const ctx = GanttChartProvider.of(context);
		return ctx.custom.gridXLine({ index: this.#index }, ctx);
	}
}
