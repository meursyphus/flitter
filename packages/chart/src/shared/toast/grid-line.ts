import { Container, type Widget } from "flitter-core";

export function toastGridXLine({
  thickness,
  color,
}: {
  thickness: number;
  color: string;
}): Widget {
  return Container({ height: thickness, color });
}

export function toastGridYLine({
  thickness,
  color,
}: {
  thickness: number;
  color: string;
}): Widget {
  return Container({ width: thickness, color });
}
