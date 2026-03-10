import type { NetworkChartCustom } from "flitter-ui/chart";
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
import type { NetworkChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import { agEdge } from "./parts/edge";
import { agNode } from "./parts/node";
import { agNodeLabel } from "./parts/node-label";

export { type NetworkChartConfig } from "./config";

const agCustom: Partial<NetworkChartCustom<NetworkChartConfig>> = {
  layout: ({ title, network }) =>
    Column({
      children: [title, Expanded({ child: network })],
    }),
  network: ({ nodes, edges, nodeLabels }) =>
    Stack({
      children: [...edges, ...nodes, ...nodeLabels],
    }),
  node: agNode,
  edge: agEdge,
  nodeLabel: agNodeLabel,
  title: () => Container({ width: 0, height: 0 }),
  legend: ({ name }, ctx) =>
    Text(name, {
      style: new TextStyle({ fontSize: 11, color: "#666666", fontFamily: ctx.config.font.family }),
    }),
};

export const styleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<NetworkChartConfig>): NetworkChartConfig =>
    deepMerge(defaultAgConfig, config),
};
