import type { Widget } from "flitter-core";
import type { ToastBaseConfig } from "./config";
import { XAxisLabel, YAxisLabel } from "../../cartesian";

export function toastXAxisLabel(
  args: { name: string; index: number },
  context: { config: ToastBaseConfig },
): Widget {
  const { font, axis } = context.config;
  return XAxisLabel(args, {
    fontFamily: font.family,
    fontSize: axis.label.fontSize,
    color: axis.label.color,
  });
}

export function toastYAxisLabel(
  args: { name: string; index: number },
  context: { config: ToastBaseConfig },
): Widget {
  const { font, axis } = context.config;
  return YAxisLabel(args, {
    fontFamily: font.family,
    fontSize: axis.label.fontSize,
    color: axis.label.color,
  });
}
