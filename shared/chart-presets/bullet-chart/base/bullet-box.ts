import {
  Alignment,
  Container,
  FractionallySizedBox,
  Stack,
  StackFit,
  SizedBox,
} from "flitter-ui";
import type { BulletChartCustom } from "flitter-ui/chart";

const MIN_ANCHOR_RATIO = 0.02;

function clampRatio(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

export function BulletBox(
  ...[{
    ranges,
    valueBar,
    valueRatio,
    targetMarker,
    targetRatio,
    tooltipAnchor,
  }, ctx]: Parameters<BulletChartCustom["bulletBox"]>
) {
  if (ctx.scale == null) return SizedBox.shrink();

  const isVertical = ctx.direction === "vertical";
  const anchorRatio = clampRatio(valueRatio) > 0 ? clampRatio(valueRatio) : MIN_ANCHOR_RATIO;

  return Container({
    width: Infinity,
    height: Infinity,
    child: Stack({
      fit: StackFit.expand,
      clipped: false,
      children: [
        ...ranges.map(({ widget, ratio }) =>
          FractionallySizedBox({
            alignment: isVertical ? Alignment.bottomCenter : Alignment.centerLeft,
            widthFactor: isVertical ? undefined : clampRatio(ratio),
            heightFactor: isVertical ? clampRatio(ratio) : undefined,
            child: widget,
          }),
        ),
        FractionallySizedBox({
          alignment: isVertical ? Alignment.bottomCenter : Alignment.centerLeft,
          widthFactor: isVertical ? undefined : clampRatio(valueRatio),
          heightFactor: isVertical ? clampRatio(valueRatio) : undefined,
          child: valueBar,
        }),
        FractionallySizedBox({
          alignment: isVertical ? Alignment.bottomCenter : Alignment.centerLeft,
          widthFactor: isVertical ? undefined : clampRatio(targetRatio),
          heightFactor: isVertical ? clampRatio(targetRatio) : undefined,
          child: targetMarker,
        }),
        FractionallySizedBox({
          alignment: isVertical ? Alignment.bottomCenter : Alignment.centerLeft,
          widthFactor: isVertical ? undefined : anchorRatio,
          heightFactor: isVertical ? anchorRatio : undefined,
          child: tooltipAnchor,
        }),
      ],
    }),
  });
}
