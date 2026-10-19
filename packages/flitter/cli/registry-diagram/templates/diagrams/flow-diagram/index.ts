import type { Widget } from "flitter-core";
import type {
  DeepPartial,
  FlowDiagramCustom,
  FlowDiagramProps as HeadlessProps,
} from "../../../../src/engine";
import { BaseFlowDiagram } from "./base";
import { flowDiagramStyleConfigs, type FlowDiagramStyleMap } from "./plugin";

export * from "./base";
export * from "./styles/default";

export type FlowDiagramProps<S extends keyof FlowDiagramStyleMap = "default"> =
  Omit<HeadlessProps<FlowDiagramStyleMap[S]>, "config" | "custom"> & {
    style?: S;
    config?: DeepPartial<FlowDiagramStyleMap[S]>;
    custom?: Partial<FlowDiagramCustom<FlowDiagramStyleMap[S]>>;
  };

export default function FlowDiagram<
  S extends keyof FlowDiagramStyleMap = "default",
>({
  style = "default" as S,
  config,
  custom,
  ...rest
}: FlowDiagramProps<S>): Widget {
  const sc = flowDiagramStyleConfigs[style];
  return BaseFlowDiagram({
    ...rest,
    config: sc.createConfig(config),
    custom: { ...sc.custom, ...custom },
  });
}
