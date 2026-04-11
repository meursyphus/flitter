import type { Widget } from "flitter-ui";
import type { ToastBaseConfig } from "./config";
import { Label } from "flitter-ui/chart";

export function toastXAxisLabel(
  args: { name: string; index: number },
  context: { config: ToastBaseConfig },
): Widget {
  const { font, axis } = context.config;
  const formatted = { ...args, name: axis.label.format(args.name, args.index, "x") };
  return Label(formatted, {
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
  return Label(formatted, {
    fontFamily: font.family,
    fontSize: axis.label.fontSize,
    color: axis.label.color,
  });
}
