import {
  Axis,
  Container,
  Flex,
  Flexible,
  type Widget,
} from "flitter-ui";
import type { HistogramChartCustom } from "flitter-ui/chart";
import type { HistogramChartConfig } from "../config";
import { AnimatedDataView } from "../../../_shared/toast/cartesian/animated-data-view";

export function toastDataView(
  ...[{ bars }, ctx]: Parameters<HistogramChartCustom<HistogramChartConfig>["dataView"]>
): Widget {
  const child = Container({
    width: Infinity,
    height: Infinity,
    child: Flex({
      direction: Axis.horizontal,
      children: bars.map((bar) =>
        Flexible({
          flex: 1,
          child: bar,
        }),
      ),
    }),
  });

  const scale = ctx.scale;
  const baselineRatio =
    scale ? Math.max(0, Math.min(1, (0 - scale.min) / (scale.max - scale.min))) : 0;

  return new AnimatedDataView({
    child,
    duration: ctx.config.animation.duration,
    isVertical: true,
    baselineRatio,
  });
}
