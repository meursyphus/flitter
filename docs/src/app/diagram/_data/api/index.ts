import { flowApi } from "./flow.generated";
import {
  argDocs,
  controllerDocs,
  eventDocs,
  fieldDocs,
  interactionDocs,
  propDocs,
  slotDocs,
  type ControllerGroup,
} from "./descriptions";
import type { ApiField } from "./types";

export type FieldRow = { name: string; type: string; optional: boolean; description: string };

const rows = (fields: ApiField[], docs: Record<string, string>): FieldRow[] =>
  fields.map((f) => ({ name: f.name, type: f.type, optional: f.optional, description: docs[f.name] ?? f.doc }));

export const props = rows(flowApi.props, propDocs);
export const events = rows(flowApi.events, eventDocs);
export const gestures = flowApi.gestures;
export const nodeFields = rows(flowApi.node, fieldDocs);
export const edgeFields = rows(flowApi.edge, fieldDocs);

export const interactionGroups = flowApi.interaction.map((g) => ({
  group: g.group,
  rows: g.rows.map((r) => {
    const key = g.group === "general" ? r.property : `${g.group}.${r.property}`;
    return { ...r, key, description: interactionDocs[key] ?? "" };
  }),
}));

export const customSlots = flowApi.custom.map((slot) => ({
  slot: slot.slot,
  argsType: slot.argsType,
  returns: slot.returns,
  description: slotDocs[slot.slot] ?? slot.doc,
  args: slot.args.map((a) => ({
    name: a.name,
    type: a.type,
    description: argDocs[`${slot.slot}.${a.name}`] ?? (a.doc || argDocs[a.name]) ?? "",
  })),
}));

export type ControllerRow = {
  name: string;
  signature: string;
  description: string;
  kind: "method" | "getter" | "property";
  /** Listed in todo/diagram.md §4 but not on FlowController yet. */
  planned: boolean;
};

const generated = new Map(flowApi.controller.map((m) => [m.name, m]));

export const controllerGroups: { group: ControllerGroup; rows: ControllerRow[] }[] = [];
for (const entry of controllerDocs) {
  const member = generated.get(entry.name);
  if (!member && !entry.planned) continue; // removed from the engine; drop the row
  const row: ControllerRow = member
    ? { name: entry.name, signature: member.signature, description: entry.doc, kind: member.kind, planned: false }
    : { name: entry.name, signature: entry.planned!, description: entry.doc, kind: entry.planned!.includes("(") ? "method" : "getter", planned: true };
  let group = controllerGroups.find((g) => g.group === entry.group);
  if (!group) controllerGroups.push((group = { group: entry.group, rows: [] }));
  group.rows.push(row);
}
