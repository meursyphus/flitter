import {
  Container,
  EdgeInsets,
  Expanded,
  type Widget,
} from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "./config";

export function toastLayout(
  { title, plot, legends }: { title: Widget; legends: Widget[]; plot: Widget },
  context: BarChartContext<ToastBarChartConfig>
): Widget {
  const { padding } = context.config;
  return Container({
    padding: EdgeInsets.only({
      left: padding.left,
      right: padding.right,
      top: padding.top,
      bottom: padding.bottom,
    }),
    child: Expanded({ child: plot }),
  });
}
