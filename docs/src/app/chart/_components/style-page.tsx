import Link from "next/link";
import type { StylePageData } from "../_data";

export default async function StylePage({
  data,
}: {
  data: StylePageData;
}) {
  const { title, description, configSections, examples, parent } = data;

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
        <p className="mt-2 text-sm leading-relaxed text-neutral-500">
          {description}
        </p>
      </section>

      {/* Config Sections (collapsible) */}
      {configSections.length > 0 && (
        <section className="px-6 pt-6 md:px-10">
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
                <div
                  className="rounded-lg border border-neutral-100 bg-white p-4"
                  style={{ height: example.height ?? 500 }}
                >
                  {example.chart}
                </div>
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
