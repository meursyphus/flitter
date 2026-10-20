import Link from "next/link";
import { HighlightedCode } from "../_components/code-blocks";
import WidgetTree from "../_components/widget-tree";

export const metadata = {
  title: "Widget Structure",
  description: "Explore the diagram widget tree, how the engine composes it, and what each custom builder can replace.",
};

const NODE = `import FlowDiagram from "@/components/diagram/flow-diagram";
import { Border, BoxDecoration, Container, EdgeInsets } from "flitterjs";

FlowDiagram({
  data,
  custom: {
    node: ({ label, isSelected }, { config }) => Container({
      width: 180,
      padding: EdgeInsets.all(16),
      decoration: new BoxDecoration({
        color: config.colors.nodeBackground,
        border: Border.all({
          color: isSelected
            ? config.colors.nodeSelectedBorder
            : config.colors.nodeBorder,
          width: 2,
        }),
      }),
      child: label,
    }),
  },
});`;

const CONTROLS = `import { MainAxisSize, Row } from "flitterjs";

FlowDiagram({
  data,
  custom: {
    controls: ({ zoomIn, zoomOut, fitView, interactive }) => Row({
      mainAxisSize: MainAxisSize.min,
      children: [zoomOut, fitView, zoomIn, interactive],
    }),
  },
});`;

const extensionPoints = [
  ["Colors, spacing and sizes", "config"],
  ["Nodes, labels, ports and edges", "custom.node, custom.nodeLabel, custom.handle, custom.edge, custom.edgeLabel"],
  ["Workspace and overlays", "custom.layout, custom.controls, custom.minimap"],
  ["Connection points and routing", "getHandles, getEdgePath"],
  ["Graph node positions", "layout"],
  ["Gestures and permissions", "interaction, can, nodeOptions"],
  ["Commands and events", "getContextMenuItems, on, controller"],
];

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="space-y-5">
      <h2 id={id} className="scroll-mt-24 text-2xl font-semibold tracking-tight text-ink">{title}</h2>
      {children}
    </section>
  );
}

export default function WidgetStructurePage() {
  return (
    <div className="mx-auto max-w-5xl px-5 pb-16 md:px-10">
      <header className="pt-8 pb-6 lg:pt-12">
        <h1 className="display text-[clamp(2rem,5vw,3rem)] text-ink">Widget structure</h1>
      </header>

      <div className="space-y-14 text-base leading-7 text-soft">
        <section id="widget-tree" aria-label="Widget tree" className="scroll-mt-24 space-y-5">
          <WidgetTree />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-surface p-5">
              <h3 className="mb-2 font-semibold text-ink">Flow space</h3>
              <p className="text-sm leading-6">
                Nodes, edges and guides pan and zoom with the graph.
              </p>
            </div>
            <div className="rounded-xl border border-line bg-surface p-5">
              <h3 className="mb-2 font-semibold text-ink">Screen space</h3>
              <p className="text-sm leading-6">
                Controls, toolbars, menus and the selection marquee keep their size during zoom.
              </p>
            </div>
          </div>
          <p className="text-sm">
            <code>nodeBox</code> and <code>edgeBox</code> repeat for each graph item.
            The viewport receives an interleaved <code>items</code> list, preserving paint and hit-test order.
          </p>
        </section>

        <Section id="how-it-works" title="How it works">
          <ol className="grid gap-5 sm:grid-cols-2">
            {[
              ["01", "Resolve defaults", "Merge config and custom overrides with the preset."],
              ["02", "Attach behavior", "Build labels, ports and buttons. Attach gestures before passing children to their parents."],
              ["03", "Measure", "Lay out widgets, measure node bodies and inline ports, then update connection geometry."],
              ["04", "Render", "Controller signals rebuild affected subtrees. Flitter paints them with SVG or Canvas."],
            ].map(([number, title, description]) => (
              <li key={number} className="rounded-xl border border-line p-5">
                <span className="font-mono text-sm text-accent">{number}</span>
                <h3 className="mt-2 mb-2 font-semibold text-ink">{title}</h3>
                <p className="text-sm leading-6">{description}</p>
              </li>
            ))}
          </ol>
          <code className="block text-sm text-ink">(args, context) =&gt; Widget</code>
          <p>
            <code>args</code>: data, interaction state and child widgets.{" "}
            <code>context</code>: controller and resolved config.
          </p>
          <p className="text-sm">
            Use <code>StatefulWidget</code> and <code>setState()</code> for application state.
            Add application actions with <code>GestureDetector</code>.
          </p>
        </Section>

        <Section id="customize" title="Custom widgets">
          <p>
            <code>data</code> from{" "}
            <Link href="/diagram/quick-start" className="text-accent underline">Quick Start</Link>.
          </p>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-ink">Node body</h3>
            <p>
              Reuse <code>label</code> to keep editable text. The engine attaches node gestures.
            </p>
            <HighlightedCode code={NODE} lang="typescript" />
            <p className="text-sm">
              For several node designs, dispatch on <code>args.node.type</code> inside <code>custom.node</code>.
            </p>
          </div>
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold text-ink">Control layout</h3>
            <p>
              Supplied buttons already have actions. Change their appearance with <code>custom.controlButton</code>.
            </p>
            <HighlightedCode code={CONTROLS} lang="typescript" />
          </div>
          <div className="rounded-xl border border-line bg-surface p-5">
            <h3 className="mb-3 font-semibold text-ink">Structural overrides</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-6">
              <li>Omitting a supplied child removes its UI and interactions.</li>
              <li>Place each inline handle once so the engine can measure its position.</li>
              <li>Preserve scene measurement, attachment placement and item order when replacing <code>viewport</code> or <code>nodeBox</code>.</li>
              <li>Start from the copied <code>base/</code> functions for structural overrides. Return <code>SizedBox.shrink()</code> for an empty visual.</li>
            </ul>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/diagram/gallery/automation-workflow" className="text-accent underline">Workspace example →</Link>
            <Link href="/diagram/gallery/schema-visualizer" className="text-accent underline">Inline ports example →</Link>
          </div>
        </Section>

        <Section id="extension-points" title="Extension points">
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full text-left text-sm leading-6">
              <thead className="bg-surface text-ink">
                <tr>
                  <th className="p-4 font-semibold">Change</th>
                  <th className="p-4 font-semibold">API</th>
                </tr>
              </thead>
              <tbody>
                {extensionPoints.map(([change, point]) => (
                  <tr key={point} className="border-t border-line align-top">
                    <td className="p-4 text-ink">{change}</td>
                    <td className="p-4">
                      <code className="text-xs text-accent">{point}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Edit <code>style/parts/</code> for shared defaults; use <code>custom</code> for one diagram instance.
          </p>
          <div className="flex flex-wrap gap-4 border-t border-line pt-6">
            <Link href="/diagram/api" className="text-accent underline">Engine API →</Link>
            <Link href="/diagram/api/flow-diagram" className="text-accent underline">Flow Diagram API →</Link>
          </div>
        </Section>
      </div>
    </div>
  );
}
