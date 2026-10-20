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
  ["Colors, spacing and default sizes", "config", "Tune the installed widgets without replacing their structure."],
  ["Node content, labels, ports and edge visuals", "custom.node, nodeLabel, handle, edge, edgeLabel", "Return your own widgets using supplied data and interaction state."],
  ["Workspace, control layout and minimap", "custom.layout, controls, minimap", "Arrange supplied children, preserving their existing behavior."],
  ["Connection points and edge routing", "getHandles, getEdgePath", "Return geometry that the engine uses for connections and hit testing."],
  ["Automatic node arrangement", "layout", "Choose a graph layout algorithm. custom.layout instead arranges the surrounding UI."],
  ["Gestures, connection rules and permissions", "interaction, can, nodeOptions", "Configure behavior independently from the widgets that display it."],
  ["Application commands and reactions", "getContextMenuItems, on, controller", "Define menu actions, react to events, or update the graph programmatically."],
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
      <header className="pt-8 pb-10 lg:pt-12">
        <p className="mb-3 text-sm font-medium text-accent">Guides</p>
        <h1 className="display text-[clamp(2rem,5vw,3rem)] text-ink">Widget structure</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-soft">
          A diagram is a tree of widgets. Replace a leaf to change its appearance, or a parent to rearrange its children.
        </p>
        <nav aria-label="Guide sections" className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm text-accent">
          {[
            ["widget-tree", "The widget tree"],
            ["how-it-works", "How it works"],
            ["customize", "Replace a widget"],
            ["extension-points", "Choose an extension point"],
          ].map(([id, label]) => <a key={id} href={`#${id}`} className="hover:underline">{label}</a>)}
        </nav>
      </header>

      <div className="space-y-14 text-base leading-7 text-soft">
        <Section id="widget-tree" title="The widget tree">
          <p>
            This is the installed preset&apos;s public composition tree.
            Gesture wrappers and internal render objects are omitted so you can focus on the replaceable parts.
          </p>
          <WidgetTree />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-surface p-5">
              <h3 className="mb-2 font-semibold text-ink">Flow space</h3>
              <p className="text-sm leading-6">
                Nodes, edges, connection previews and alignment guides move with the viewport.
                Their coordinates belong to the graph.
              </p>
            </div>
            <div className="rounded-xl border border-line bg-surface p-5">
              <h3 className="mb-2 font-semibold text-ink">Screen space</h3>
              <p className="text-sm leading-6">
                Controls, toolbars, menus and the selection marquee sit outside the zoom transform.
                A toolbar follows its node without scaling.
              </p>
            </div>
          </div>
          <p className="text-sm">
            <code>nodeBox</code> and <code>edgeBox</code> repeat for each graph item.
            The viewport receives an interleaved <code>items</code> list, preserving paint and hit-test order.
          </p>
        </Section>

        <Section id="how-it-works" title="How the engine builds it">
          <ol className="grid gap-5 sm:grid-cols-2">
            {[
              ["01", "Resolve the preset", "The installed source merges your config with style defaults. Your custom builders replace matching defaults; all other parts remain available."],
              ["02", "Build children and attach behavior", "The engine prepares labels, handles and controls. It wraps interactive visuals with gestures before passing them to their parent builders."],
              ["03", "Compose and measure", "Parent builders place the supplied children. The scene measures node bodies and inline ports after layout, then updates connection geometry."],
              ["04", "Update the affected widgets", "Controller signals rebuild affected node and edge subtrees. Flitter lays out and paints those widgets using SVG or Canvas."],
            ].map(([number, title, description]) => (
              <li key={number} className="rounded-xl border border-line p-5">
                <span className="font-mono text-sm text-accent">{number}</span>
                <h3 className="mt-2 mb-2 font-semibold text-ink">{title}</h3>
                <p className="text-sm leading-6">{description}</p>
              </li>
            ))}
          </ol>
          <p>
            A builder receives <code>(args, context)</code> and returns a <code>Widget</code>.
            Args contain data, derived state and sometimes child widgets.
            Context provides the controller and resolved config.
          </p>
          <p>
            When a node becomes selected, the engine passes <code>isSelected</code> to its builder.
            Your widget draws that state; the controller keeps selection, dragging, connections and history consistent.
          </p>
          <p className="text-sm">
            Builders describe UI. Keep application state in a <code>StatefulWidget</code>, update it with <code>setState()</code>,
            and use <code>GestureDetector</code> for additional application actions.
          </p>
        </Section>

        <Section id="customize" title="Replace a widget, keep its behavior">
          <p>
            These examples reuse <code>data</code> from the{" "}
            <Link href="/diagram/quick-start" className="text-accent underline">Quick Start</Link>.
          </p>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-ink">Start with a node body</h3>
            <p>
              This override changes the body and selection border.
              Reusing <code>label</code> keeps the preset&apos;s label implementation, including its editable text.
              The engine still attaches the node&apos;s standard gestures.
            </p>
            <HighlightedCode code={NODE} lang="typescript" />
            <p className="text-sm">
              For several node designs, dispatch on <code>args.node.type</code> inside <code>custom.node</code>.
              Each design still returns an ordinary Flitter widget.
            </p>
          </div>
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold text-ink">Then rearrange a parent</h3>
            <p>
              <code>custom.controls</code> receives complete button widgets.
              Changing their order changes the layout while preserving zoom, fit and lock actions.
              Use <code>custom.controlButton</code> to change each button&apos;s appearance.
            </p>
            <HighlightedCode code={CONTROLS} lang="typescript" />
          </div>
          <div className="rounded-xl border border-line bg-surface p-5">
            <h3 className="mb-3 font-semibold text-ink">When replacing larger branches</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-6">
              <li>Keep the supplied children you need. Omitting a child also removes its UI and attached interactions.</li>
              <li>Place each inline handle once inside its node. The engine measures its rendered position.</li>
              <li>Preserve scene measurement, attachment placement and item order when replacing <code>viewport</code> or <code>nodeBox</code>.</li>
              <li>Start from the copied <code>base/</code> functions for structural overrides. Return <code>SizedBox.shrink()</code> for an empty visual.</li>
            </ul>
          </div>
          <p>
            See{" "}
            <Link href="/diagram/gallery/automation-workflow" className="text-accent underline">a custom workspace</Link>{" "}
            or{" "}
            <Link href="/diagram/gallery/schema-visualizer" className="text-accent underline">inline ports inside table rows</Link>{" "}
            for complete implementations.
          </p>
        </Section>

        <Section id="extension-points" title="Choose the part you want to change">
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full text-left text-sm leading-6">
              <thead className="bg-surface text-ink">
                <tr>
                  <th className="p-4 font-semibold">What you want to change</th>
                  <th className="p-4 font-semibold">Where it belongs</th>
                </tr>
              </thead>
              <tbody>
                {extensionPoints.map(([change, point, description]) => (
                  <tr key={point} className="border-t border-line align-top">
                    <td className="p-4 text-ink">{change}</td>
                    <td className="p-4">
                      <code className="text-xs text-accent">{point}</code>
                      <p className="mt-1">{description}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Edit the CLI-installed <code>style/parts/</code> files to change shared defaults.
            Pass <code>custom</code> overrides to customize one diagram instance.
          </p>
          <div className="flex flex-wrap gap-4 border-t border-line pt-6">
            <Link href="/diagram/api" className="text-accent underline">Engine API: props, builder args and controller →</Link>
            <Link href="/diagram/api/flow-diagram" className="text-accent underline">Flow Diagram API: preset configuration →</Link>
          </div>
        </Section>
      </div>
    </div>
  );
}
