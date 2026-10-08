import { type BuildContext, Provider } from "flitter-core";
import type { FlowController } from "./controller";

export const FLOW_PROVIDER_KEY = Symbol("FlowProviderKey");

/** Access the diagram controller from any widget inside a `Flow`. */
export const FlowProvider = {
  of<TConfig extends object = object>(context: BuildContext): FlowController & { config: TConfig } {
    return Provider.of(FLOW_PROVIDER_KEY, context) as FlowController & { config: TConfig };
  },
};
