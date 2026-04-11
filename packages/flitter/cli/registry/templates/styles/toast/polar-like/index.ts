import {
	Align,
	Alignment,
	AnimatedBaseWidgetState,
	AnimationController,
	ClipPath,
	Container,
	ConstraintsTransformBox,
	CurvedAnimation,
	Curves,
	FractionalTranslation,
	ImplicitlyAnimatedWidget,
	LayoutBuilder,
	Offset,
	Path,
	Positioned,
	Radius,
	SizedBox,
	Stack,
	StackFit,
	State,
	StatefulWidget,
	Text,
	TextAlign,
	TextStyle,
	Tween,
	ZIndex,
	type Data,
	type Nullable,
	type Widget,
} from "flitter-core";
import { DataView, Segment } from "../../../shared/pie-like";
import { tooltipContent } from "../tooltip";

const TOAST_SEGMENT_PADDING = 0;

type ToastPieLikeConfig = {
	animation: {
		enabled: boolean;
		duration: number;
	};
	colors: string[];
	font: { family: string };
	pie: {
		innerRadiusRatio: number;
	};
	radial: {
		visible: boolean;
		gap: number;
	};
	dataLabel: {
		visible: boolean;
		fontSize: number;
		fontColor: string;
		fontFamily?: string;
		fontWeight?: string;
		radiusRatio: number;
		formatter: (args: any) => string;
	};
	radialLabel: {
		fontSize: number;
		fontColor: string;
		fontFamily?: string;
		fontWeight?: string;
		formatter: (args: any) => string;
	};
	radialTick: {
		length: number;
		color: string;
		strokeWidth: number;
	};
	tooltip: {
		enabled: boolean;
	};
};

type PieLikeSegmentArgs = {
	index: number;
	name: string;
	value: number;
	percentage: number;
	startAngle: number;
	sweepAngle: number;
	dataLabel: Widget;
	isHovered: boolean;
};

type PieLikeRadialArgs = {
	index: number;
	name: string;
	value: number;
	percentage: number;
	angle: number;
	isHovered: boolean;
};

type PieLikeTooltipArgs = {
	index: number;
	name: string;
	value: number;
	percentage: number;
	startAngle: number;
	sweepAngle: number;
	midAngle: number;
	anchorX: number;
	anchorY: number;
	directionX: number;
	directionY: number;
};

class AnimatedPieLikeEntrance extends StatefulWidget {
	child: Widget;
	duration: number;

	constructor({ child, duration }: { child: Widget; duration: number }) {
		super();
		this.child = child;
		this.duration = duration;
	}

	createState() {
		return new AnimatedPieLikeEntranceState();
	}
}

class AnimatedPieLikeEntranceState extends State<AnimatedPieLikeEntrance> {
	controller!: AnimationController;
	tween!: { value: number };

	override initState() {
		this.controller = new AnimationController({
			duration: this.widget.duration,
		});
		this.controller.addListener(() => this.setState());
		this.tween = new Tween({ begin: 0, end: 1 }).animated(
			new CurvedAnimation({
				parent: this.controller,
				curve: Curves.easeInOut,
			}),
		);
		this.controller.forward();
	}

	override dispose() {
		this.controller.dispose();
	}

	override build() {
		const t = this.tween.value;
		const done = t >= 1;

		return ClipPath({
			clipped: !done,
			clipper: (size) => {
				const cx = size.width / 2;
				const cy = size.height / 2;
				const radius = Math.max(size.width, size.height);
				const sweepAngle = t * Math.PI * 2;

				const path = new Path();
				path.moveTo(new Offset({ x: cx, y: cy }));
				path.lineTo(new Offset({ x: cx, y: cy - radius }));
				if (sweepAngle > 0) {
					const startAngle = -Math.PI / 2;
					const endAngle = startAngle + sweepAngle;
					const endX = cx + radius * Math.cos(endAngle);
					const endY = cy + radius * Math.sin(endAngle);
					path.arcToPoint({
						endPoint: new Offset({ x: endX, y: endY }),
						radius: Radius.circular(radius),
						rotation: 0,
						largeArc: sweepAngle > Math.PI,
						clockwise: true,
					});
				}
				path.close();
				return path;
			},
			child: this.widget.child,
		});
	}
}

