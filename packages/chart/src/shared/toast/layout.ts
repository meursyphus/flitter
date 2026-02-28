import {
  Container,
  EdgeInsets,
  Column,
  Expanded,
  Row,
  CrossAxisAlignment,
  MainAxisAlignment,
  MainAxisSize,
  SizedBox,
  type Widget,
} from "flitter-core";
import type { ToastBaseConfig } from "./config";

const titleAlignmentMap = {
  start: CrossAxisAlignment.start,
  center: CrossAxisAlignment.center,
  end: CrossAxisAlignment.end,
} as const;

export function toastLayout(
  { title, plot, legends }: { title: Widget; legends: Widget[]; plot: Widget },
  context: { config: ToastBaseConfig },
): Widget {
  const { padding, title: titleConfig, legend: legendConfig } = context.config;

  const legendRow = legendConfig.visible
    ? legendConfig.position === "right"
      ? Column({
          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: legends,
        })
      : Row({
          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.max,
          children: legends,
        })
    : null;

  const titleWidget = titleConfig.visible
    ? Column({
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment:
          titleAlignmentMap[
            titleConfig.alignment as keyof typeof titleAlignmentMap
          ],
        children: [title, SizedBox({ height: 8 })],
      })
    : null;

  const columnChildren: Widget[] = [];

  if (titleWidget && titleConfig.position === "top") {
    columnChildren.push(titleWidget);
  }

  if (legendRow && legendConfig.position === "top") {
    columnChildren.push(legendRow);
    columnChildren.push(SizedBox({ height: 12 }));
  }

  if (legendRow && legendConfig.position === "right") {
    columnChildren.push(
      Expanded({
        child: Row({
          children: [
            Expanded({ child: plot }),
            SizedBox({ width: 12 }),
            legendRow,
          ],
        }),
      })
    );
  } else {
    columnChildren.push(Expanded({ child: plot }));
  }

  if (legendRow && legendConfig.position === "bottom") {
    columnChildren.push(SizedBox({ height: 12 }));
    columnChildren.push(legendRow);
  }

  if (titleWidget && titleConfig.position === "bottom") {
    columnChildren.push(titleWidget);
  }

  return Container({
    padding: EdgeInsets.only({
      left: padding.left,
      right: padding.right,
      top: padding.top,
      bottom: padding.bottom,
    }),
    child: Column({
      crossAxisAlignment: CrossAxisAlignment.start,
      children: columnChildren,
    }),
  });
}
