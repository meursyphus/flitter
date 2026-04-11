import type { SankeyChartCustom } from "../types";
import {
  Border,
  BorderRadius,
  BoxDecoration,
  BoxShadow,
  Container,
  FractionalTranslation,
  Offset,
  Opacity,
  Positioned,
  Radius,
  SizedBox,
  Stack,
  StackFit,
  Align,
  Alignment,
} from "flitter-ui";

export function Node(
  ...[{ color, column, totalColumns, labelWidget, isHovered, isActive, isDimmed }]: Parameters<
    SankeyChartCustom["node"]
  >
) {
  const opacity = isDimmed ? 0.28 : 1;
  const emphasized = isHovered || isActive;
  const isLastColumn = column === totalColumns - 1;

  return Opacity({
    opacity,
    child: Stack({
      fit: StackFit.expand,
      clipped: false,
      children: [
        Container({
          width: Infinity,
          height: Infinity,
          decoration: new BoxDecoration({
            color,
            borderRadius: BorderRadius.all(Radius.circular(2)),
            border: emphasized
              ? Border.all({ color: "rgba(255,255,255,0.92)", width: 2, strokeAlign: 1 })
              : undefined,
            boxShadow: emphasized
              ? [new BoxShadow({ color: "rgba(0,0,0,0.18)", blurRadius: 10 })]
              : undefined,
          }),
        }),
        labelWidget == null
          ? SizedBox.shrink()
          : Positioned.fill({
              child: Align({
                alignment: isLastColumn ? Alignment.centerLeft : Alignment.centerRight,
                child: FractionalTranslation({
                  translation: isLastColumn
                    ? new Offset({ x: -1, y: 0 })
                    : new Offset({ x: 1, y: 0 }),
                  child: labelWidget,
                }),
              }),
            }),
      ],
    }),
  });
}
