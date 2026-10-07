import {
  LayoutBuilder,
  Positioned,
  Stack,
  StackFit,
  SizedBox,
  type Widget,
} from "flitter-core";
import type { FunnelChartCustom } from "../types";

export function Plot(
  { stages, tooltipArea }: Parameters<FunnelChartCustom["plot"]>[0],
  wrap: (child: Widget) => Widget = (child) => child,
): Widget {
  return LayoutBuilder({
    builder: (_, constraints) => {
      const width = constraints.maxWidth;
      const height = constraints.maxHeight;
      if (!Number.isFinite(width) || !Number.isFinite(height))
        return SizedBox.shrink();
      return Stack({
        fit: StackFit.expand,
        clipped: false,
        children: [
          wrap(
            Stack({
              fit: StackFit.expand,
              clipped: false,
              children: stages.map(({ stage, widget }) =>
                Positioned({
                  key: stage.index,
                  left: 0,
                  top: stage.top * height,
                  width,
                  height: stage.height * height,
                  child: widget,
                }),
              ),
            }),
          ),
          tooltipArea,
        ],
      });
    },
  });
}
