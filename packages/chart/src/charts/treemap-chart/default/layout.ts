import type { TreemapCustom } from "../types";
import {
  Column,
  Container,
  CrossAxisAlignment,
  EdgeInsets,
  MainAxisAlignment,
  Row,
} from "flitter-core";

export function Layout(
  ...[{ title, legend, treemap }]: Parameters<TreemapCustom["layout"]>
) {
  return Container({
    padding: EdgeInsets.all(20),
    child: Column({
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row({
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [title, legend],
        }),
        treemap,
      ],
    }),
  });
}
