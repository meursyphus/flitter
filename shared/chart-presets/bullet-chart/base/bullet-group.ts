import {
  Container,
  SizedBox,
  type Widget,
} from "flitterjs";
import type { BulletChartCustom } from "@flitterjs/chart";

export function BulletGroup(
  ...[{ bulletBox }, ctx]: Parameters<BulletChartCustom["bulletGroup"]>
): Widget {
  const { scale } = ctx;
  if (scale == null) return SizedBox.shrink();

  return Container({
    width: Infinity,
    height: Infinity,
    child: bulletBox,
  });
}
