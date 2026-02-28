import type { Widget } from "flitter-core";
import type { ToastBaseConfig } from "./config";
import { XAxis } from "../cartesian";

export function toastXAxis(
  { line, labels, tick }: { line: Widget; labels: Widget[]; tick: Widget },
  options: { type: "label" | "value" },
  context: { config: ToastBaseConfig },
): Widget {
  return XAxis({ line, labels, tick }, {
    type: options.type,
    gap: context.config.axis.label.gap,
  });
}
