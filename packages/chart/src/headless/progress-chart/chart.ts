import {
	StatelessWidget,
	type Widget,
	type BuildContext,
	LayoutBuilder,
} from "flitter-core";
import { ProgressChartProvider } from "./provider";

class Chart extends StatelessWidget {
	override build(_: BuildContext): Widget {
		return new SizeTracker();
	}
}

class SizeTracker extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = ProgressChartProvider.of(context);
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
		const ctx = ProgressChartProvider.of(context);
		return ctx.custom.layout(
			{
				title: new Title(),
				track: new Track(),
				valueLabel: new ValueLabel(),
			},
			ctx,
		);
	}
}

class Title extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = ProgressChartProvider.of(context);
		return ctx.custom.title(undefined, ctx);
	}
}

class Track extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = ProgressChartProvider.of(context);
		return ctx.custom.track(
			{
				fills: ctx.segments.map((segment) => new Fill({ index: segment.index })),
			},
			ctx,
		);
	}
}

class Fill extends StatelessWidget {
	#index: number;

	constructor({ index }: { index: number }) {
		super();
		this.#index = index;
	}

	override build(context: BuildContext): Widget {
		const ctx = ProgressChartProvider.of(context);
		const segment = ctx.segments[this.#index];
		return ctx.custom.fill(
			{
				value: segment.value,
				ratio: segment.ratio,
				index: segment.index,
				label: segment.label,
				color: segment.color,
				segmentLabel: new SegmentLabel({ index: segment.index }),
			},
			ctx,
		);
	}
}

class SegmentLabel extends StatelessWidget {
	#index: number;

	constructor({ index }: { index: number }) {
		super();
		this.#index = index;
	}

	override build(context: BuildContext): Widget {
		const ctx = ProgressChartProvider.of(context);
		const segment = ctx.segments[this.#index];
		return ctx.custom.segmentLabel(
			{
				value: segment.value,
				ratio: segment.ratio,
				index: segment.index,
				label: segment.label,
			},
			ctx,
		);
	}
}

class ValueLabel extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = ProgressChartProvider.of(context);
		return ctx.custom.valueLabel(
			{
				value: ctx.totalValue,
				max: ctx.max,
				ratio: ctx.ratio,
			},
			ctx,
		);
	}
}
