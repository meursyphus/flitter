import {
	StatefulWidget,
	State,
	Container,
	Padding,
	EdgeInsets,
	BoxDecoration,
	Border,
	BoxShadow,
	ZIndex,
	Offset,
	type Widget,
	type TooltipPosition,
} from "flitter-core";
import Tooltip from "flitter-core/component/Tooltip";
import type { HeatmapContext } from "flitter-ui/chart";
import type { ToastHeatmapChartConfig } from "../config";

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

/**
 * Lightweight StatefulWidget solely for tooltip positioning.
 * Hover state is managed by headless; this only computes layout
 * when isHovered becomes true.
 */
class _TooltipPositioner extends StatefulWidget {
	segmentWidget: Widget;
	tooltipWidget: Widget;
	chartWidth: number;
	chartHeight: number;
	isHovered: boolean;

	constructor(props: {
		segmentWidget: Widget;
		tooltipWidget: Widget;
		chartWidth: number;
		chartHeight: number;
		isHovered: boolean;
	}) {
		super();
		this.segmentWidget = props.segmentWidget;
		this.tooltipWidget = props.tooltipWidget;
		this.chartWidth = props.chartWidth;
		this.chartHeight = props.chartHeight;
		this.isHovered = props.isHovered;
	}

	createState() {
		return new _TooltipPositionerState();
	}
}

class _TooltipPositionerState extends State<_TooltipPositioner> {
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
		const { isHovered, tooltipWidget } = this.widget;

		if (isHovered) {
			this.computeLayout();
		}

		const layout = this.tooltipLayout;

		if (!isHovered) {
			return this.widget.segmentWidget;
		}

		return Tooltip({
			position: layout?.position ?? "topRight",
			offset: layout?.offset ?? Offset.Constants.zero,
			translation: layout?.translation,
			tooltip: ZIndex({
				zIndex: 9999,
				child: Padding({
					padding: layout?.padding ?? EdgeInsets.only({ left: TOOLTIP_GAP }),
					child: tooltipWidget,
				}),
			}),
			child: this.widget.segmentWidget,
		});
	}
}

export function toastSegment(
	{ value, xIndex, yIndex, isHovered }: { value: number; xIndex: number; yIndex: number; isHovered: boolean },
	context: HeatmapContext<ToastHeatmapChartConfig>,
): Widget {
	const { heatmap: heatmapConfig } = context.config;
	const { min, max } = context.scale;
	const range = max - min;
	const t = range === 0 ? 0.5 : (value - min) / range;
	const color = interpolateColor(heatmapConfig.colorRange, t);

	const xLabel = context.data.xLabels[xIndex] ?? `${xIndex}`;
	const yLabel = context.data.yLabels[yIndex] ?? `${yIndex}`;

	const decoration = isHovered
		? new BoxDecoration({
			color,
			border: Border.all({ color: "white", width: 4, strokeAlign: 1 }),
			boxShadow: [
				new BoxShadow({ color: "rgba(0,0,0,0.3)", blurRadius: 8 }),
			],
		})
		: new BoxDecoration({ color });

	const segmentWidget = ZIndex({
		zIndex: isHovered ? 1 : 0,
		child: Container({
			margin: EdgeInsets.all(heatmapConfig.segment.gap),
			decoration,
		}),
	});

	if (!context.config.tooltip.enabled) {
		return segmentWidget;
	}

	const tooltipWidget = context.custom.tooltip(
		{ label: `${xLabel}, ${yLabel}`, items: [{ legend: "Value", color, value }] },
		context,
	);

	return new _TooltipPositioner({
		segmentWidget,
		tooltipWidget,
		chartWidth: context.width,
		chartHeight: context.height,
		isHovered,
	});
}
