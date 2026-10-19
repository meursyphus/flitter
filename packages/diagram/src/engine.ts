/**
 * Engine-only entry: headless flow widgets, controller, geometry, edge paths,
 * change helpers and layouts. The `default` style is distributed separately
 * (copied into projects by `flitter add flow-diagram`) and imports this
 * surface through `flitter-ui/diagram`.
 */
export * from "./headless/flow-diagram";
export * from "./shared/geometry";
export * from "./shared/edges";
export * from "./shared/changes";
export * from "./shared/layout";
export { deepMerge, classToFn, createId } from "./shared/utils";
export type { DeepPartial } from "./shared/utils";

export { default as FlowDiagram } from "./headless/flow-diagram";
