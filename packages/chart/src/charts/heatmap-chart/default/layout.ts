import type { HeatmapCustom } from "../types";
import {
  Column,
  Container,
  CrossAxisAlignment,
  EdgeInsets,
  MainAxisAlignment,
  MainAxisSize,
  Row,
} from "flitter-core";

export function Layout(
  ...[{ title, plot }, { data }]: Parameters<HeatmapCustom["layout"]>
) {
  return Container({
    padding: EdgeInsets.only({
      left: 20,
      bottom: 60,
      right: 10,
    }),
    child: Column({
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row({
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [title],
        }),
        plot,
      ],
    }),
  });
}
