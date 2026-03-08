import { GestureDetector, type Widget } from "flitter-core";
import type { BarChartCustom } from "flitter-ui/chart";
import type { AgStackedBarChartConfig } from "../config";
import { stackedBarGroup } from "../../../base/stacked-bar-group";

export function agBarGroup(
  ...[args, context]: Parameters<BarChartCustom<AgStackedBarChartConfig>["barGroup"]>
): Widget {
  const child = stackedBarGroup(args, context);

  return GestureDetector({
    cursor: "default",
    onMouseLeave: () => context.unhoverBar(),
    child,
  });
}
