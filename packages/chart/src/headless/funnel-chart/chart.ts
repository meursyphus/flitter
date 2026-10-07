import {
  GestureDetector,
  StatelessWidget,
  type BuildContext,
  type Widget,
} from "flitter-core";
import { FunnelChartProvider } from "./provider";

class Chart extends StatelessWidget {
  override build(context: BuildContext): Widget {
    const ctx = FunnelChartProvider.of(context);
    const hovered = ctx.hoveredStage;
    return ctx.custom.layout(
      {
        title: ctx.custom.title(undefined, ctx),
        legends: ctx.data.stages.map((stage, index) =>
          GestureDetector({
            key: `legend-${index}`,
            cursor: "pointer",
            onClick: () => ctx.toggleStage(index),
            child: ctx.custom.legend(
              {
                name: stage.label,
                index,
                isVisible: ctx.isStageVisible(index),
              },
              ctx,
            ),
          }),
        ),
        plot: GestureDetector({
          behavior: "translucent",
          onMouseLeave: () => ctx.unhoverAllStages(),
          child: ctx.custom.plot(
            {
              stages: ctx.stages.map((stage) => ({
                stage,
                widget: GestureDetector({
                  key: stage.index,
                  behavior: "deferToChild",
                  onMouseEnter: () => ctx.hoverStage(stage.index),
                  onMouseLeave: () => ctx.unhoverStage(stage.index),
                  child: ctx.custom.stage(
                    {
                      ...stage,
                      isHovered: ctx.isStageHovered(stage.index),
                      dataLabel: ctx.custom.dataLabel(stage, ctx),
                    },
                    ctx,
                  ),
                }),
              })),
              tooltipArea: ctx.custom.tooltipArea(
                {
                  stage: hovered,
                  tooltip:
                    hovered == null ? null : ctx.custom.tooltip(hovered, ctx),
                },
                ctx,
              ),
            },
            ctx,
          ),
        }),
      },
      ctx,
    );
  }
}

export default Chart;
