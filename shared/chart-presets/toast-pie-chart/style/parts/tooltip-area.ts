import {
	Align,
	Alignment,
	ConstraintsTransformBox,
	FractionalTranslation,
	Offset,
	SizedBox,
	Stack,
	StackFit,
	ZIndex,
	type Widget,
} from "flitter-core";
import type { PieChartCustom } from "flitter-ui/chart";
import type { ToastPieChartConfig } from "../config";

export function toastTooltipArea(
	...[{ tooltip, hoveredSlice }, ctx]: Parameters<PieChartCustom<ToastPieChartConfig>["tooltipArea"]>
): Widget {
	if (!ctx.config.tooltip.enabled || tooltip == null || hoveredSlice == null) {
		return SizedBox.shrink();
	}

	const ax = hoveredSlice.directionX;
	const ay = hoveredSlice.directionY;

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
							child: tooltip,
						}),
					}),
				}),
			}),
		],
	});
}
