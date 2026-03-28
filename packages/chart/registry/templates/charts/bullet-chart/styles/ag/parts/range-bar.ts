import {
  Alignment,
  Container,
  FractionallySizedBox,
  BoxDecoration,
  Opacity,
  type Widget,
} from "flitter-core";
import type { BulletChartContext } from "@headless/bullet-chart/types";
import type { AgBulletChartConfig } from "../config";

export function agRangeBar(
  { rangeValue, rangeIndex, index }: { rangeValue: number; rangeIndex: number; index: number; label: string },
  context: BulletChartContext<AgBulletChartConfig>,
): Widget {
  const { bullet } = context.config;
  const { scale } = context;
  if (scale == null) return Container({});

  const total = scale.max - scale.min;
  const ratio = (rangeValue - scale.min) / total;
  const color = bullet.rangeColors[rangeIndex % bullet.rangeColors.length];

  const isHovered = context.hoveredBullet != null;
  const isThisHovered = context.isBulletHovered(index);

  let opacity = 1;
  if (isHovered && !isThisHovered) {
    opacity = 0.3;
  }

  const bar = FractionallySizedBox({
    alignment: Alignment.centerLeft,
    widthFactor: ratio,
    child: Container({
      decoration: new BoxDecoration({ color }),
    }),
  });

  return opacity < 1 ? Opacity({ opacity, child: bar }) : bar;
}
