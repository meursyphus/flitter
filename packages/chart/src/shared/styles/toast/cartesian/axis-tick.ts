import type { Widget } from "flitter-core";
import type { ToastBaseConfig } from "./config";
import { XAxisTick, YAxisTick } from "../../../cartesian";

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
