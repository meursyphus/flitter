import {
  Alignment,
  Container,
  FractionallySizedBox,
  BoxDecoration,
  Opacity,
  type Widget,
} from "flitter-core";
import type { BulletChartContext } from "flitter-ui/chart";
import type { AgBulletChartConfig } from "../config";

export function agTargetMarker(
  { target, index }: { target: number; index: number; label: string },
  context: BulletChartContext<AgBulletChartConfig>,
): Widget {
  const { bullet } = context.config;
  const { scale } = context;
  if (scale == null) return Container({});

  const total = scale.max - scale.min;
  const fraction = (target - scale.min) / total;

  const isHovered = context.hoveredBullet != null;
  const isThisHovered = context.isBulletHovered(index);

  let opacity = 1;
  if (isHovered && !isThisHovered) {
    opacity = 0.3;
  }

  // Position the target marker as a thin vertical line
  const marker = FractionallySizedBox({
    alignment: Alignment.centerLeft,
    widthFactor: fraction,
    heightFactor: bullet.targetMarkerHeightRatio,
    child: Alignment.centerRight != null
      ? Container({
          alignment: Alignment.centerRight,
          child: Container({
            width: bullet.targetMarkerWidth,
            height: Infinity,
            decoration: new BoxDecoration({ color: bullet.targetMarkerColor }),
          }),
        })
      : Container({}),
  });

  return opacity < 1 ? Opacity({ opacity, child: marker }) : marker;
}
