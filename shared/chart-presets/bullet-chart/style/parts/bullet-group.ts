import {
  Container,
  EdgeInsets,
  Opacity,
  SizedBox,
  type Widget,
} from "flitter-ui";
import type { BulletChartContext } from "flitter-ui/chart";
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
