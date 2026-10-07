import type { SankeyChartCustom } from "../types";
import {
  MainAxisSize,
  Column,
  Container,
  CrossAxisAlignment,
  EdgeInsets,
  Expanded,
  SizedBox,
  Stack,
  StackFit,
} from "flitter-ui";

export function Layout(
  ...[{ title, dataView, tooltipArea }, ctx]: Parameters<
    SankeyChartCustom<any>["layout"]
  >
) {
  const { padding, title: heading } = ctx.config;
  const titleWidget = Column({
    mainAxisSize: MainAxisSize.min,
    crossAxisAlignment:
      heading.alignment === "center"
        ? CrossAxisAlignment.center
        : heading.alignment === "end"
          ? CrossAxisAlignment.end
          : CrossAxisAlignment.start,
    children: [title],
  });
  return Container({
    padding: EdgeInsets.only(padding),
    child: Column({
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        ...(heading.visible && heading.position === "top"
          ? [titleWidget, SizedBox({ height: 16 })]
          : []),
        Expanded({
          child: Stack({
            fit: StackFit.expand,
            clipped: false,
            children: [dataView, tooltipArea],
          }),
        }),
        ...(heading.visible && heading.position === "bottom"
          ? [SizedBox({ height: 16 }), titleWidget]
          : []),
      ],
    }),
  });
}
