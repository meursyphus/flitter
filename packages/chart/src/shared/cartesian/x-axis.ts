import {
  Column,
  CrossAxisAlignment,
  FractionalTranslation,
  MainAxisAlignment,
  MainAxisSize,
  Offset,
  Row,
  SizedBox,
  type Widget,
} from "flitter-core";
import { IgnoreSize } from "@utils/index";

export function XAxis(
  { labels, tick, line }: { line: Widget; labels: Widget[]; tick: Widget },
  options: {
    type: "label" | "value";
    gap?: number;
  }
): Widget {
  const isLabel = options.type === "label";
  const tickCount = labels.length + (isLabel ? 1 : 0);

  return Column({
    mainAxisSize: MainAxisSize.min,
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      line,
      Row({
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: Array.from({ length: tickCount }, (_, index) =>
          isLabel
            ? FractionalTranslation({
                translation: new Offset({ x: index === 0 ? -0.5 : index === tickCount - 1 ? 0.5 : 0, y: 0 }),
                child: tick,
              })
            : FractionalTranslation({
                translation: new Offset({ x: index === 0 ? -1 : 0, y: 0 }),
                child: tick,
              })
        ),
      }),
      ...(options.gap ? [SizedBox({ height: options.gap })] : []),
      Row({
        mainAxisAlignment: isLabel
          ? MainAxisAlignment.spaceAround
          : MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: labels.map((child) =>
          IgnoreSize({ child, ignoreWidth: true }),
        ),
      }),
    ],
  });
}
