import {
  type BuildContext,
  type Widget,
  Provider,
  ChangeNotifierProvider,
} from "flitter-core";
import { FlowDiagramController } from "./controller";
import { FlowRoot } from "./diagram";
import type { FlowDiagramProps, FlowDiagramContext } from "./types";

const FLOW_DIAGRAM_KEY = Symbol("FlowDiagramKey");
const controllerKeys = new WeakMap<FlowDiagramController, string>();
let nextKey = 0;

export function FlowDiagramProvider<TConfig extends object = object>(
  props: FlowDiagramProps<TConfig>,
): Widget {
  // Replacing an externally owned controller remounts its provider and host bindings.
  if (props.controller && !controllerKeys.has(props.controller))
    controllerKeys.set(props.controller, String(++nextKey));
  return ChangeNotifierProvider({
    key: props.controller ? controllerKeys.get(props.controller) : "owned",
    providerKey: FLOW_DIAGRAM_KEY,
    create: () => {
      const controller = props.controller ?? new FlowDiagramController();
      controller.configure(props);
      return controller;
    },
    update: (notifier) => (notifier as FlowDiagramController).configure(props),
    child: new FlowRoot(props),
  });
}

FlowDiagramProvider.of = <TConfig extends object = object>(
  context: BuildContext,
): FlowDiagramContext<TConfig> =>
  Provider.of(FLOW_DIAGRAM_KEY, context) as FlowDiagramContext<TConfig>;
