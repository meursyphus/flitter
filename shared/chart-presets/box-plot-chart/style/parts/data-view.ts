import {
	AnimatedOpacity,
	AnimatedPositioned,
	ConstraintsTransformBox,
	Curves,
	FractionalTranslation,
	GestureDetector,
	Offset,
	Positioned,
	SizedBox,
	Stack,
	StackFit,
	State,
	StatefulWidget,
	ZIndex,
	type Widget,
} from "flitter-core";
import type { BoxPlotChartCustom } from "flitter-ui/chart";
import type { AgBoxPlotChartConfig } from "../config";
import { DataView } from "../../base/data-view";
import { agTooltipContent } from "../../../_styles/ag/index";

const TOOLTIP_OFFSET = 12;
const ANIMATION_DURATION = 150;
const FADE_DURATION = 100;
const MOUSE_THRESHOLD = 3;

type TooltipItem = {
	legend: string;
	color: string;
	value: number;
};

type TooltipData = {
	label: string;
	items: TooltipItem | TooltipItem[];
};

class AgBoxPlotTooltipOverlay extends StatefulWidget {
	child: Widget;
	chartContext: Parameters<BoxPlotChartCustom<AgBoxPlotChartConfig>["dataView"]>[1];

	constructor({
		child,
		chartContext,
	}: {
		child: Widget;
		chartContext: Parameters<BoxPlotChartCustom<AgBoxPlotChartConfig>["dataView"]>[1];
	}) {
		super();
		this.child = child;
		this.chartContext = chartContext;
	}

	createState() {
		return new _AgBoxPlotTooltipOverlayState();
	}
}

class _AgBoxPlotTooltipOverlayState extends State<AgBoxPlotTooltipOverlay> {
	mouseX = 0;
	mouseY = 0;
	wasVisible = false;
	lastTooltipData: TooltipData | null = null;

	private getLocalPosition(e: MouseEvent): { x: number; y: number } {
		const ro = this.element.renderObject;
		const view = ro.renderOwner.renderContext.view;
		const rect = view.getBoundingClientRect();
		const flitterGlobalX = e.clientX - rect.left;
		const flitterGlobalY = e.clientY - rect.top;
		const overlayGlobal = ro.localToGlobal();
		return {
			x: flitterGlobalX - overlayGlobal.x,
			y: flitterGlobalY - overlayGlobal.y,
		};
	}

	override build(): Widget {
		const ctx = this.widget.chartContext;
		const { hoveredBoxPlot, config } = ctx;

		let tooltipData: TooltipData | null = null;

		if (hoveredBoxPlot != null) {
			const { index, legend, kind, value } = hoveredBoxPlot;
			const dataset = ctx.data.datasets.find((d) => d.legend === legend);
			const legendIndex = ctx.legends.indexOf(legend);
			const color = config.colors.fills[legendIndex % config.colors.fills.length];
			const label = ctx.data.labels[index] ?? "";

			if (kind === "outlier" && value != null) {
				tooltipData = {
					label,
					items: { legend: `${legend} outlier`, color, value },
				};
			} else if (dataset != null && index < dataset.data.length) {
				const point = dataset.data[index];
				tooltipData = {
					label,
					items: [
						{ legend: `${legend} min`, color: "#333", value: point.min },
						{ legend: `${legend} q1`, color, value: point.q1 },
						{
							legend: `${legend} median`,
							color: "#E74C3C",
							value: point.median,
						},
						{ legend: `${legend} q3`, color, value: point.q3 },
						{ legend: `${legend} max`, color: "#333", value: point.max },
					],
				};
			}
		}

		if (tooltipData != null) {
			this.lastTooltipData = tooltipData;
		}

		const isVisible = tooltipData != null;
		const positionDuration =
			!this.wasVisible && isVisible ? 0 : ANIMATION_DURATION;
		this.wasVisible = isVisible;
		const showData = this.lastTooltipData;

		const children: Widget[] = [
			this.widget.child,
			Positioned.fill({
				child: GestureDetector({
					behavior: "translucent",
					cursor: "default",
					onMouseMove: (e: MouseEvent) => {
						const local = this.getLocalPosition(e);
						const dx = local.x - this.mouseX;
						const dy = local.y - this.mouseY;
						if (dx * dx + dy * dy < MOUSE_THRESHOLD * MOUSE_THRESHOLD) return;
						this.setState(() => {
							this.mouseX = local.x;
							this.mouseY = local.y;
						});
					},
					onMouseLeave: () => {
						ctx.unhoverBoxPlot();
					},
					child: SizedBox.expand(),
				}),
			}),
		];

		if (showData != null) {
			children.push(
				AnimatedPositioned({
					duration: positionDuration,
					curve: Curves.easeOut,
					left: this.mouseX,
					top: this.mouseY - TOOLTIP_OFFSET,
					child: AnimatedOpacity({
						duration: FADE_DURATION,
						opacity: isVisible ? 1 : 0,
						curve: Curves.easeOut,
						child: FractionalTranslation({
							translation: new Offset({ x: -0.5, y: -1 }),
							child: ConstraintsTransformBox({
								constraintsTransform:
									ConstraintsTransformBox.unconstrained,
								child: ZIndex({
									zIndex: 9999,
									child: agTooltipContent({
										label: showData.label,
										items: showData.items,
										config,
									}),
								}),
							}),
						}),
					}),
				}),
			);
		}

		return Stack({
			fit: StackFit.passthrough,
			clipped: false,
			children,
		});
	}
}

export function agDataView(
	...[args, context]: Parameters<BoxPlotChartCustom<AgBoxPlotChartConfig>["dataView"]>
): Widget {
	const child = DataView(args, context);
	if (!context.config.tooltip.enabled) return child;
	return new AgBoxPlotTooltipOverlay({ child, chartContext: context });
}
