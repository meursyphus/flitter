import {
  Container,
  BoxDecoration,
  type Widget,
} from "flitter-ui";
import type { BulletChartContext } from "flitter-ui/chart";
import type { AgBulletChartConfig } from "../config";

export function agRangeBar(
  { rangeIndex }: { rangeValue: number; rangeIndex: number; index: number; label: string; isHovered: boolean; isDimmed: boolean },
  context: BulletChartContext<AgBulletChartConfig>,
): Widget {
  const { bullet } = context.config;
  const color = bullet.rangeColors[rangeIndex % bullet.rangeColors.length];

  return Container({
    width: Infinity,
    height: Infinity,
    decoration: new BoxDecoration({ color }),
  });
}
