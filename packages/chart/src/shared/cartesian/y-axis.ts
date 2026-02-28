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
  }
): Widget {
  const isLabel = options.type === "label";
  const tickCount = labels.length + (isLabel ? 1 : 0);

  return Row({
    mainAxisSize: MainAxisSize.min,
    crossAxisAlignment: CrossAxisAlignment.end,
    children: [
      Column({
        crossAxisAlignment: CrossAxisAlignment.end,
        verticalDirection:
          isLabel ? VerticalDirection.down : VerticalDirection.up,
        mainAxisAlignment: isLabel
          ? MainAxisAlignment.spaceAround
          : MainAxisAlignment.spaceBetween,
        children: labels.map((child) =>
          IgnoreSize({ child, ignoreHeight: true }),
        ),
      }),
      ...(options.gap ? [SizedBox({ width: options.gap })] : []),
      Column({
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
      }),
      line,
    ],
  });
}
