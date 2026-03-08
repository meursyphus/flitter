import { SizedBox, type Widget } from "flitter-core";
import type { AgCartesianBaseConfig } from "./config";
import { XAxisLine, YAxisLine } from "../../_flitter/shared/cartesian/index";

export function agXAxisLine(
  args: undefined,
  context: { config: AgCartesianBaseConfig },
): Widget {
  const { axis } = context.config;
  if (!axis.xLine.visible) return SizedBox({ width: 0, height: 0 });
  return XAxisLine({ color: axis.color, thickness: axis.thickness });
}

export function agYAxisLine(
  args: undefined,
  context: { config: AgCartesianBaseConfig },
): Widget {
  const { axis } = context.config;
  if (!axis.yLine.visible) return SizedBox({ width: 0, height: 0 });
  return YAxisLine({ color: axis.color, thickness: axis.thickness });
}
