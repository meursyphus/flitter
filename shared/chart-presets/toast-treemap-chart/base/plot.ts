import { Stack, StackFit, type Widget } from "flitter-core";
import type { TreemapCustom } from "flitter-ui/chart";

export function Plot(
	...[{ treemap, tooltipArea }]: Parameters<TreemapCustom["plot"]>
): Widget {
	return Stack({
		fit: StackFit.expand,
		clipped: false,
		children: [treemap, tooltipArea],
	});
}
