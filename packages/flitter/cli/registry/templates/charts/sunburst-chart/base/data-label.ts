import {
  Column,
  ConstraintsTransformBox,
  FractionalTranslation,
  LayoutBuilder,
  MainAxisSize,
  Offset,
  Positioned,
  SizedBox,
  Stack,
  StackFit,
  Text,
  TextAlign,
  TextOverflow,
  TextStyle,
  Transform,
} from "flitter-core";
import type { FlatSegment } from "../types";
import { getRingMetrics, getSegmentLabelMetrics } from "./geometry";

type LabelConfig = {
  font: { family: string };
  sunburst: { innerRadiusRatio: number };
  dataLabel: {
    visible: boolean;
    minArcLength: number;
    minRingWidth: number;
    minFontSize: number;
    maxFontSize: number;
    color: string;
    secondaryColor: string;
    fontFamily?: string;
    fontWeight?: string;
    formatter: (args: {
      label: string;
      value: number;
      depth: number;
      path: string[];
      branchLabel: string;
    }) => { label: string; value?: string };
  };
};

/** Use the widget text/transform pipeline so both renderers share placement. */
export function DataLabel(
  segment: FlatSegment,
  ctx: { config: LabelConfig; segments: FlatSegment[] },
) {
  const config = ctx.config.dataLabel;
  if (!config.visible) return SizedBox.shrink();
  return LayoutBuilder({
    builder: (_, constraints) => {
      const metrics = getRingMetrics(
        constraints.maxWidth,
        constraints.maxHeight,
        ctx.segments,
        ctx.config.sunburst.innerRadiusRatio,
      );
      if (!metrics) return SizedBox.shrink();
      const { midAngle, arcLength, ringWidth, x, y } = getSegmentLabelMetrics(
        metrics,
        segment,
      );
      if (arcLength < config.minArcLength || ringWidth < config.minRingWidth)
        return SizedBox.shrink();
      const text = config.formatter({ ...segment, path: segment.pathLabels });
      if (!text.label) return SizedBox.shrink();
      const fontSize = Math.min(
        config.maxFontSize,
        Math.max(config.minFontSize, ringWidth * 0.28),
      );
      const radial = ringWidth > arcLength;
      const width = Math.min(160, (radial ? ringWidth : arcLength) * 0.78);
      const crossSpace = (radial ? arcLength : ringWidth) * 0.78;
      let angle = midAngle - (radial ? Math.PI / 2 : 0);
      while (angle > Math.PI / 2) angle -= Math.PI;
      while (angle < -Math.PI / 2) angle += Math.PI;
      const maxChars = Math.max(2, Math.floor(width / (fontSize * 0.65)));
      const label = (value: string, color: string, weight?: string) =>
        Text(
          value.length > maxChars ? `${value.slice(0, maxChars - 1)}…` : value,
          {
            softWrap: false,
            overflow: TextOverflow.ellipsis,
            textAlign: TextAlign.center,
            style: new TextStyle({
              fontSize,
              color,
              fontFamily: config.fontFamily ?? ctx.config.font.family,
              fontWeight: weight,
            }),
          },
        );
      return Stack({
        fit: StackFit.expand,
        clipped: false,
        children: [
          Positioned({
            left: x,
            top: y,
            child: ConstraintsTransformBox({
              constraintsTransform: ConstraintsTransformBox.unconstrained,
              child: FractionalTranslation({
                translation: new Offset({ x: -0.5, y: -0.5 }),
                child: Transform.rotate({
                  angle,
                  child: SizedBox({
                    width,
                    child: Column({
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        label(text.label, config.color, config.fontWeight),
                        ...(text.value && crossSpace > fontSize * 2.5
                          ? [label(text.value, config.secondaryColor)]
                          : []),
                      ],
                    }),
                  }),
                }),
              }),
            }),
          }),
        ],
      });
    },
  });
}
