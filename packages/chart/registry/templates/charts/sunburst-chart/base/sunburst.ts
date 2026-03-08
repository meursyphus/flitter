import type { SunburstCustom } from "../types";
import { Positioned, Stack, type Widget } from "flitter-core";

export function Sunburst(
  ...[{ segments }, context]: Parameters<SunburstCustom["sunburst"]>
): Widget {
  return Stack({
    children: segments.map((segment) =>
      Positioned.fill({
        child: context.custom.segment({ segment }, context),
      }),
    ),
  });
}