class AnimatedToastSegment extends ImplicitlyAnimatedWidget {
	args: PieLikeSegmentArgs;
	context: {
		config: ToastPieLikeConfig;
		legends: string[];
	};

	constructor({
		args,
		context,
		duration,
	}: {
		args: PieLikeSegmentArgs;
		context: {
			config: ToastPieLikeConfig;
			legends: string[];
		};
		duration: number;
	}) {
		super({
			duration,
			curve: Curves.easeInOut,
		});
		this.args = args;
		this.context = context;
	}

	createState(): AnimatedBaseWidgetState<AnimatedToastSegment> {
		return new AnimatedToastSegmentState();
	}
}

class AnimatedToastSegmentState extends AnimatedBaseWidgetState<AnimatedToastSegment> {
	private startAngleTween: Tween<number> | Nullable = null;
	private sweepAngleTween: Tween<number> | Nullable = null;

	forEachTween(
		visitor: <V extends number | Data, T extends Tween<V>>(props: {
			tween: T;
			targetValue: V;
			constructor: (value: V) => T;
		}) => T,
	): void {
		this.startAngleTween = visitor({
			tween: this.startAngleTween as Tween<number>,
			targetValue: this.widget.args.startAngle,
			constructor: (value) => new Tween({ begin: value }),
		}) as Tween<number>;
		this.sweepAngleTween = visitor({
			tween: this.sweepAngleTween as Tween<number>,
			targetValue: this.widget.args.sweepAngle,
			constructor: (value) => new Tween({ begin: value }),
		}) as Tween<number>;
	}

	build(): Widget {
		const { args, context } = this.widget;
		const { colors, pie: pieConfig } = context.config;
		const colorIndex = context.legends.indexOf(args.name);
		const color = colors[(colorIndex >= 0 ? colorIndex : args.index) % colors.length];
		const hovered = args.isHovered;
		const startAngle = this.startAngleTween?.evaluate(this.animation) ?? args.startAngle;
		const sweepAngle = this.sweepAngleTween?.evaluate(this.animation) ?? args.sweepAngle;

		const segment = Segment({
			startAngle,
			sweepAngle,
			innerRadiusRatio: pieConfig.innerRadiusRatio,
			padding: TOAST_SEGMENT_PADDING,
			fill: color,
			strokeColor: hovered ? "white" : "transparent",
			strokeWidth: hovered ? 4 : 0,
			svgFilter: hovered ? "drop-shadow(0 0 8px rgba(0,0,0,0.3))" : undefined,
		});

		return ZIndex({
			zIndex: hovered ? 9999 : 0,
			child: Stack({
				fit: StackFit.expand,
				clipped: false,
				children: [segment, args.dataLabel],
			}),
		});
	}
}

export function toastPieLikeDataView(
	args: { segments: { widget: Widget }[]; dataCenter?: Widget },
	context: { config: ToastPieLikeConfig },
): Widget {
	const child = DataView({
		items: args.segments,
		overlay: args.dataCenter ?? null,
	});

	if (!context.config.animation.enabled) {
		return child;
	}

	return new AnimatedPieLikeEntrance({
		child,
		duration: context.config.animation.duration,
	});
}

export function toastPieLikeSegment(
	args: PieLikeSegmentArgs,
	context: {
		config: ToastPieLikeConfig;
		legends: string[];
	},
): Widget {
	const duration = context.config.animation.enabled ? context.config.animation.duration : 0;

	return new AnimatedToastSegment({
		args,
		context,
		duration,
	});
}

