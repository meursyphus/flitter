import Link from "next/link";
import type { StylePageData } from "../_data";
import CodePreview from "./code-preview";

export default async function StylePage({
  data,
}: {
  data: StylePageData;
}) {
  const { title, description, configSections, examples, parent, styleMeta } = data;

  return (
    <div className="-mx-6 -mt-8 md:-mx-10">
      {/* Header */}
      <section className="px-6 pt-10 pb-8 md:px-10">
        <Link
          href={`/chart/${parent}`}
          className="mb-3 inline-flex items-center gap-1 text-xs text-neutral-400 transition-colors hover:text-neutral-600"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M7.5 9L4.5 6l3-3" />
          </svg>
          Back to{" "}
          {parent
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")}
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          {title}
        </h1>
        {styleMeta?.inspiration && (
          <p className="mt-1 text-[11px] text-neutral-400">
            {styleMeta.reference ? (
              <a
                href={styleMeta.reference}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-neutral-600"
              >
                {styleMeta.inspiration}
              </a>
            ) : (
              styleMeta.inspiration
            )}
          </p>
        )}
        <p className="mt-2 text-sm leading-relaxed text-neutral-500">
          {description}
        </p>
      </section>

      {/* Config Sections (collapsible) */}
      {configSections.length > 0 && (
        <section className="px-6 pt-6 md:px-10">
          <p className="mb-3 text-[13px] leading-relaxed text-neutral-400">
            All configuration is optional — the defaults are production-ready.
            Expand to see every available property.
          </p>
          <details className="group">
            <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-neutral-900 select-none">
              <svg
                className="h-3.5 w-3.5 text-neutral-400 transition-transform group-open:rotate-90"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4.5 2.5l4 3.5-4 3.5" />
              </svg>
              Configuration
            </summary>
            <div className="mt-6 space-y-8">
              {configSections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-semibold text-neutral-900">
                    {section.title}
                  </h3>
                  {section.description && (
                    <p className="mt-1 text-[13px] text-neutral-500">
                      {section.description}
                    </p>
                  )}
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-[13px]">
                      <thead>
                        <tr className="border-b border-neutral-200 text-left">
                          <th className="pb-2 pr-4 font-medium text-neutral-500">Property</th>
                          <th className="pb-2 pr-4 font-medium text-neutral-500">Type</th>
                          <th className="pb-2 pr-4 font-medium text-neutral-500">Default</th>
                          <th className="pb-2 font-medium text-neutral-500">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.rows.map((row) => (
                          <tr key={row.property} className="border-b border-neutral-100 last:border-0">
                            <td className="py-2 pr-4">
                              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-[12px] text-neutral-700">
                                {row.property}
                              </code>
                            </td>
                            <td className="py-2 pr-4 text-neutral-600">
                              <code className="text-[12px]">{row.type}</code>
                            </td>
                            <td className="py-2 pr-4 text-neutral-600">
                              <code className="text-[12px]">{row.default}</code>
                            </td>
                            <td className="py-2 text-neutral-500">
                              {row.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </details>
          <p className="mt-4 text-[11px] text-neutral-400">
            Tip: Paste{" "}
            <a
              href="https://ui.flitter.dev/llm/chart.md"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-neutral-600"
            >
              ui.flitter.dev/llm/chart.md
            </a>{" "}
            into your AI assistant to explore config options interactively.
          </p>
        </section>
      )}

      {/* Chart Examples */}
      {examples && examples.length > 0 && (
        <section className="px-6 pt-8 md:px-10">
          <div className="space-y-6">
            {examples.map((example) => (
              <div key={example.title}>
                <h3 className="mb-3 text-sm font-semibold text-neutral-900">
                  {example.title}
                </h3>
                <CodePreview
                  chart={example.chart}
                  code={example.code}
                  height={example.height ?? 500}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer nav */}
      <section className="px-6 pt-10 pb-16 md:px-10">
        <div className="border-t border-neutral-100 pt-6">
          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              href={`/chart/${parent}/advanced`}
              className="text-neutral-500 transition-colors hover:text-neutral-900"
            >
              Advanced &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
