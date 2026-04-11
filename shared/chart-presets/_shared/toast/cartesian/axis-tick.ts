import type { Widget } from "flitter-ui";
import type { ToastBaseConfig } from "./config";
import { XAxisTick, YAxisTick } from "flitter-ui/chart";

export function toastXAxisTick(
  args: undefined,
  context: { config: ToastBaseConfig },
): Widget {
  const { axis } = context.config;
  return XAxisTick(args, {
    size: axis.tick.size,
    thickness: axis.thickness,
    color: axis.color,
  });
}

export function toastYAxisTick(
  args: undefined,
  context: { config: ToastBaseConfig },
): Widget {
  const { axis } = context.config;
  return YAxisTick(args, {
    size: axis.tick.size,
    thickness: axis.thickness,
    color: axis.color,
  });
}
