/** Shapes emitted by `docs/scripts/gen-diagram-api.mjs` into `flow.generated.ts`. */
export type ApiField = {
  name: string;
  type: string;
  optional: boolean;
  /** JSDoc from the engine source, if any. */
  doc: string;
};

export type InteractionRow = {
  property: string;
  type: string;
  editor: string;
  viewer: string;
  whiteboard: string;
};

export type InteractionGroup = { group: string; rows: InteractionRow[] };

export type CustomSlot = {
  slot: string;
  argsType: string;
  returns: string;
  doc: string;
  args: ApiField[];
};

export type ControllerMember = {
  name: string;
  kind: "method" | "getter" | "property";
  signature: string;
  doc: string;
};

export type FlowApiGenerated = {
  props: ApiField[];
  events: ApiField[];
  gestures: string[];
  interaction: InteractionGroup[];
  custom: CustomSlot[];
  controller: ControllerMember[];
  node: ApiField[];
  edge: ApiField[];
};
