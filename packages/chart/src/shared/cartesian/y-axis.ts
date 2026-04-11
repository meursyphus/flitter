import {
  Column,
  CrossAxisAlignment,
  FractionalTranslation,
  MainAxisAlignment,
  MainAxisSize,
  Offset,
  Row,
  SizedBox,
  VerticalDirection,
  type Widget,
} from "flitter-core";
import { IgnoreSize } from "@utils/index";

export function YAxis(
  { labels, tick, line }: { line: Widget; labels: Widget[]; tick: Widget },
  options: {
    type: "label" | "value";
    gap?: number;
    side?: "left" | "right";
  }
): Widget {
  const isLabel = options.type === "label";
  const isRight = options.side === "right";
  const tickCount = labels.length + (isLabel ? 1 : 0);
  const labelColumn = Column({
    crossAxisAlignment: isRight
      ? CrossAxisAlignment.start
      : CrossAxisAlignment.end,
    verticalDirection:
      isLabel ? VerticalDirection.down : VerticalDirection.up,
    mainAxisAlignment: isLabel
      ? MainAxisAlignment.spaceAround
      : MainAxisAlignment.spaceBetween,
    children: labels.map((child) =>
      IgnoreSize({ child, ignoreHeight: true }),
    ),
  });
  const tickColumn = Column({
    mainAxisAlignment: MainAxisAlignment.spaceBetween,
    children: Array.from({ length: tickCount }, (_, index) =>
      FractionalTranslation({
        translation: new Offset({
          y: index === tickCount - 1 ? 1 : 0,
          x: 0,
        }),
        child: tick,
      }),
    ),
  });
  const gapWidget = options.gap ? [SizedBox({ width: options.gap })] : [];

  return Row({
    mainAxisSize: MainAxisSize.min,
    crossAxisAlignment: CrossAxisAlignment.end,
    children: isRight
      ? [line, tickColumn, ...gapWidget, labelColumn]
      : [labelColumn, ...gapWidget, tickColumn, line],
  });
}
