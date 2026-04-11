import * as Cartesian from "@shared/cartesian/index";

export function Grid({
  xLine,
  yLine,
  scale,
}: {
  xLine: import("flitter-core").Widget;
  yLine: import("flitter-core").Widget;
  scale: { x: { min: number; max: number; step: number }; y: { min: number; max: number; step: number } } | null;
}) {
  if (scale == null) return Cartesian.Grid({ xLine, yLine, x: 0, y: 0 });

  const x = (scale.x.max - scale.x.min) / scale.x.step;
  const y = (scale.y.max - scale.y.min) / scale.y.step;

  return Cartesian.Grid({ xLine, yLine, x, y });
}
