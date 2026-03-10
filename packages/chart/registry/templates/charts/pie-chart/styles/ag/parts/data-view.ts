import {
	Align,
	Alignment,
	AnimatedOpacity,
	ConstraintsTransformBox,
	Curves,
	FractionalTranslation,
	Offset,
	SizedBox,
	Stack,
	StackFit,
	StatefulWidget,
	State,
	ZIndex,
	type Widget,
} from "flitter-core";
import type { PieChartCustom, PieChartContext } from "@headless/pie-chart/types";
import type { AgPieChartConfig } from "../config";
import { DataView } from "../../../base/data-view";
import { agTooltipContent } from "@styles/ag";

const FADE_DURATION = 100;

export function agDataView(
	...[args, context]: Parameters<PieChartCustom<AgPieChartConfig>["dataView"]>
): Widget {
	const child = DataView(args, context);
	if (!context.config.tooltip.enabled) return child;

	return new _AgPieTooltipOverlay({ child, args, context });
}

class _AgPieTooltipOverlay extends StatefulWidget {
	child: Widget;
	args: Parameters<PieChartCustom<AgPieChartConfig>["dataView"]>[0];
	context: PieChartContext<AgPieChartConfig>;

	constructor({
		child,
		args,
		context,
	}: {
		child: Widget;
		args: Parameters<PieChartCustom<AgPieChartConfig>["dataView"]>[0];
		context: PieChartContext<AgPieChartConfig>;
	}) {
		super();
		this.child = child;
		this.args = args;
		this.context = context;
	}

	createState() {
		return new _AgPieTooltipOverlayState();
	}
}

class _AgPieTooltipOverlayState extends State<_AgPieTooltipOverlay> {
	override build(): Widget {
		const { args, context } = this.widget;
		const { hoveredIndex, config } = context;
		const showTooltip = hoveredIndex != null && config.tooltip.enabled;

		let tooltipWidget: Widget;

		if (showTooltip && args.slices[hoveredIndex]) {
			const { startAngle, sweepAngle, name, value } = args.slices[hoveredIndex];
			const colorIndex = context.legends.indexOf(name);
			const color =
				config.colors.fills[
					(colorIndex >= 0 ? colorIndex : hoveredIndex) % config.colors.fills.length
				];

			const midAngle = -Math.PI / 2 + startAngle + sweepAngle / 2;
			const ax = Math.cos(midAngle);
			const ay = Math.sin(midAngle);

			tooltipWidget = ZIndex({
				zIndex: 99999,
				child: Align({
					alignment: new Alignment({ x: ax, y: ay }),
					child: ConstraintsTransformBox({
						constraintsTransform: ConstraintsTransformBox.unconstrained,
						alignment: new Alignment({ x: -ax, y: -ay }),
						child: FractionalTranslation({
							translation: new Offset({ x: ax * 0.15, y: ay * 0.15 }),
							child: agTooltipContent({
								label: name,
								items: { legend: "Value", color, value },
								config,
							}),
						}),
					}),
				}),
			});
		} else {
			tooltipWidget = SizedBox.shrink();
		}

		return Stack({
			fit: StackFit.expand,
			clipped: false,
			children: [this.widget.child, tooltipWidget],
		});
	}
}
