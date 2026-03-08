import {
	StatefulWidget,
	State,
	CustomPaint,
	Column,
	Row,
	Text,
	TextStyle,
	SizedBox,
	Container,
	EdgeInsets,
	BoxDecoration,
	BorderRadius,
	Radius,
	Size,
	LayoutBuilder,
	MainAxisAlignment,
	MainAxisSize,
	CrossAxisAlignment,
	Stack,
	Positioned,
	FractionalTranslation,
	type Widget,
	type BuildContext,
} from "flitter-core";
import type { HeatmapContext } from "../../../../_flitter/headless/heatmap-chart";
import type { HeatmapController } from "../../../../_flitter/headless/heatmap-chart";
import type { ToastHeatmapChartConfig } from "../config";
import { interpolateColor } from "./segment";

const BAR_HEIGHT = 12;
const LABEL_GAP = 6;
const INDICATOR_HEIGHT = 28;
const ARROW_SIZE = 6;
const MAX_BAR_WIDTH = 360;

function generateTicks(min: number, max: number, count: number = 6): number[] {
	if (min === max) return [min];
	const step = (max - min) / (count - 1);
	const isInt = Number.isInteger(min) && Number.isInteger(max);
	return Array.from({ length: count }, (_, i) => {
		const v = min + i * step;
		return isInt ? Math.round(v) : Math.round(v * 10) / 10;
	});
}

function gradientBar(
	colorRange: [string, string, string],
	barWidth: number,
): Widget {
	return SizedBox({
		height: BAR_HEIGHT,
		child: CustomPaint({
			size: new Size({ width: barWidth, height: BAR_HEIGHT }),
			painter: {
				svg: {
					createDefaultSvgEl: (ctx) => ({
						defs: ctx.createSvgEl("defs"),
						rect: ctx.createSvgEl("rect"),
					}),
					paint: ({ defs, rect }, size) => {
						const gradId = "heatmap-legend-grad";
						defs.innerHTML =
							`<linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="0">` +
							`<stop offset="0%" stop-color="${colorRange[0]}"/>` +
							`<stop offset="50%" stop-color="${colorRange[1]}"/>` +
							`<stop offset="100%" stop-color="${colorRange[2]}"/>` +
							`</linearGradient>`;
						rect.setAttribute("x", "0");
						rect.setAttribute("y", "0");
						rect.setAttribute("width", `${size.width}`);
						rect.setAttribute("height", `${size.height}`);
						rect.setAttribute("rx", "3");
						rect.setAttribute("fill", `url(#${gradId})`);
					},
				},
				canvas: {
					paint: (context, { width, height }) => {
						const ctx2d = context.canvas;
						const grad = ctx2d.createLinearGradient(0, 0, width, 0);
						grad.addColorStop(0, colorRange[0]);
						grad.addColorStop(0.5, colorRange[1]);
						grad.addColorStop(1, colorRange[2]);
						ctx2d.fillStyle = grad;
						ctx2d.beginPath();
						ctx2d.roundRect(0, 0, width, height, 3);
						ctx2d.fill();
					},
				},
			},
		}),
	});
}

function buildTickLabels(
	ticks: number[],
	font: { family: string; size: number },
): Widget {
	const style = new TextStyle({
		fontFamily: font.family,
		fontSize: font.size,
		color: "#666666",
	});
	return Row({
		mainAxisAlignment: MainAxisAlignment.spaceBetween,
		children: ticks.map((t) => Text(`${t}`, { style })),
	});
}