export function toastPieLikeDataLabel(
	args: Omit<PieLikeSegmentArgs, "dataLabel" | "isHovered">,
	context: { config: ToastPieLikeConfig },
): Widget {
	const { dataLabel: labelConfig, pie: pieConfig, font } = context.config;
	const { startAngle, sweepAngle } = args;

	if (!labelConfig.visible) return SizedBox.shrink();

	const text = labelConfig.formatter(args);
	const midAngle = -Math.PI / 2 + startAngle + sweepAngle / 2;

	return LayoutBuilder({
		builder: (_buildContext, constraints) => {
			const width = constraints.maxWidth;
			const height = constraints.maxHeight;
			if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
				return SizedBox.shrink();
			}

			const cxPx = width / 2;
			const cyPx = height / 2;
			const outerRadius = Math.min(cxPx, cyPx);
			const innerRadius = outerRadius * pieConfig.innerRadiusRatio;
			const effectiveRadius = innerRadius > 0
				? innerRadius + (outerRadius - innerRadius) * labelConfig.radiusRatio
				: outerRadius * labelConfig.radiusRatio;
			const labelX = cxPx + effectiveRadius * Math.cos(midAngle);
			const labelY = cyPx + effectiveRadius * Math.sin(midAngle);

			return Stack({
				fit: StackFit.expand,
				children: [
					Positioned({
						left: labelX,
						top: labelY,
						child: ConstraintsTransformBox({
							constraintsTransform: ConstraintsTransformBox.unconstrained,
							child: FractionalTranslation({
								translation: new Offset({ x: -0.5, y: -0.5 }),
								child: Text(text, {
									textAlign: TextAlign.center,
									style: new TextStyle({
										fontFamily: labelConfig.fontFamily ?? font.family,
										fontSize: labelConfig.fontSize,
										fontWeight: labelConfig.fontWeight,
										color: labelConfig.fontColor,
									}),
								}),
							}),
						}),
					}),
				],
			});
		},
	});
}

export function toastPieLikeRadialLabel(
	args: PieLikeRadialArgs,
	context: { config: ToastPieLikeConfig; legends: string[] },
): Widget {
	const { radial, radialLabel, font, colors } = context.config;

	if (!radial.visible) return SizedBox.shrink();

	const isRightSide = Math.cos(args.angle) >= 0;
	const colorIndex = context.legends.indexOf(args.name);
	const seriesColor =
		colors[(colorIndex >= 0 ? colorIndex : args.index) % colors.length]
		?? radialLabel.fontColor;

	return Text(radialLabel.formatter(args), {
		textAlign: isRightSide ? TextAlign.left : TextAlign.right,
		style: new TextStyle({
			fontFamily: radialLabel.fontFamily ?? font.family,
			fontSize: radialLabel.fontSize,
			fontWeight: radialLabel.fontWeight,
			color: seriesColor,
		}),
	});
}

export function toastPieLikeRadialTick(
	args: PieLikeRadialArgs,
	context: { config: ToastPieLikeConfig; legends: string[] },
): Widget {
	const { radial, radialTick, colors } = context.config;

	if (!radial.visible || radialTick.length <= 0) {
		return SizedBox.shrink();
	}

	const colorIndex = context.legends.indexOf(args.name);
	const seriesColor =
		colors[(colorIndex >= 0 ? colorIndex : args.index) % colors.length]
		?? radialTick.color;

	return SizedBox({
		width: radialTick.strokeWidth,
		height: radialTick.length,
		child: Container({
			color: seriesColor,
		}),
	});
}

export function toastPieLikeTooltip(
	args: PieLikeTooltipArgs,
	context: { config: ToastPieLikeConfig; legends: string[] },
) {
	const colorIndex = context.legends.indexOf(args.name);
	const color =
		context.config.colors[
			(colorIndex >= 0 ? colorIndex : args.index) % context.config.colors.length
		];

	return tooltipContent({
		label: args.name,
		items: {
			legend: args.name,
			color,
			value: args.value,
		},
		config: context.config as any,
	});
}

export function toastPieLikeTooltipArea(
	args: { tooltip: Widget | null; hoveredSegment: PieLikeTooltipArgs | null },
	context: { config: ToastPieLikeConfig },
): Widget {
	if (!context.config.tooltip.enabled || args.tooltip == null || args.hoveredSegment == null) {
		return SizedBox.shrink();
	}

	const ax = args.hoveredSegment.directionX;
	const ay = args.hoveredSegment.directionY;

	return Stack({
		fit: StackFit.expand,
		clipped: false,
		children: [
			ZIndex({
				zIndex: 99999,
				child: Align({
					alignment: new Alignment({ x: ax, y: ay }),
					child: ConstraintsTransformBox({
						constraintsTransform: ConstraintsTransformBox.unconstrained,
						alignment: new Alignment({ x: -ax, y: -ay }),
						child: FractionalTranslation({
							translation: new Offset({ x: ax * 0.15, y: ay * 0.15 }),
							child: args.tooltip,
						}),
					}),
				}),
			}),
		],
	});
}
