import {
	StatelessWidget,
	type Widget,
	type BuildContext,
	LayoutBuilder,
} from "flitter-core";
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

class StageWidget extends StatelessWidget {
	#index: number;

	constructor({ index }: { index: number }) {
		super();
		this.#index = index;
	}

	override build(context: BuildContext): Widget {
		const ctx = FunnelChartProvider.of(context);
		const stage = ctx.stages[this.#index];

		return ctx.custom.stage(
			{
				index: this.#index,
				label: stage.label,
				value: stage.value,
				ratio: stage.ratio,
				color: stage.color,
				stageLabel: new StageLabelWidget({ index: this.#index }),
				dataLabel: new DataLabelWidget({
					index: this.#index,
					percentage: stage.percentage,
				}),
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
			{ label: stage.label, index: this.#index },
			ctx,
		);
	}
}

class DataLabelWidget extends StatelessWidget {
	#index: number;
	#percentage: number;

	constructor({
		index,
		percentage,
	}: {
		index: number;
		percentage: number;
	}) {
		super();
		this.#index = index;
		this.#percentage = percentage;
	}

	override build(context: BuildContext): Widget {
		const ctx = FunnelChartProvider.of(context);
		const stage = ctx.stages[this.#index];
		return ctx.custom.dataLabel(
			{
				value: stage.value,
				percentage: this.#percentage,
				label: stage.label,
				index: this.#index,
			},
			ctx,
		);
	}
}