function buildHoverIndicator(
	value: number,
	fraction: number,
	color: string,
	font: { family: string; size: number },
	barWidth: number,
): Widget {
	const tooltipBox = Container({
		padding: EdgeInsets.symmetric({ horizontal: 8, vertical: 4 }),
		decoration: new BoxDecoration({
			color,
			borderRadius: BorderRadius.all(Radius.circular(4)),
		}),
		child: Text(`${Number.isInteger(value) ? value : value.toFixed(1)}`, {
			style: new TextStyle({
				fontFamily: font.family,
				fontSize: 12,
				fontWeight: "bold",
				color: "white",
			}),
		}),
	});

	const arrow = SizedBox({
		width: ARROW_SIZE * 2,
		height: ARROW_SIZE,
		child: CustomPaint({
			size: new Size({ width: ARROW_SIZE * 2, height: ARROW_SIZE }),
			painter: {
				svg: {
					createDefaultSvgEl: (ctx) => ({
						path: ctx.createSvgEl("path"),
					}),
					paint: ({ path }, { width, height }) => {
						path.setAttribute(
							"d",
							`M0,0 L${width},0 L${width / 2},${height} Z`,
						);
						path.setAttribute("fill", color);
					},
				},
				canvas: {
					paint: (context, { width, height }) => {
						const c = context.canvas;
						c.fillStyle = color;
						c.beginPath();
						c.moveTo(0, 0);
						c.lineTo(width, 0);
						c.lineTo(width / 2, height);
						c.closePath();
						c.fill();
					},
				},
			},
		}),
	});

	const indicator = Column({
		mainAxisSize: MainAxisSize.min,
		crossAxisAlignment: CrossAxisAlignment.center,
		children: [tooltipBox, arrow],
	});

	return SizedBox({
		height: INDICATOR_HEIGHT,
		child: Stack({
			clipped: false,
			children: [
				Positioned({
					left: fraction * barWidth,
					top: 0,
					child: FractionalTranslation({
						translation: { x: -0.5, y: 0 },
						child: indicator,
					}),
				}),
			],
		}),
	});
}

// StatefulWidget so we can listen to hover changes without full tree rebuild
class _HeatmapLegend extends StatefulWidget {
	controller: HeatmapController;
	config: ToastHeatmapChartConfig;

	constructor({
		controller,
		config,
	}: {
		controller: HeatmapController;
		config: ToastHeatmapChartConfig;
	}) {
		super();
		this.controller = controller;
		this.config = config;
	}

	createState() {
		return new _HeatmapLegendState();
	}
}

class _HeatmapLegendState extends State<_HeatmapLegend> {
	#onHoverChange = () => {
		this.setState(() => {});
	};

	override initState(): void {
		this.widget.controller.addHoverListener(this.#onHoverChange);
	}

	override didUpdateWidget(oldWidget: _HeatmapLegend): void {
		if (oldWidget.controller !== this.widget.controller) {
			oldWidget.controller.removeHoverListener(this.#onHoverChange);
			this.widget.controller.addHoverListener(this.#onHoverChange);
		}
	}

	override dispose(): void {
		this.widget.controller.removeHoverListener(this.#onHoverChange);
	}

	override build(): Widget {
		const { controller, config } = this.widget;
		const { font, legend: legendConfig, heatmap: heatmapConfig } = config;
		const { colorRange } = heatmapConfig;
		const { min, max } = controller.scale;
		const hovered = controller.hovered;

		if (!legendConfig.visible) {
			return SizedBox.shrink();
		}

		const ticks = generateTicks(min, max);
		const range = max - min;

		return Row({
			mainAxisAlignment: MainAxisAlignment.center,
			mainAxisSize: MainAxisSize.max,
			children: [
				SizedBox({
					width: MAX_BAR_WIDTH,
					child: LayoutBuilder({
						builder: (_: BuildContext, constraints) => {
							const barWidth = constraints.maxWidth;
							const hasHover = hovered != null && range > 0;
							const fraction = hasHover
								? (hovered!.value - min) / range
								: 0;
							const indicatorColor = hasHover
								? interpolateColor(colorRange, fraction)
								: "";

							return Column({
								mainAxisSize: MainAxisSize.min,
								crossAxisAlignment: CrossAxisAlignment.stretch,
								children: [
									hasHover
										? buildHoverIndicator(
												hovered!.value,
												fraction,
												indicatorColor,
												font,
												barWidth,
											)
										: SizedBox({ height: INDICATOR_HEIGHT }),
									gradientBar(colorRange, barWidth),
									SizedBox({ height: LABEL_GAP }),
									buildTickLabels(ticks, font),
								],
							});
						},
					}),
				}),
			],
		});
	}
}

export function toastHeatmapLegend(
	_args: undefined,
	context: HeatmapContext<ToastHeatmapChartConfig>,
): Widget {
	return new _HeatmapLegend({
		controller: context as unknown as HeatmapController,
		config: context.config,
	});
}
