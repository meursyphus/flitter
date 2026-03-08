import type { Widget } from "flitter-core";
import {
  Text,
  Container,
  EdgeInsets,
  TextStyle,
  BoxDecoration,
  Alignment,
  Column,
  MainAxisAlignment,
  CrossAxisAlignment,
  Expanded,
  Positioned,
  Stack,
} from "flitter-core";
import HeadlessTreemapChart from "../_flitter/headless/treemap-chart";
import type { TreemapCustom, TreemapData } from "./types";

export type {
  TreemapContext,
  TreemapCustom,
  TreemapData,
  TreemapNode,
  TreemapLayout,
} from "./types";
export { TreemapController } from "./types";

const DEFAULT_COLORS = [
  "#4e79a7",
  "#f28e2b",
  "#e15759",
  "#76b7b2",
  "#59a14f",
  "#edc948",
  "#b07aa1",
  "#ff9da7",
];

const baseDefaults: Partial<TreemapCustom> = {
  layout: ({ treemap }) =>
    Column({
      children: [
        Expanded({
          child: Container({
            padding: EdgeInsets.all(20),
            child: treemap,
          }),
        }),
      ],
    }),
  title: () => Container({ width: 0, height: 0 }),
  legend: ({ name }) =>
    Text(name, {
      style: new TextStyle({ fontSize: 11, color: "#666666" }),
    }),
  treemap: ({ nodes }) => Stack({ children: nodes }),
  node: ({ label, value, color, x, y, width, height }) =>
    Positioned({
      left: x,
      top: y,
      width,
      height,
      child: Container({
        decoration: new BoxDecoration({ color: color || DEFAULT_COLORS[0] }),
        alignment: Alignment.center,
        child: Column({
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text(label, {
              style: new TextStyle({ fontSize: 11, color: "#ffffff" }),
            }),
            Text(String(value), {
              style: new TextStyle({ fontSize: 10, color: "rgba(255,255,255,0.8)" }),
            }),
          ],
        }),
      }),
    }),
};

export default function TreemapChart<TConfig = {}>({
  custom,
  ...rest
}: {
  custom?: Partial<TreemapCustom<TConfig>>;
  data: TreemapData;
  config?: TConfig;
}): Widget {
  return HeadlessTreemapChart({
    ...rest,
    custom: { ...baseDefaults, ...custom } as TreemapCustom<TConfig>,
  });
}
