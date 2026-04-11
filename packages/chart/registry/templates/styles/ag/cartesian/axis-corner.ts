import type { Widget } from "flitter-core";
import type { AgCartesianBaseConfig } from "./config";
import { AxisCorner } from "@shared/cartesian";

export function agAxisCorner(
  args: undefined,
  context: { config: AgCartesianBaseConfig },
): Widget {
  const { axis } = context.config;
  return AxisCorner({ color: axis.color, size: axis.thickness });
}
