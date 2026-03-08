import type { Widget } from "flitter-core";
import {
  Column,
  Expanded,
  Container,
  Text,
  TextStyle,
  Stack,
  Positioned,
  BoxDecoration,
  Border,
  BoxShadow,
} from "flitter-core";
import { NetworkChart as HeadlessNetworkChart } from "flitter-ui/chart";
import type { NetworkChartCustom, NetworkChartData } from "./types";
import { HoverTooltip } from "flitter-ui/chart";
import { agTooltipContent, defaultAgCartesianBaseConfig } from "../_styles/ag/index";

export type {
  NetworkChartContext,
  NetworkNode,
  NetworkEdge,
  NetworkChartData,
  NetworkNodeLayout,
  NetworkEdgeLayout,
  NetworkLayout,
  NetworkChartCustom,
} from "./types";
export { NetworkChartController } from "./types";

const baseDefaults: Partial<NetworkChartCustom> = {
  layout: ({ title, network }) =>
    Column({
      children: [title, Expanded({ child: network })],
    }),
  network: ({ nodes, nodeLabels }) =>
    Stack({
      children: [...nodes, ...nodeLabels],
    }),
  node: ({ label, x, y, size, group, index }) =>
    Positioned({
      left: x * 100,
      top: y * 100,
      width: 24 + size * 4,
      height: 24 + size * 4,
      child: new HoverTooltip({
        position: "topCenter",
        tooltip: agTooltipContent({
          label,
          items: {
            legend: group ?? "Node size",
            color:
              defaultAgCartesianBaseConfig.colors.fills[
                index % defaultAgCartesianBaseConfig.colors.fills.length
              ],
            value: size,
          },
          config: defaultAgCartesianBaseConfig,
        }),
        renderChild: (hovered) =>
          Container({
            width: Infinity,
            height: Infinity,
            decoration: new BoxDecoration({
              color:
                defaultAgCartesianBaseConfig.colors.fills[
                  index % defaultAgCartesianBaseConfig.colors.fills.length
                ],
              shape: "circle",
              border:
                hovered
                  ? Border.all({ color: "white", width: 2, strokeAlign: 1 })
                  : undefined,
              boxShadow: hovered
                ? [new BoxShadow({ color: "rgba(0,0,0,0.18)", blurRadius: 12 })]
                : undefined,
            }),
          }),
      }),
    }),
  edge: () => Container({ width: 0, height: 0 }),
  nodeLabel: ({ label, x, y }) =>
    Positioned({
      left: x * 100 + 30,
      top: y * 100,
      child: Text(label, {
        style: new TextStyle({ fontSize: 11, color: "#333333" }),
      }),
    }),
  title: () => Container({ width: 0, height: 0 }),
  legend: ({ name }) =>
    Text(name, {
      style: new TextStyle({ fontSize: 11, color: "#666666" }),
    }),
};

export default function NetworkChart<TConfig = {}>({
  custom,
  ...rest
}: {
  custom?: Partial<NetworkChartCustom<TConfig>>;
  data: NetworkChartData;
  config?: TConfig;
}): Widget {
  return HeadlessNetworkChart({
    ...rest,
    custom: { ...baseDefaults, ...custom } as NetworkChartCustom<TConfig>,
  });
}
