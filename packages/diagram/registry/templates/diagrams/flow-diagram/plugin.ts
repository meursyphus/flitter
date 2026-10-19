import type { FlowDiagramCustom, DeepPartial } from "../../../../src/engine";
import { defaultStyleConfig, type DefaultFlowConfig } from "./styles/default";

export type StyleConfig<TConfig extends object> = {
  custom: Partial<FlowDiagramCustom<TConfig>>;
  createConfig: (config?: DeepPartial<TConfig>) => TConfig;
};
export type FlowDiagramStyleMap = { default: DefaultFlowConfig };
export const flowDiagramStyleConfigs: {
  [S in keyof FlowDiagramStyleMap]: StyleConfig<FlowDiagramStyleMap[S]>;
} = {
  default: defaultStyleConfig,
};
