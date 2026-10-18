import Link from "next/link";
import DiagramGallery from "./gallery";
import ExamplePreview from "./example-preview";

export default function DiagramLanding({ minimalCodeBlock }: { minimalCodeBlock: React.ReactNode }) {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-line">
        <div className="artboard pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 md:px-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:py-20">
          <div>
            <p className="mb-5 text-sm font-semibold text-script">Headless engine. Your widgets.</p>
            <h1 className="wordmark text-[clamp(3.25rem,8vw,6rem)] leading-[0.92] text-ink">Flitter<br /><span className="text-script">Diagram</span></h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-soft">
              Build diagrams with a visual language of your own. Start with source code you can edit;
              let the engine handle graph state, layout and interactions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/diagram/gallery" className="inline-flex h-11 items-center rounded-lg bg-accent px-5 text-sm font-semibold text-on-accent hover:opacity-90">Browse the gallery</Link>
              <Link href="/diagram/installation" className="inline-flex h-11 items-center rounded-lg border border-line-strong px-5 text-sm font-semibold text-ink hover:bg-surface">Install</Link>
            </div>
          </div>
          <div>
            <ExamplePreview slug="workflow" />
            <p className="mt-3 text-sm text-faint">Select a task, then mark it complete. Status cards and their actions are custom widgets.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 lg:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="display text-[clamp(2rem,4vw,3rem)] text-ink">One engine, many compositions</h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-soft">Workflows, people, services, collections. Try each live example, then explore the builders and layouts that make it different.</p>
          </div>
          <Link href="/diagram/gallery" className="text-sm font-semibold text-accent hover:underline">All examples →</Link>
        </div>
        <DiagramGallery featured />
      </section>

      <section className="border-y border-line bg-surface/50">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-10">
          <h2 className="display text-[clamp(2rem,4vw,3rem)] text-ink">Own the parts. Keep the engine.</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-soft">
            Like Flitter Chart, Diagram separates behaviour from presentation.
            The CLI copies a basic xyflow style into your project. Every visual part is a widget builder you can edit, compose or replace.
          </p>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {[
              ["Engine", "Flow manages measurements, gestures, selection, connections and graph state. Layout algorithms work with plain graph data."],
              ["Your source", "FlowDiagram assembles the copied parts. Change nodes, edges, handles, labels, backgrounds, controls and panels in your project."],
              ["Your design", "Use any Flitter widgets, add your own data and actions, or build directly with Flow and a config type you define yourself."],
            ].map(([title, body]) => <div key={title} className="border-l-2 border-script pl-5"><h3 className="font-semibold text-ink">{title}</h3><p className="mt-2 text-sm leading-relaxed text-soft">{body}</p></div>)}
          </div>
          <div className="mt-8 flex flex-wrap gap-6 text-sm font-semibold text-accent">
            <Link href="/diagram/customization" className="hover:underline">Customize a composition →</Link>
            <Link href="/diagram/headless" className="hover:underline">Build your own style →</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:px-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:py-24">
        <div>
          <h2 className="display text-3xl text-ink">A starting point you can change</h2>
          <p className="mt-4 text-base leading-relaxed text-soft">Describe the graph and mount the copied FlowDiagram. Its default boxes and controls get you running; open the source as soon as your product needs a different composition.</p>
          <p className="mt-4 text-base leading-relaxed text-soft">Your widgets run on SVG and Canvas. The same headless behaviour supports both renderers.</p>
          <Link href="/diagram/quick-start" className="mt-6 inline-block text-sm font-semibold text-accent hover:underline">Build and customize your first diagram →</Link>
        </div>
        <div className="min-w-0">{minimalCodeBlock}</div>
      </section>
    </div>
  );
}
