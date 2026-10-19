import Link from "next/link";
import {
  ApiTable,
  CollapsibleSection,
  ConfigTable,
} from "@/components/api-reference";
import { customSlots } from "../../_data/api";
import { HighlightedCode } from "../../_components/code-blocks";

export const metadata = {
  title: "Flow Diagram API",
  description: "Data, preset config, custom widgets and controller context.",
};
const DATA = `type FlowDiagramData = {
  nodes: { id: string; position: { x: number; y: number }; data: Record<string, unknown>; type?: string }[];
  edges: { id: string; source: string; target: string; sourceHandle?: string; targetHandle?: string }[];
};`;
const sections = [
  {
    title: "Appearance",
    rows: [
      {
        property: "colorMode",
        type: '"light" | "dark"',
        default: '"light"',
        description: "Preset palette.",
      },
      {
        property: "colors",
        type: "Partial<DefaultColors>",
        default: "lightColors",
        description: "Override individual color tokens.",
      },
      {
        property: "node",
        type: "object",
        default: "width: 150, padding: 10, borderRadius: 3",
        description: "Default node sizing, border and text.",
      },
      {
        property: "edge",
        type: "object",
        default: "strokeWidth: 1, curvature: 0.25",
        description: "Default stroke, routing and markers.",
      },
      {
        property: "handle",
        type: "object",
        default: "size: 6, hitPadding: 4",
        description: "Default handle appearance.",
      },
    ],
  },
  {
    title: "Layout and overlays",
    rows: [
      {
        property: "controls",
        type: "object",
        default: 'visible: true, position: "bottom-left"',
        description: "Visibility, placement and button sizing.",
      },
      {
        property: "minimap",
        type: "object",
        default: 'visible: true, position: "bottom-right"',
        description: "Size, palette and panning.",
      },
      {
        property: "background",
        type: "object",
        default: 'visible: true, variant: "dots", gap: 20',
        description: "Canvas pattern.",
      },
      {
        property: "contextMenu",
        type: "object",
        default: "borderRadius: 8",
        description: "Menu and item styling. Commands use getContextMenuItems.",
      },
    ],
  },
];
const EXAMPLE = `import FlowDiagram from "@/components/diagram/flow-diagram";
import { MainAxisSize, Row } from "flitter-ui";

FlowDiagram({
  data,
  config: { colorMode: "dark", minimap: { visible: false } },
  custom: {
    controls: ({ zoomIn, zoomOut, fitView }) => Row({
      mainAxisSize: MainAxisSize.min,
      children: [zoomOut, fitView, zoomIn],
    }),
  },
});`;
export default function FlowDiagramApi() {
  return (
    <div className="mx-auto max-w-5xl px-5 pb-16 md:px-10">
      <section className="pt-8 pb-6 lg:pt-12">
        <Link href="/diagram/api" className="text-[13px] text-faint">
          API Reference
        </Link>
        <h1 className="display mt-3 text-[clamp(1.75rem,4vw,2.5rem)] text-ink">
          Flow Diagram
        </h1>
        <p className="mt-3 max-w-2xl text-base text-soft">
          The installed preset combines data, config and replaceable widgets.
          Import it from your copied source.
        </p>
      </section>
      <div className="space-y-8">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-ink">Data Format</h2>
          <HighlightedCode code={DATA} lang="typescript" />
        </section>
        <CollapsibleSection title="Default Style Config" defaultOpen>
          <p className="mb-4 text-[13px] text-soft">
            Nested overrides merge with the defaults. The full typed config
            lives in your installed style/config.ts.
          </p>
          <ConfigTable sections={sections} />
        </CollapsibleSection>
        <section>
          <h2 className="mb-3 text-lg font-semibold text-ink">Custom Parts</h2>
          <p className="mb-4 text-[13px] text-soft">
            Every builder is (args, context) → Widget. Parent slots receive
            child widgets with behavior already attached. Leaves receive data
            and derived interaction state.
          </p>
          <ApiTable
            columns={[
              { label: "Part", cell: (s) => s.slot, tone: "name" },
              {
                label: "Args",
                cell: (s) => s.args.map((a) => a.name).join(", "),
                tone: "code",
              },
              { label: "Description", cell: (s) => s.description },
            ]}
            rows={customSlots}
            rowKey={(s) => s.slot}
          />
        </section>
        <section>
          <h2 className="mb-3 text-lg font-semibold text-ink">
            Override Example
          </h2>
          <HighlightedCode code={EXAMPLE} lang="typescript" />
        </section>
        <section>
          <h2 className="mb-3 text-lg font-semibold text-ink">Context</h2>
          <p className="text-[13px] leading-relaxed text-soft">
            Builders receive FlowDiagramController plus the resolved config. Use
            derived args such as isHovered and isSelected to draw your widgets.
            Standard gestures are wired by the engine.{" "}
            <Link
              href="/diagram/api#controller"
              className="text-accent underline"
            >
              Controller methods
            </Link>{" "}
            support application actions such as search, save and adding nodes.
          </p>
        </section>
        <section>
          <h2 className="mb-3 text-lg font-semibold text-ink">
            Geometry and behavior
          </h2>
          <p className="text-[13px] leading-relaxed text-soft">
            Use getHandles for connection points, getEdgePath for routing,
            nodeOptions for per-type interaction metadata, and
            getContextMenuItems for application commands. These strategies
            return data, while custom contains only widgets. See the{" "}
            <Link href="/diagram/api" className="text-accent underline">
              common API
            </Link>{" "}
            for all props and events.
          </p>
        </section>
      </div>
    </div>
  );
}
