import {
  Alignment,
  Container,
  FractionallySizedBox,
  Stack,
  StackFit,
  SizedBox,
  type Widget,
} from "flitter-core";
import type { BulletChartCustom } from "flitter-ui/chart";

export function BulletGroup(
  ...[{ ranges, valueBar, targetMarker }, ctx]: Parameters<BulletChartCustom["bulletGroup"]>
): Widget {
  const { scale } = ctx;
  if (scale == null) return SizedBox.shrink();

  return Container({
    width: Infinity,
    height: Infinity,
    child: Stack({
      fit: StackFit.expand,
      children: [
        // Ranges (background bands)
        ranges,
        // Value bar (actual measurement)
        Alignment.centerLeft != null
          ? FractionallySizedBox({
              alignment: Alignment.centerLeft,
              heightFactor: 0.5,
              child: valueBar,
            })
          : valueBar,
        // Target marker (goal line)
        targetMarker,
      ],
    }),
  });
}
