import type { Widget } from "flitter-core";
import type { ToastBaseConfig } from "./config";
import { XAxisLabel, YAxisLabel } from "@shared/cartesian";

export function toastXAxisLabel(
  args: { name: string; index: number },
  context: { config: ToastBaseConfig },
): Widget {
  const { font, axis } = context.config;
  const formatted = { ...args, name: axis.label.format(args.name, args.index, "x") };
  return XAxisLabel(formatted, {
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
  const formatted = { ...args, name: axis.label.format(args.name, args.index, "y") };
  return YAxisLabel(formatted, {
    fontFamily: font.family,
    fontSize: axis.label.fontSize,
    color: axis.label.color,
  });
}
