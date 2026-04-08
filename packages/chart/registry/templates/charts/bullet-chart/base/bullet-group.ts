import {
  Container,
  SizedBox,
  type Widget,
} from "flitter-core";
import type { BulletChartCustom } from "@headless/bullet-chart/types";

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
