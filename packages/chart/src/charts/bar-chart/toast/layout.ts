import {
  Container,
  EdgeInsets,
  Column,
  Row,
  CrossAxisAlignment,
  MainAxisAlignment,
  MainAxisSize,
  SizedBox,
  type Widget,
} from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "./config";

export function toastLayout(
  { title, plot, legends }: { title: Widget; legends: Widget[]; plot: Widget },
  context: BarChartContext<ToastBarChartConfig>
): Widget {
  const { padding, title: titleConfig, legend: legendConfig } = context.config;

  const legendRow = legendConfig.visible
    ? Row({
        mainAxisAlignment: MainAxisAlignment.center,
        mainAxisSize: MainAxisSize.max,
        children: legends,
      })
    : null;

  const columnChildren: Widget[] = [];

  // Title row (always top if visible)
  if (titleConfig.visible) {
    columnChildren.push(title);
    columnChildren.push(SizedBox({ height: 8 }));
  }

  // Legend top
  if (legendRow && legendConfig.position === "top") {
    columnChildren.push(legendRow);
    columnChildren.push(SizedBox({ height: 12 }));
  }

  // Plot
  columnChildren.push(plot);

  // Legend bottom
  if (legendRow && legendConfig.position === "bottom") {
    columnChildren.push(SizedBox({ height: 12 }));
    columnChildren.push(legendRow);
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
