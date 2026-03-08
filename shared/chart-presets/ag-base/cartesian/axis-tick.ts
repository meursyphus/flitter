import { SizedBox, type Widget } from "flitter-core";
import type { AgCartesianBaseConfig } from "./config";
import { XAxisTick, YAxisTick } from "../../_flitter/shared/cartesian/index";

/**
 * AG Charts hides axis ticks by default (tick.enabled = false).
 * When disabled, returns a zero-sized box.
 */
export function agXAxisTick(
  args: undefined,
  context: { config: AgCartesianBaseConfig },
): Widget {
  const { axis } = context.config;
  if (!axis.tick.enabled) {
    return SizedBox({ width: 0, height: 0 });
  }
  return XAxisTick(args, {
    size: axis.tick.size,
    thickness: axis.thickness,
    color: axis.color,
  });
}

export function agYAxisTick(
  args: undefined,
  context: { config: AgCartesianBaseConfig },
): Widget {
  const { axis } = context.config;
  if (!axis.tick.enabled) {
    return SizedBox({ width: 0, height: 0 });
  }
  return YAxisTick(args, {
    size: axis.tick.size,
    thickness: axis.thickness,
    color: axis.color,
  });
}
