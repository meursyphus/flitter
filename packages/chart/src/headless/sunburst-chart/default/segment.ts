import type { SunburstCustom } from "../types";
import { Container, type Widget } from "flitter-core";

export function Segment(
  ...[{ segment }]: Parameters<SunburstCustom["segment"]>
): Widget {
  return Container({
    color: segment.color,
  });
}
