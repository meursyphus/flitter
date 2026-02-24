import { Container, type Widget } from "flitter-core";

export function GridYLine({ color = "black" }: { color?: string } = {}): Widget {
  return Container({
    width: 1,
    height: Infinity,
    color,
  });
}
