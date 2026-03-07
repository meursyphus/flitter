import {
	StatelessWidget,
	type Widget,
	type BuildContext,
	LayoutBuilder,
} from "flitter-core";
import { GaugeChartProvider } from "./provider";

class GaugeChart extends StatelessWidget {
	override build(_: BuildContext): Widget {
		return new SizeTracker();
	}
}

export default GaugeChart;

class SizeTracker extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = GaugeChartProvider.of(context);
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
		const ctx = GaugeChartProvider.of(context);
		return ctx.custom.layout(
			{
				title: new TitleWidget(),
				gauge: new GaugeWidget(),
				valueLabel: new ValueLabelWidget(),
			},
			ctx,
		);
	}
}

class TitleWidget extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = GaugeChartProvider.of(context);
		return ctx.custom.title(undefined, ctx);
	}
}

class GaugeWidget extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = GaugeChartProvider.of(context);
		return ctx.custom.gauge(
			{
				needle: new NeedleWidget(),
				scale: new ScaleWidget(),
			},
			ctx,
		);
	}
}

class NeedleWidget extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = GaugeChartProvider.of(context);
		return ctx.custom.needle(
			{
				value: ctx.value,
				ratio: ctx.ratio,
				angle: ctx.angleForValue(ctx.value),
			},
			ctx,
		);
	}
}

class ValueLabelWidget extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = GaugeChartProvider.of(context);
		return ctx.custom.valueLabel(
			{
				value: ctx.value,
				min: ctx.min,
				max: ctx.max,
				ratio: ctx.ratio,
			},
			ctx,
		);
	}
}

class ScaleWidget extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = GaugeChartProvider.of(context);
		return ctx.custom.scale(
			{
				min: ctx.min,
				max: ctx.max,
				zones: ctx.zones,
			},
			ctx,
		);
	}
}
