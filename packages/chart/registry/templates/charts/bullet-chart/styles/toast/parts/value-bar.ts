import {
  Alignment,
  Container,
  FractionallySizedBox,
  BoxDecoration,
  GestureDetector,
  Opacity,
  type Widget,
} from "flitter-core";
import type { BulletChartContext } from "@headless/bullet-chart/types";
import type { ToastBulletChartConfig } from "../config";

export function toastValueBar(
  { value, index }: { value: number; index: number; label: string },
  context: BulletChartContext<ToastBulletChartConfig>,
): Widget {
  const { bullet } = context.config;
  const { scale } = context;
  if (scale == null) return Container({});

  const total = scale.max - scale.min;
  const ratio = (value - scale.min) / total;

  const isHovered = context.hoveredBullet != null;
  const isThisHovered = context.isBulletHovered(index);

  let opacity = 1;
  if (isHovered && !isThisHovered) {
    opacity = 0.3;
  }

  const bar = FractionallySizedBox({
    alignment: Alignment.centerLeft,
    widthFactor: ratio,
    heightFactor: bullet.valueBarHeightRatio,
    child: Container({
      decoration: new BoxDecoration({ color: bullet.valueBarColor }),
    }),
  });

  return GestureDetector({
    cursor: "default",
    onMouseEnter: () => context.hoverBullet(index),
    child: opacity < 1 ? Opacity({ opacity, child: bar }) : bar,
  });
}
