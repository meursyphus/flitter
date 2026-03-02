import {
	CustomPaint,
	Path,
	Offset,
	Radius,
	StatefulWidget,
	State,
	GestureDetector,
	Tooltip,
	ZIndex,
	EdgeInsets,
	Padding,
	type Widget,
} from "flitter-core";
import type { PieChartCustom, PieChartContext } from "@headless/pie-chart/types";
import type { ToastPieChartConfig } from "../config";
import { tooltipContent } from "@styles/toast";

function createPieSlice(
	color: string,
	pieConfig: ToastPieChartConfig["pie"],
	sweepAngle: number,
	hovered: boolean,
): Widget {
	return CustomPaint({
		painter: {
			svg: {
				createDefaultSvgEl: (context) => ({
					slice: context.createSvgEl("path"),
				}),
				paint: ({ slice }, size) => {
					const cx = size.width / 2;
					const cy = size.height / 2;
					const radius = Math.min(cx, cy);
					const innerRadius = radius * pieConfig.innerRadiusRatio;
					const path = createSlicePath(cx, cy, radius, innerRadius, sweepAngle);
					slice.setAttribute("d", path.getD());
					slice.setAttribute("fill", color);
					if (hovered) {
						slice.setAttribute("stroke", "white");
						slice.setAttribute("stroke-width", "4");
						slice.setAttribute("filter", "drop-shadow(0 0 8px rgba(0,0,0,0.3))");
					} else {
						slice.setAttribute("stroke", pieConfig.strokeColor);
						slice.setAttribute("stroke-width", String(pieConfig.strokeWidth));
						slice.removeAttribute("filter");
					}
				},
			},
			canvas: {
				paint: (context, size) => {
					const cx = size.width / 2;
					const cy = size.height / 2;
					const radius = Math.min(cx, cy);
					const innerRadius = radius * pieConfig.innerRadiusRatio;
					const path = createSlicePath(cx, cy, radius, innerRadius, sweepAngle);
					const canvasPath = path.toCanvasPath();
					context.canvas.fillStyle = color;
					context.canvas.fill(canvasPath);
					if (hovered) {
						context.canvas.save();
						context.canvas.shadowColor = "rgba(0,0,0,0.3)";
						context.canvas.shadowBlur = 8;
						context.canvas.strokeStyle = "white";
						context.canvas.lineWidth = 4;
						context.canvas.stroke(canvasPath);
						context.canvas.restore();
					} else {
						context.canvas.strokeStyle = pieConfig.strokeColor;
						context.canvas.lineWidth = pieConfig.strokeWidth;
						context.canvas.stroke(canvasPath);
					}
				},
			},
		},
	});
}

class _HoverablePieSlice extends StatefulWidget {
	color: string;
	pieConfig: ToastPieChartConfig["pie"];
	sweepAngle: number;
	tooltip: Widget;

	constructor({
		color,
		pieConfig,
		sweepAngle,
		tooltip,
	}: {
		color: string;
		pieConfig: ToastPieChartConfig["pie"];
		sweepAngle: number;
		tooltip: Widget;
	}) {
		super();
		this.color = color;
		this.pieConfig = pieConfig;
		this.sweepAngle = sweepAngle;
		this.tooltip = tooltip;
	}

	createState() {
		return new _HoverablePieSliceState();
	}
}

class _HoverablePieSliceState extends State<_HoverablePieSlice> {
	hovered = false;

	override build() {
		const { color, pieConfig, sweepAngle, tooltip } = this.widget;
		const slice = createPieSlice(color, pieConfig, sweepAngle, this.hovered);

		const child = GestureDetector({
			behavior: "opaque",
			cursor: "default",
			child: slice,
			onMouseEnter: () => {
				this.setState(() => {
					this.hovered = true;
				});
			},
			onMouseLeave: () => {
				this.setState(() => {
					this.hovered = false;
				});
			},
		});

		if (!this.hovered) return child;

		return ZIndex({
			zIndex: 9999,
			child: Tooltip({
				position: "topCenter",
				translation: new Offset({ x: 0, y: -1 }),
				tooltip: Padding({
					padding: EdgeInsets.only({ bottom: 4 }),
					child: tooltip,
				}),
				child,
			}),
		});
	}
}

export function toastPie(
	...[{ index, name, value, percentage, sweepAngle }, ctx]: Parameters<PieChartCustom<ToastPieChartConfig>["pie"]>
): Widget {
	const { colors, pie: pieConfig } = ctx.config;
	const color = colors[index % colors.length];

	if (!ctx.config.tooltip.enabled) {
		return createPieSlice(color, pieConfig, sweepAngle, false);
	}

	return new _HoverablePieSlice({
		color,
		pieConfig,
		sweepAngle,
		tooltip: tooltipContent({
			label: name,
			items: { legend: name, color, value },
			config: ctx.config,
		}),
	});
}

function createSlicePath(
	cx: number,
	cy: number,
	outerRadius: number,
	innerRadius: number,
	sweepAngle: number,
): Path {
	const path = new Path();

	// 12시 방향(위)부터 시작, 시계방향
	const startAngle = -Math.PI / 2;
	const endAngle = startAngle + sweepAngle;

	const outerStart = new Offset({
		x: cx + outerRadius * Math.cos(startAngle),
		y: cy + outerRadius * Math.sin(startAngle),
	});
	const outerEnd = new Offset({
		x: cx + outerRadius * Math.cos(endAngle),
		y: cy + outerRadius * Math.sin(endAngle),
	});

	if (innerRadius > 0) {
		// Donut shape
		const innerStart = new Offset({
			x: cx + innerRadius * Math.cos(startAngle),
			y: cy + innerRadius * Math.sin(startAngle),
		});
		const innerEnd = new Offset({
			x: cx + innerRadius * Math.cos(endAngle),
			y: cy + innerRadius * Math.sin(endAngle),
		});

		path.moveTo(outerStart);
		path.arcToPoint({
			endPoint: outerEnd,
			radius: Radius.circular(outerRadius),
			rotation: 0,
			largeArc: sweepAngle > Math.PI,
			clockwise: true,
		});
		path.lineTo(innerEnd);
		path.arcToPoint({
			endPoint: innerStart,
			radius: Radius.circular(innerRadius),
			rotation: 0,
			largeArc: sweepAngle > Math.PI,
			clockwise: false,
		});
		path.close();
	} else {
		// Full pie slice
		path.moveTo(new Offset({ x: cx, y: cy }));
		path.lineTo(outerStart);
		path.arcToPoint({
			endPoint: outerEnd,
			radius: Radius.circular(outerRadius),
			rotation: 0,
			largeArc: sweepAngle > Math.PI,
			clockwise: true,
		});
		path.close();
	}

	return path;
}
