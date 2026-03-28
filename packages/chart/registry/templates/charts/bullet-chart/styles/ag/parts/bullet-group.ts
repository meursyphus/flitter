import {
  Container,
  EdgeInsets,
  Stack,
  StackFit,
  SizedBox,
  type Widget,
} from "flitter-core";
import type { BulletChartContext } from "@headless/bullet-chart/types";
import type { AgBulletChartConfig } from "../config";

export function agBulletGroup(
  { ranges, valueBar, targetMarker }: { ranges: Widget; valueBar: Widget; targetMarker: Widget; index: number; label: string },
  context: BulletChartContext<AgBulletChartConfig>,
): Widget {
  const { scale, config } = context;
  if (scale == null) return SizedBox.shrink();

  return Container({
    width: Infinity,
    height: Infinity,
    padding: EdgeInsets.symmetric({ vertical: config.bullet.gap }),
    child: Stack({
      fit: StackFit.expand,
      children: [
        ranges,
        valueBar,
        targetMarker,
      ],
    }),
  });
}
