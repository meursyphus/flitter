import {
	StatefulWidget,
	State,
	Container,
	Padding,
	EdgeInsets,
	BoxDecoration,
	Border,
	BoxShadow,
	GestureDetector,
	Tooltip,
	ZIndex,
	Offset,
	type Widget,
	type TooltipPosition,
} from "flitter-core";
import type { HeatmapContext } from "@headless/heatmap-chart/types";
import { HeatmapChartProvider } from "@headless/heatmap-chart/provider";
import type { ToastHeatmapChartConfig } from "../config";
import { tooltipContent } from "@styles/toast";

export function interpolateColor(
	colorRange: [string, string, string],
	t: number,
): string {
	const clamp = Math.max(0, Math.min(1, t));
	const hex = (c: string) => {
		const h = c.replace("#", "");
		return [
			parseInt(h.slice(0, 2), 16),
			parseInt(h.slice(2, 4), 16),
			parseInt(h.slice(4, 6), 16),
		];
	};
	const [r0, g0, b0] = hex(colorRange[0]);
	const [r1, g1, b1] = hex(colorRange[1]);
	const [r2, g2, b2] = hex(colorRange[2]);

	let r: number, g: number, b: number;
	if (clamp <= 0.5) {
		const local = clamp * 2;
		r = r0 + (r1 - r0) * local;
		g = g0 + (g1 - g0) * local;
		b = b0 + (b1 - b0) * local;
	} else {
		const local = (clamp - 0.5) * 2;
		r = r1 + (r2 - r1) * local;
		g = g1 + (g2 - g1) * local;
		b = b1 + (b2 - b1) * local;
	}

	const toHex = (n: number) =>
		Math.round(n).toString(16).padStart(2, "0");
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

const TOOLTIP_GAP = 4;
const ESTIMATED_TOOLTIP_WIDTH = 220;
const ESTIMATED_TOOLTIP_HEIGHT = 80;

type TooltipLayout = {
	position: TooltipPosition;
	offset: Offset;
	translation: Offset;
	padding: EdgeInsets;
};

function computeTooltipLayout({
	segmentGlobal,
	segmentSize,
	plotGlobal,
	chartWidth,
	chartHeight,
}: {
	segmentGlobal: { x: number; y: number };
	segmentSize: { width: number; height: number };
	plotGlobal: { x: number; y: number };
	chartWidth: number;
	chartHeight: number;
}): TooltipLayout {
	const localX = segmentGlobal.x - plotGlobal.x;
	const localY = segmentGlobal.y - plotGlobal.y;
	const spaceRight = chartWidth - (localX + segmentSize.width);
	const spaceBottom = chartHeight - (localY + segmentSize.height);

	const fitsRight = spaceRight >= ESTIMATED_TOOLTIP_WIDTH + TOOLTIP_GAP;
	const fitsBottom = spaceBottom >= ESTIMATED_TOOLTIP_HEIGHT;

	if (fitsRight) {
		return {
			position: fitsBottom ? "topRight" : "bottomRight",
			translation: new Offset({ x: 1, y: 0 }),
			offset: Offset.Constants.zero,
			padding: EdgeInsets.only({ left: TOOLTIP_GAP }),
		};
	}
	return {
		position: fitsBottom ? "topLeft" : "bottomLeft",
		translation: new Offset({ x: -1, y: 0 }),
		offset: Offset.Constants.zero,
		padding: EdgeInsets.only({ right: TOOLTIP_GAP }),
	};
}

class _HoverableSegment extends StatefulWidget {
	color: string;
	gap: number;
	value: number;
	xIndex: number;
	yIndex: number;
	xLabel: string;
	yLabel: string;
	tooltip: Widget;
	chartWidth: number;
	chartHeight: number;

	constructor(props: {
		color: string;
		gap: number;
		value: number;
		xIndex: number;
		yIndex: number;
		xLabel: string;
		yLabel: string;
		tooltip: Widget;
		chartWidth: number;
		chartHeight: number;
	}) {
		super();
		this.color = props.color;
		this.gap = props.gap;
		this.value = props.value;
		this.xIndex = props.xIndex;
		this.yIndex = props.yIndex;
		this.xLabel = props.xLabel;
		this.yLabel = props.yLabel;
		this.tooltip = props.tooltip;
		this.chartWidth = props.chartWidth;
		this.chartHeight = props.chartHeight;
	}

	createState() {
		return new _HoverableSegmentState();
	}
}

class _HoverableSegmentState extends State<_HoverableSegment> {
	hovered = false;
	tooltipLayout: TooltipLayout | null = null;

	private findPlotGlobal(): { x: number; y: number } | null {
		const { chartWidth, chartHeight } = this.widget;
		let node = this.element.renderObject.parent;
		while (node) {
			const s = node.size;
			if (
				s &&
				Math.abs(s.width - chartWidth) < 1 &&
				Math.abs(s.height - chartHeight) < 1
			) {
				return node.localToGlobal();
			}
			node = node.parent;
		}
		return null;
	}

	private computeLayout() {
		const renderObject = this.element.renderObject;
		const segmentGlobal = renderObject.localToGlobal();
		const segmentSize = renderObject.size;
		const { chartWidth, chartHeight } = this.widget;

		const plotGlobal = this.findPlotGlobal();
		if (!plotGlobal) return;

		this.tooltipLayout = computeTooltipLayout({
			segmentGlobal,
			segmentSize,
			plotGlobal,
			chartWidth,
			chartHeight,
		});
	}

	override build() {
		const { color, gap, tooltip, value, xIndex, yIndex, xLabel, yLabel } = this.widget;

		const decoration = this.hovered
			? new BoxDecoration({
				color,
				border: Border.all({ color: "white", width: 4, strokeAlign: 1 }),
				boxShadow: [
					new BoxShadow({ color: "rgba(0,0,0,0.3)", blurRadius: 8 }),
				],
			})
			: new BoxDecoration({ color });

		const layout = this.tooltipLayout;

		const segment = Tooltip({
			position: layout?.position ?? "topRight",
			offset: layout?.offset ?? Offset.Constants.zero,
			translation: layout?.translation,
			tooltip: ZIndex({
				zIndex: 9999,
				child: Padding({
					padding: layout?.padding ?? EdgeInsets.only({ left: TOOLTIP_GAP }),
					child: tooltip,
				}),
			}),
			child: GestureDetector({
				cursor: "default",
				child: Container({
					margin: EdgeInsets.all(gap),
					decoration,
				}),
				onMouseEnter: () => {
					this.computeLayout();
					const ctx = HeatmapChartProvider.of(this.element);
					ctx.setHovered({ value, xIndex, yIndex, xLabel, yLabel });
					this.setState(() => {
						this.hovered = true;
					});
				},
				onMouseLeave: () => {
					this.setState(() => {
						this.hovered = false;
					});
				},
			}),
		});

		return ZIndex({
			zIndex: this.hovered ? 1 : 0,
			child: segment,
		});
	}
}

export function toastSegment(
	{ value, xIndex, yIndex }: { value: number; xIndex: number; yIndex: number },
	context: HeatmapContext<ToastHeatmapChartConfig>,
): Widget {
	const { heatmap: heatmapConfig } = context.config;
	const { min, max } = context.scale;
	const range = max - min;
	const t = range === 0 ? 0.5 : (value - min) / range;
	const color = interpolateColor(heatmapConfig.colorRange, t);

	const xLabel = context.data.xLabels[xIndex] ?? `${xIndex}`;
	const yLabel = context.data.yLabels[yIndex] ?? `${yIndex}`;

	if (!context.config.tooltip.enabled) {
		return ZIndex({
			zIndex: 0,
			child: Container({
				margin: EdgeInsets.all(heatmapConfig.segment.gap),
				decoration: new BoxDecoration({ color }),
			}),
		});
	}

	return new _HoverableSegment({
		color,
		gap: heatmapConfig.segment.gap,
		value,
		xIndex,
		yIndex,
		xLabel,
		yLabel,
		tooltip: tooltipContent({
			label: `${xLabel}, ${yLabel}`,
			items: { legend: "Value", color, value },
			config: context.config,
		}),
		chartWidth: context.width,
		chartHeight: context.height,
	});
}
