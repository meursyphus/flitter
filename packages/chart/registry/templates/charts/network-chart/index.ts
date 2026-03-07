import type { Widget } from "flitter-core";
import {
  Column,
  Expanded,
  Container,
  Text,
  TextStyle,
  Stack,
  Positioned,
} from "flitter-core";
import HeadlessNetworkChart from "@headless/network-chart";
import type { NetworkChartCustom, NetworkChartData } from "./types";

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
  node: ({ x, y, size }) =>
    Positioned({
      left: x * 100,
      top: y * 100,
      width: 24 + size * 4,
      height: 24 + size * 4,
      child: Container({
        width: Infinity,
        height: Infinity,
        color: "#00a9ff",
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
