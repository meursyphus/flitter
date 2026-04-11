import {
	BoxDecoration,
	Column,
	ConstraintsTransformBox,
	Container,
	CrossAxisAlignment,
	FractionalTranslation,
	LayoutBuilder,
	MainAxisSize,
	Offset,
	Opacity,
	Positioned,
	SizedBox,
	Stack,
	StackFit,
	Text,
	TextAlign,
	TextStyle,
	type Widget,
} from "flitter-core";
import { DataView, Layout, Segment } from "../../../shared/pie-like";
import { tooltipContent as agTooltipContent } from "../tooltip";
import { agMouseTooltipArea } from "../cartesian/mouse-tooltip-area";

const AG_SEGMENT_PADDING = 4;

type AgPieLikeConfig = {
	background: string;
	colors: { fills: string[] };
	font: { family: string };
	title: {
		text: string;
		fontFamily?: string;
		fontSize: number;
		fontWeight?: string;
		color: string;
	};
	subtitle: {
		visible: boolean;
		text: string;
		fontFamily?: string;
		fontSize: number;
		fontWeight?: string;
		color: string;
	};
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
		nameColor?: string;
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

export function agPieLikeLayout<TConfig extends AgPieLikeConfig>(
	args: { title: Widget; legends: Widget[]; plot: Widget },
	context: { config: TConfig },
): Widget {
	return Container({
		decoration: new BoxDecoration({
			color: context.config.background,
		}),
		child: Layout(args, context as any),
	});
}

export function agPieLikeDataView(
	args: { segments: { widget: Widget }[]; dataCenter?: Widget },
): Widget {
	return DataView({
		items: args.segments,
		overlay: args.dataCenter ?? null,
	});
}

export function agPieLikeSegment<TConfig extends AgPieLikeConfig>(
	args: PieLikeSegmentArgs,
	context: {
		config: TConfig;
		legends: string[];
		hoveredIndex: number | null;
	},
): Widget {
	const { colors, pie: pieConfig } = context.config;
	const colorIndex = context.legends.indexOf(args.name);
	const fill = colors.fills[(colorIndex >= 0 ? colorIndex : args.index) % colors.fills.length];
	const strokeColor = fill;

	let opacity = 1;
	if (context.hoveredIndex != null) {
		opacity = args.isHovered ? 1 : 0.35;
	}

	const segment = Segment({
		startAngle: args.startAngle,
		sweepAngle: args.sweepAngle,
		innerRadiusRatio: pieConfig.innerRadiusRatio,
		padding: AG_SEGMENT_PADDING,
		fill,
		strokeColor,
		strokeWidth: 1,
	});

	return Opacity({
		opacity,
		child: Stack({
			fit: StackFit.expand,
			clipped: false,
			children: [segment, args.dataLabel],
		}),
	});
}

export function agPieLikeDataLabel<TConfig extends AgPieLikeConfig>(
	args: Omit<PieLikeSegmentArgs, "dataLabel" | "isHovered">,
	context: { config: TConfig },
): Widget {
	const { dataLabel: labelConfig, pie: pieConfig, font } = context.config;
	const { startAngle, sweepAngle } = args;

	if (!labelConfig.visible) return SizedBox.shrink();

	const text = labelConfig.formatter(args);
	const angle = -Math.PI / 2 + startAngle + sweepAngle / 2;

	return LayoutBuilder({
		builder: (_buildContext, constraints) => {
			const width = constraints.maxWidth;
			const height = constraints.maxHeight;
			if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
				return SizedBox.shrink();
			}

			const cx = width / 2;
			const cy = height / 2;
			const outerRadius = Math.min(cx, cy);
			const innerRadius = outerRadius * pieConfig.innerRadiusRatio;
			const effectiveRadius = innerRadius > 0
				? innerRadius + (outerRadius - innerRadius) * labelConfig.radiusRatio
				: outerRadius * labelConfig.radiusRatio;
			const labelX = cx + effectiveRadius * Math.cos(angle);
			const labelY = cy + effectiveRadius * Math.sin(angle);

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

export function agPieLikeRadialLabel<TConfig extends AgPieLikeConfig>(
	args: PieLikeRadialArgs,
	context: { config: TConfig },
): Widget {
	const { radial, radialLabel, font } = context.config;

	if (!radial.visible) return SizedBox.shrink();

	const isRightSide = Math.cos(args.angle) >= 0;
	const subtitleFontSize = Math.max(11, Math.round(radialLabel.fontSize * 0.68));

	return Column({
		mainAxisSize: MainAxisSize.min,
		crossAxisAlignment: isRightSide
			? CrossAxisAlignment.start
			: CrossAxisAlignment.end,
		children: [
			Text(radialLabel.formatter(args), {
				textAlign: isRightSide ? TextAlign.left : TextAlign.right,
				style: new TextStyle({
					fontFamily: radialLabel.fontFamily ?? font.family,
					fontSize: radialLabel.fontSize,
					fontWeight: radialLabel.fontWeight,
					color: radialLabel.fontColor,
				}),
			}),
			Text(args.name, {
				textAlign: isRightSide ? TextAlign.left : TextAlign.right,
				style: new TextStyle({
					fontFamily: radialLabel.fontFamily ?? font.family,
					fontSize: subtitleFontSize,
					color: radialLabel.nameColor ?? radialLabel.fontColor,
				}),
			}),
		],
	});
}

export function agPieLikeRadialTick<TConfig extends AgPieLikeConfig>(
	args: PieLikeRadialArgs,
	context: { config: TConfig; legends: string[] },
): Widget {
	const { radial, radialTick, colors } = context.config;

	if (!radial.visible || radialTick.length <= 0) {
		return SizedBox.shrink();
	}

	const colorIndex = context.legends.indexOf(args.name);
	const seriesColor =
		colors.fills[(colorIndex >= 0 ? colorIndex : args.index) % colors.fills.length]
		?? radialTick.color;

	return SizedBox({
		width: radialTick.strokeWidth,
		height: radialTick.length,
		child: Container({
			color: seriesColor,
		}),
	});
}

export function agPieLikeTitle<TConfig extends AgPieLikeConfig>(
	_args: undefined,
	context: { config: TConfig },
): Widget {
	const { title, subtitle, font } = context.config;
	const titleWidget = Text(title.text, {
		style: new TextStyle({
			fontFamily: title.fontFamily ?? font.family,
			fontSize: title.fontSize,
			fontWeight: title.fontWeight,
			color: title.color,
		}),
	});

	if (!subtitle.visible || !subtitle.text) return titleWidget;

	return Column({
		mainAxisSize: MainAxisSize.min,
		children: [
			titleWidget,
			SizedBox({ height: 4 }),
			Text(subtitle.text, {
				style: new TextStyle({
					fontFamily: subtitle.fontFamily ?? font.family,
					fontSize: subtitle.fontSize,
					fontWeight: subtitle.fontWeight,
					color: subtitle.color,
				}),
			}),
		],
	});
}

export function agPieLikeTooltip<TConfig extends AgPieLikeConfig>(
	args: PieLikeTooltipArgs,
	context: { config: TConfig; legends: string[] },
): Widget {
	const colorIndex = context.legends.indexOf(args.name);
	const color = context.config.colors.fills[
		(colorIndex >= 0 ? colorIndex : args.index) % context.config.colors.fills.length
	];

	return agTooltipContent({
		label: args.name,
		items: {
			legend: "Value",
			color,
			value: args.value,
		},
		config: context.config as any,
	});
}

export function agPieLikeTooltipArea<TConfig extends AgPieLikeConfig>(
	args: { tooltip: Widget | null; hoveredSegment: PieLikeTooltipArgs | null },
	context: { config: TConfig },
): Widget {
	return agMouseTooltipArea({
		tooltip: args.tooltip,
		enabled: context.config.tooltip.enabled,
	});
}
