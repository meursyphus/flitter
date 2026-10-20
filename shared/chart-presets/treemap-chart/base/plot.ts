import { Stack, StackFit, type Widget } from "flitterjs";
import type { TreemapCustom } from "@flitterjs/chart";

export function Plot(
	...[{ treemap, tooltipArea }]: Parameters<TreemapCustom["plot"]>
): Widget {
	return Stack({
		fit: StackFit.expand,
		clipped: false,
		children: [treemap, tooltipArea],
	});
}
