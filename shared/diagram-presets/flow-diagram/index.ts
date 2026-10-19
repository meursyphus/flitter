import type { Widget } from "flitter-ui";
import type { DeepPartial, FlowDiagramCustom, FlowDiagramProps as HeadlessProps } from "flitter-ui/diagram";
import { BaseFlowDiagram } from "./base";
import { defaultStyleConfig, type DefaultFlowConfig } from "./style";

export * from "./base";
export * from "./style";
export type FlowDiagramProps = Omit<HeadlessProps<DefaultFlowConfig>, "config" | "custom"> & {
  config?: DeepPartial<DefaultFlowConfig>;
  custom?: Partial<FlowDiagramCustom<DefaultFlowConfig>>;
};

export default function FlowDiagram({
  config,
  data,
  custom,
  getControlsOptions,
  getMinimapOptions,
  ...rest
}: FlowDiagramProps): Widget {
  return BaseFlowDiagram({
    data,
    getControlsOptions: getControlsOptions ?? (ctx => ctx.config.controls),
    getMinimapOptions: getMinimapOptions ?? (ctx => ({ ...ctx.config.minimap, padding: ctx.config.minimap.offsetScale })),
    config: defaultStyleConfig.createConfig(config),
    custom: { ...defaultStyleConfig.custom, ...custom },
    ...rest,
  });
}
