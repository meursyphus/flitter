import {
	StatelessWidget,
	type Widget,
	type BuildContext,
	LayoutBuilder,
} from "flitter-core";
import { SunburstChartProvider } from "./provider";

class SunburstChart extends StatelessWidget {
	override build(_: BuildContext): Widget {
		return new SizeTracker();
	}
}

export default SunburstChart;

class SizeTracker extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = SunburstChartProvider.of(context);
		return LayoutBuilder({
			builder: (_ctx, constraints) => {
				ctx.setSize(constraints.maxWidth, constraints.maxHeight);
				return new LayoutWidget();
			},
		});
	}
}

class LayoutWidget extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = SunburstChartProvider.of(context);
		return ctx.custom.layout(
			{
				title: new TitleWidget(),
				sunburst: new SunburstWidget(),
				legend: new LegendWidget(),
			},
			ctx,
		);
	}
}

class TitleWidget extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = SunburstChartProvider.of(context);
		return ctx.custom.title(undefined, ctx);
	}
}

class LegendWidget extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = SunburstChartProvider.of(context);
		const children = ctx.data.root.children ?? [];
		const items = children.map((child, index) => {
			const segment = ctx.segments.find(
				(entry) => entry.depth === 1 && entry.node.label === child.label,
			);

			return new LegendItemWidget({
				label: child.label,
				color: segment?.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length],
			});
		});
		return ctx.custom.legend({ items }, ctx);
	}
}

class LegendItemWidget extends StatelessWidget {
  #label: string;
  #color: string;

  constructor({ label, color }: { label: string; color: string }) {
    super();
    this.#label = label;
    this.#color = color;
  }

	override build(context: BuildContext): Widget {
		const ctx = SunburstChartProvider.of(context);
		return ctx.custom.legendItem(
			{ label: this.#label, color: this.#color },
			ctx,
		);
	}
}

class DataLabelWidget extends StatelessWidget {
	#segment: any;
	constructor({ segment }: { segment: any }) {
		super();
		this.#segment = segment;
	}
	override build(context: BuildContext): Widget {
		const ctx = SunburstChartProvider.of(context);
		return ctx.custom.dataLabel({ segment: this.#segment }, ctx);
	}
}

class SunburstWidget extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = SunburstChartProvider.of(context);
		const dataLabels = ctx.segments.map(
			(segment) => new DataLabelWidget({ segment }),
		);
		return ctx.custom.sunburst({ segments: ctx.segments, dataLabels }, ctx);
	}
}

import { DEFAULT_COLORS } from "./controller";
