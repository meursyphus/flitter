import {
  Axis,
  Flex,
  Flexible,
  Positioned,
  Stack,
  type Widget,
} from "flitter-ui";
import type { WaterfallChartCustom } from "flitter-ui/chart";
import type { WaterfallChartConfig } from "../config";
import { AnimatedDataView } from "../../../_shared/toast/cartesian/animated-data-view";

export function toastDataView(
  ...[{ bars, connectors }, ctx]: Parameters<WaterfallChartCustom<WaterfallChartConfig>["dataView"]>
): Widget {
  const child = Stack({
    children: [
      ...connectors.map((connector) => Positioned.fill({ child: connector })),
      Positioned.fill({
        child: Flex({
          direction: Axis.horizontal,
          children: bars.map((bar) =>
            Flexible({
              flex: 1,
              child: bar,
            }),
          ),
        }),
      }),
    ],
  });
  const baselineRatio =
    ctx.scale == null ? 0 : Math.max(0, Math.min(1, (0 - ctx.scale.min) / (ctx.scale.max - ctx.scale.min)));

  return new AnimatedDataView({
    child,
    duration: ctx.config.animation.duration,
    isVertical: true,
    baselineRatio,
  });
}
