import { SizedBox, type Widget } from "flitter-core";
import type { AgBaseConfig } from "./config";
import { XAxisLine, YAxisLine } from "../../cartesian";

export function agXAxisLine(
  args: undefined,
  context: { config: AgBaseConfig },
): Widget {
  const { axis } = context.config;
  if (!axis.xLine.visible) return SizedBox({ width: 0, height: 0 });
  return XAxisLine({ color: axis.color, thickness: axis.thickness });
}

export function agYAxisLine(
  args: undefined,
  context: { config: AgBaseConfig },
): Widget {
  const { axis } = context.config;
  if (!axis.yLine.visible) return SizedBox({ width: 0, height: 0 });
  return YAxisLine({ color: axis.color, thickness: axis.thickness });
}
