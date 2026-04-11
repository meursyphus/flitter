import {
  Container,
  EdgeInsets,
  Opacity,
  SizedBox,
  type Widget,
} from "flitter-core";
import type { BulletChartContext } from "@headless/bullet-chart/types";
import type { AgBulletChartConfig } from "../config";

export function agBulletGroup(
  {
    bulletBox,
    isDimmed,
  }: {
    bulletBox: Widget;
    index: number;
    label: string;
    isHovered: boolean;
    isDimmed: boolean;
  },
  context: BulletChartContext<AgBulletChartConfig>,
): Widget {
  const { scale, config, direction } = context;
  if (scale == null) return SizedBox.shrink();

  const child = isDimmed
    ? Opacity({ opacity: 0.35, child: bulletBox })
    : bulletBox;

  return Container({
    width: Infinity,
    height: Infinity,
    padding: EdgeInsets.symmetric(direction === "vertical" ? { horizontal: config.bullet.gap } : { vertical: config.bullet.gap }),
    child,
  });
}
