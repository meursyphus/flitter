import { Container, type Widget } from "flitter-core";

export function toastAxisCorner({
  color,
  thickness,
}: {
  color: string;
  thickness: number;
}): Widget {
  return Container({ color, width: thickness, height: thickness });
}
