import {
  ApiTable,
  CollapsibleSection,
  type ApiColumn,
} from "@/components/api-reference";
import {
  controllerGroups,
  customSlots,
  edgeFields,
  events,
  gestures,
  interactionGroups,
  nodeFields,
  props,
  type ControllerRow,
  type FieldRow,
} from "../_data/api";

export const metadata = {
  title: "Engine API",
  description:
    "Flow props, interaction defaults per preset, custom parts and their args, controller methods and data types.",
};

const fieldColumns = (label: string): ApiColumn<FieldRow>[] => [
  { label, cell: (r) => `${r.name}${r.optional ? "?" : ""}`, tone: "name" },
  { label: "Type", cell: (r) => r.type, tone: "code" },
  { label: "Description", cell: (r) => r.description },
];

type InteractionRow = (typeof interactionGroups)[number]["rows"][number];
const interactionColumns: ApiColumn<InteractionRow>[] = [
  { label: "Property", cell: (r) => r.property, tone: "name" },
  { label: "Type", cell: (r) => r.type, tone: "code" },
  { label: "editor", cell: (r) => r.editor, tone: "faint" },
  { label: "viewer", cell: (r) => r.viewer, tone: "faint" },
  { label: "whiteboard", cell: (r) => r.whiteboard, tone: "faint" },
  { label: "Description", cell: (r) => r.description },
];

type ArgRow = {
  slot: string;
  first: boolean;
  name: string;
  type: string;
  description: string;
};
const argRows: ArgRow[] = customSlots.flatMap((s) =>
  s.args.map((a, i) => ({
    slot: s.slot,
    first: i === 0,
    name: a.name,
    type: a.type,
    description: a.description,
  })),
);
const slotColumns: ApiColumn<(typeof customSlots)[number]>[] = [
  {
    label: "Slot",
    cell: (s) => <a id={`custom-${s.slot}`} href={`#slot-${s.slot}`} className="scroll-mt-24">{s.slot}</a>,
    tone: "name",
  },
  {
    label: "Signature",
    cell: (s) =>
      `(${s.argsType.endsWith("Args") ? "args" : s.args[0].name}: ${s.argsType}, context) => ${s.returns}`,
    tone: "code",
  },
  { label: "Description", cell: (s) => s.description },
];
const argColumns: ApiColumn<ArgRow>[] = [
  {
    label: "Slot",
    cell: (r) =>
      r.first ? (
        <span id={`slot-${r.slot}`} className="scroll-mt-24">
          {r.slot}
        </span>
      ) : (
        ""
      ),
    tone: "name",
  },
  { label: "Arg", cell: (r) => r.name, tone: "code" },
  { label: "Type", cell: (r) => r.type, tone: "code" },
  { label: "Description", cell: (r) => r.description },
];

const controllerColumns: ApiColumn<ControllerRow>[] = [
  {
    label: "Member",
    cell: (r) => (
      <span className="inline-flex items-center gap-1.5">
        {r.name}
        {r.planned && (
          <span className="rounded bg-surface px-1 py-0.5 font-sans text-[10px] text-faint">
            Planned
          </span>
        )}
      </span>
    ),
    tone: "name",
  },
  { label: "Signature", cell: (r) => r.signature, tone: "code" },
  { label: "Description", cell: (r) => r.description },
];

const PRESET_SNIPPET = `interaction: "viewer"                                   // a preset
interaction: { preset: "whiteboard", drag: { overlap: "push" } } // preset + overrides
interaction: { keys: { duplicate: null } }               // editor + one change`;

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mb-3 scroll-mt-24 text-lg font-semibold text-ink">
      {children}
    </h2>
  );
}

export default function DiagramApiPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 md:px-10">
      <section className="pt-8 pb-6 lg:pt-12">
        <h1 className="display text-[clamp(1.75rem,4vw,2.5rem)] text-ink">
          Engine API
        </h1>
        <nav
          aria-label="API sections"
          className="mt-4 flex flex-wrap gap-4 text-[13px] text-accent"
        >
          {[
            ["props", "Props"],
            ["interaction", "Interaction"],
            ["custom", "Custom parts"],
            ["controller", "Controller"],
            ["types", "Types"],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`} className="hover:underline">
              {label}
            </a>
          ))}
        </nav>
      </section>

      <div className="space-y-12 pb-16">
        <section className="space-y-4">
          <H2 id="props">Props</H2>
          <ApiTable
            columns={fieldColumns("Prop")}
            rows={props}
            rowKey={(r) => r.name}
          />
          <CollapsibleSection title="Events: on" id="events">
            <ApiTable
              columns={fieldColumns("Event")}
              rows={events}
              rowKey={(r) => r.name}
            />
          </CollapsibleSection>
          <pre className="code-surface overflow-x-auto rounded-lg p-4 text-[13px] text-ink">
            <code>{`can: (gesture: ${gestures.map((g) => `"${g}"`).join(" | ")},\n     target: { kind: "node" | "edge" | "pane" | "selection"; id?: string }) => boolean`}</code>
          </pre>
        </section>

        <section className="space-y-4">
          <H2 id="interaction">Interaction</H2>
          <p className="text-[13px] text-soft">
            Mod: ⌘ on macOS, Ctrl elsewhere.
          </p>
          <pre className="code-surface overflow-x-auto rounded-lg p-4 text-[13px] text-ink">
            <code>{PRESET_SNIPPET}</code>
          </pre>
          {interactionGroups.map((g, i) => (
            <CollapsibleSection
              key={g.group}
              id={`interaction-${g.group}`}
              title={g.group}
              defaultOpen={i === 0}
            >
              <ApiTable
                columns={interactionColumns}
                rows={g.rows}
                rowKey={(r) => r.key}
              />
            </CollapsibleSection>
          ))}
        </section>

        <section className="space-y-4">
          <H2 id="custom">Custom parts</H2>
          <ApiTable
            columns={slotColumns}
            rows={customSlots}
            rowKey={(s) => s.slot}
          />
          <CollapsibleSection title="Builder args" id="custom-args">
            <ApiTable
              columns={argColumns}
              rows={argRows}
              rowKey={(r) => `${r.slot}.${r.name}`}
            />
          </CollapsibleSection>
        </section>

        <section className="space-y-4">
          <H2 id="controller">Controller</H2>
          <p className="text-[13px] text-soft">
            Available as <code className="text-xs">context</code>.
          </p>
          {controllerGroups.map((g, i) => (
            <CollapsibleSection
              key={g.group}
              id={`controller-${g.group.toLowerCase().replace(/\s+/g, "-")}`}
              title={g.group}
              defaultOpen={i === 0}
            >
              <ApiTable
                columns={controllerColumns}
                rows={g.rows}
                rowKey={(r) => r.name}
              />
            </CollapsibleSection>
          ))}
        </section>

        <section className="space-y-4">
          <H2 id="types">Types</H2>
          <CollapsibleSection title="FlowNode" id="flow-node" defaultOpen>
            <ApiTable
              columns={fieldColumns("Field")}
              rows={nodeFields}
              rowKey={(r) => r.name}
            />
          </CollapsibleSection>
          <CollapsibleSection title="FlowEdge" id="flow-edge">
            <ApiTable
              columns={fieldColumns("Field")}
              rows={edgeFields}
              rowKey={(r) => r.name}
            />
          </CollapsibleSection>
        </section>
      </div>
    </div>
  );
}
