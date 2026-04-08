
export default function ChartLanding() {
  return (
    <div className="mx-auto max-w-5xl">
      {/* Hero */}
      <section className="relative pt-14 pb-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Charts
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-neutral-600">
            This is not a chart config wrapper.{" "}
            <span className="font-semibold text-neutral-900">
              It&apos;s a rendering engine.
            </span>
          </p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-500">
            Every chart is a tree of widgets — Container, Stack, Positioned, Text. Run{" "}
            <code className="font-mono text-neutral-700">npx flitter-ui add</code> to get the source. Read it. Change it. Own it.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-neutral-50 border border-neutral-200 px-4 py-2">
              <code className="text-sm text-neutral-600">
                <span className="text-teal-500">$</span> npx flitter-ui add bar-chart
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* How It's Different */}
      <section className="pb-10">
        <h2 className="mb-6 text-lg font-bold tracking-tight text-neutral-900">
          How It&apos;s Different
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Config Libraries */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <span className="inline-block rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-500">
              Config Libraries
            </span>
            <pre className="mt-4 overflow-x-auto rounded-lg bg-neutral-50 border border-neutral-200 px-4 py-3 text-[13px] leading-relaxed text-neutral-700">
              <code>{`barChart({
  tooltip: {
    backgroundColor: '#333',
    fontSize: 13
  }
})`}</code>
            </pre>
            <p className="mt-3 text-sm leading-relaxed text-neutral-500">
              Hope the option exists. File an issue if it doesn&apos;t.
            </p>
          </div>
          {/* Flitter */}
          <div className="rounded-xl border border-teal-200 bg-teal-50/40 p-5">
            <span className="inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700">
              Flitter
            </span>
            <pre className="mt-4 overflow-x-auto rounded-lg bg-white border border-teal-200 px-4 py-3 text-[13px] leading-relaxed text-neutral-700">
              <code>{`custom: {
  tooltip: (args) =>
    Container({
      child: YourComponent(args)
    })
}`}</code>
            </pre>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              It&apos;s a widget. Put anything inside it.
            </p>
          </div>
        </div>
      </section>

      {/* What You Can Build */}
      <section className="pb-10">
        <h2 className="mb-2 text-lg font-bold tracking-tight text-neutral-900">
          What You Can Build
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-neutral-500">
          Because every element is a composable widget, not a config option.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Dashboard Cross-Filtering",
              desc: "Click a bar in one chart to filter every other chart on the page. Share state across widgets \u2014 no plugin needed.",
            },
            {
              title: "Drill-Down Navigation",
              desc: "Click a category to zoom into sub-categories. Each level is a new widget tree with animated transitions.",
            },
            {
              title: "Real-Time Streaming",
              desc: "Push new data points and watch the chart animate. The widget tree rebuilds efficiently on every update.",
            },
            {
              title: "Custom Tooltips & Overlays",
              desc: "Replace any tooltip with a rich card \u2014 images, sparklines, action buttons. It\u2019s a widget slot, not a config property.",
            },
            {
              title: "Threshold Annotations",
              desc: "Overlay target lines, bands, and callout labels. The plot area is a Stack \u2014 position anything on top.",
            },
            {
              title: "Interactive Data Editing",
              desc: "Drag bars to change values. The chart recalculates in real-time. GestureDetector on any widget makes it interactive.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-neutral-200 bg-white p-5"
            >
              <h3 className="text-sm font-semibold text-neutral-900">
                {item.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-neutral-500">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Works With AI Assistants */}
      <section className="pb-10">
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h3 className="text-base font-bold text-neutral-900">
            Works With AI Assistants
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-neutral-500">
            The full chart API is published at a single URL. Feed it to Claude Code, Cursor, or any AI coding assistant for instant chart generation.
          </p>
          <a
            href="https://ui.flitter.dev/llm/chart.md"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-mono text-teal-700 transition-colors hover:border-teal-300 hover:bg-teal-50"
          >
            ui.flitter.dev/llm/chart.md
          </a>
          <p className="mt-2 text-xs text-neutral-400">
            A fast way to explore the API and generate custom charts.
          </p>
        </div>
      </section>

    </div>
  );
}
