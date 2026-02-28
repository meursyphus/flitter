import { Container, type Widget } from "flitter-core";

export function toastXAxisLine({
  color,
  thickness,
}: {
  color: string;
  thickness: number;
}): Widget {
  return Container({ color, height: thickness, width: Infinity });
}

export function toastYAxisLine({
  color,
  thickness,
}: {
  color: string;
  thickness: number;
}): Widget {
  return Container({ color, width: thickness, height: Infinity });
}
