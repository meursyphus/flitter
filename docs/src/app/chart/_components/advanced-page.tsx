import Link from "next/link";
import CodeBlock from "@/components/code-block";
import type { AdvancedPageData } from "../_data";

export default async function AdvancedPage({ data }: { data: AdvancedPageData }) {
  const { title, description, code, customElements, scenarios, parent } = data;

  const parentLabel = parent
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const llmUrl = `ui.flitter.dev/llm/chart/${parent}.md`;

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
          Back to {parentLabel}
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-500">
          {description}
        </p>
      </section>

      {/* Scenario Showcase */}
      {scenarios && scenarios.length > 0 && (
        <section className="px-6 pb-4 md:px-10">
          <div className="space-y-10">
            {scenarios.map((s, i) => (
              <div key={s.title}>
                {i > 0 && <div className="mb-10 border-t border-neutral-100" />}
                <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
                  {s.title}
                </h2>
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-neutral-500">
                  {s.description}
                </p>

                {/* Demo area */}
                <div className="mt-4">
                  {s.demo ? (
                    <div className="h-[350px] overflow-hidden rounded-xl border border-neutral-200 bg-white">
                      {s.demo}
                    </div>
                  ) : (
                    <div className="flex h-[350px] items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50/50">
                      <div className="text-center">
                        <p className="text-sm font-medium text-neutral-400">
                          Live Demo
                        </p>
                        <p className="mt-1 text-xs text-neutral-300">
                          Interactive example coming soon
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Code block */}
                {s.code && (
                  <details className="group mt-4">
                    <summary className="cursor-pointer select-none text-xs font-medium text-neutral-400 transition-colors hover:text-neutral-600 [&::-webkit-details-marker]:hidden">
                      <span className="inline-flex items-center gap-1.5">
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="transition-transform group-open:rotate-90"
                        >
                          <path d="M3.5 2l3 3-3 3" />
                        </svg>
                        View source code
                      </span>
                    </summary>
                    <div className="mt-2">
                      <CodeBlock code={s.code} />
                    </div>
                  </details>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Build Faster With AI */}
      <section className="px-6 pt-10 pb-4 md:px-10">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
          Build Faster With AI
        </h2>
        <div className="mt-3 flex flex-col gap-2">
          <p className="text-sm text-neutral-500">
            Describe what you want to customize and let your AI assistant
            generate the renderer code.
          </p>
          <div className="inline-flex items-center gap-2 self-start rounded-full bg-neutral-100 px-4 py-1.5">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-neutral-400"
            >
              <path d="M10 1.5H11.5A1.5 1.5 0 0 1 13 3v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 1 11V3a1.5 1.5 0 0 1 1.5-1.5H4" />
              <path d="M5 1h4v2H5z" />
            </svg>
            <code className="text-sm text-neutral-600">{llmUrl}</code>
          </div>
          <p className="text-xs text-neutral-400">
            Paste this URL into Claude Code or Cursor to generate custom
            renderers instantly.
          </p>
        </div>
      </section>

      {/* Customizable Elements — collapsible */}
      {customElements.length > 0 && (
        <section className="px-6 md:px-10">
          <details className="group">
            <summary className="cursor-pointer select-none list-none text-lg font-semibold tracking-tight text-neutral-900 [&::-webkit-details-marker]:hidden">
              <span className="inline-flex items-center gap-2">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="transition-transform group-open:rotate-90"
                >
                  <path d="M4.5 3l3 3-3 3" />
                </svg>
                Customizable Elements
              </span>
            </summary>
            <p className="mt-2 text-sm text-neutral-500">
              Each scenario above maps to one or more elements below. Every
              visual element can be replaced with a custom renderer function.
              Each function receives element-specific{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-[12px] text-neutral-700">
                args
              </code>{" "}
              and a{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-[12px] text-neutral-700">
                context
              </code>{" "}
              with the full chart state.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-neutral-200 text-left">
                    <th className="pb-2 pr-4 font-medium text-neutral-500">
                      Element
                    </th>
                    <th className="pb-2 pr-4 font-medium text-neutral-500">
                      Args
                    </th>
                    <th className="pb-2 font-medium text-neutral-500">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customElements.map((el) => (
                    <tr
                      key={el.element}
                      className="border-b border-neutral-100 last:border-0"
                    >
                      <td className="py-2 pr-4">
                        <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-[12px] text-neutral-700">
                          {el.element}
                        </code>
                      </td>
                      <td className="py-2 pr-4 text-neutral-600">
                        <code className="text-[12px]">{el.args}</code>
                      </td>
                      <td className="py-2 text-neutral-500 text-[13px]">
                        {el.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </section>
      )}

      {/* Custom Example */}
      <section className="px-6 pt-10 md:px-10">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
          How Custom Renderers Work
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          Override any element by passing a{" "}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-[12px] text-neutral-700">
            custom
          </code>{" "}
          object. Each key maps to an element above, and each value is a
          function that returns a Flitter widget.
        </p>
        <div className="mt-4">
          <CodeBlock code={code.basic} />
        </div>
      </section>

      {/* Footer nav */}
      <section className="px-6 pt-10 pb-16 md:px-10">
        <div className="border-t border-neutral-100 pt-6">
          <div className="flex flex-wrap gap-4 text-sm">
            <Link
              href={`/chart/${parent}`}
              className="text-neutral-500 transition-colors hover:text-neutral-900"
            >
              &larr; {title.replace(" \u2014 Advanced", "")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
