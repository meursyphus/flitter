import { Container, type Widget } from "flitter-core";

export function toastXAxisTick({
  tickSize,
  thickness,
  color,
}: {
  tickSize: number;
  thickness: number;
  color: string;
}): Widget {
  return Container({ height: tickSize, width: thickness, color });
}

export function toastYAxisTick({
  tickSize,
  thickness,
  color,
}: {
  tickSize: number;
  thickness: number;
  color: string;
}): Widget {
  return Container({ height: thickness, width: tickSize, color });
}
