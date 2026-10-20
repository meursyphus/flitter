import { Container, type Widget } from "flitterjs";

export function AxisCorner({
  size = 1,
  color = "black",
}: { size?: number; color?: string } = {}): Widget {
  return Container({
    color,
    width: size,
    height: size,
  });
}
