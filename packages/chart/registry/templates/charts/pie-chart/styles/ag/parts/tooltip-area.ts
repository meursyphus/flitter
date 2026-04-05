import {
	AnimatedOpacity,
	AnimatedPositioned,
	ConstraintsTransformBox,
	Curves,
	FractionalTranslation,
	Offset,
	SizedBox,
	Stack,
	StackFit,
	State,
	StatefulWidget,
	ZIndex,
	type Widget,
} from "flitter-core";
import type { PieChartCustom } from "@headless/pie-chart/types";
import type { AgPieChartConfig } from "../config";

const ANIMATION_DURATION = 150;
const FADE_DURATION = 100;

class _AgPieTooltipArea extends StatefulWidget {
	tooltip: Widget | null;
	hoveredSlice: Parameters<PieChartCustom<AgPieChartConfig>["tooltipArea"]>[0]["hoveredSlice"];
	enabled: boolean;

	constructor({
		tooltip,
		hoveredSlice,
		enabled,
	}: Parameters<PieChartCustom<AgPieChartConfig>["tooltipArea"]>[0] & { enabled: boolean }) {
		super();
		this.tooltip = tooltip;
		this.hoveredSlice = hoveredSlice;
		this.enabled = enabled;
	}

	createState() {
		return new _AgPieTooltipAreaState();
	}
}

class _AgPieTooltipAreaState extends State<_AgPieTooltipArea> {
	wasVisible = false;
	lastTooltip: Widget | null = null;
	lastAnchorX = 0;
	lastAnchorY = 0;

	override build(): Widget {
		const { tooltip, hoveredSlice, enabled } = this.widget;
		if (!enabled) return SizedBox.shrink();

		if (tooltip != null && hoveredSlice != null) {
			this.lastTooltip = tooltip;
			this.lastAnchorX = hoveredSlice.anchorX;
			this.lastAnchorY = hoveredSlice.anchorY;
		}

		const isVisible = tooltip != null && hoveredSlice != null;
		const showTooltip = this.lastTooltip;
		const positionDuration = !this.wasVisible && isVisible ? 0 : ANIMATION_DURATION;
		this.wasVisible = isVisible;

		if (showTooltip == null) return SizedBox.shrink();

		return Stack({
			fit: StackFit.expand,
			clipped: false,
			children: [
				AnimatedPositioned({
					duration: positionDuration,
					curve: Curves.easeOut,
					left: this.lastAnchorX,
					top: this.lastAnchorY,
					child: AnimatedOpacity({
						duration: FADE_DURATION,
						curve: Curves.easeOut,
						opacity: isVisible ? 1 : 0,
						child: FractionalTranslation({
							translation: new Offset({ x: -0.5, y: -1.1 }),
							child: ConstraintsTransformBox({
								constraintsTransform: ConstraintsTransformBox.unconstrained,
								child: ZIndex({
									zIndex: 9999,
									child: showTooltip,
								}),
							}),
						}),
					}),
				}),
			],
		});
	}
}

export function agTooltipArea(
	...[{ tooltip, hoveredSlice }, ctx]: Parameters<PieChartCustom<AgPieChartConfig>["tooltipArea"]>
): Widget {
	return new _AgPieTooltipArea({
		tooltip,
		hoveredSlice,
		enabled: ctx.config.tooltip.enabled,
	});
}
