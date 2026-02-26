import Link from "next/link";
import ChartPreview from "@/components/ChartPreview";
import CodeBlock from "@/components/CodeBlock";
import type { ChartPageData } from "../_data/charts";

export default async function AdvancedPage({ data }: { data: ChartPageData }) {
  const { title, description, code, customElements, parent } = data;

  const parentLabel = parent
    ? parent
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "";

  const llmUrl = parent
    ? `comwit.io/llm/chart/${parent}.md`
    : null;

  return (
    <div className="-mx-6 -mt-8 md:-mx-10">
      {/* Header */}
      <section className="px-6 pt-10 pb-8 md:px-10">
        {parent && (
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
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-neutral-500">
          {description}
        </p>
      </section>

      {/* LLM Native hint */}
      {llmUrl && (
        <section className="px-6 pb-4 md:px-10">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-neutral-500">
              Tell your AI agent what you want to customize.
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
              Paste this URL into Claude Code or Cursor to generate custom renderers instantly.
            </p>
          </div>
        </section>
      )}

      {/* Customizable Elements — collapsible */}
      {customElements && customElements.length > 0 && (
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
              Every visual element can be replaced with a custom renderer
              function. Each function receives element-specific{" "}
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
      {code?.basic && (
        <section className="px-6 pt-10 md:px-10">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
            Usage
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Override any element by passing a{" "}
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-[12px] text-neutral-700">
              custom
            </code>{" "}
            object.
          </p>
          <div className="mt-4">
            <CodeBlock code={code.basic} />
          </div>
        </section>
      )}

      {/* Preview */}
      <section className="px-6 pt-10 md:px-10">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
          Preview
        </h2>
        <div className="mt-4">
          <ChartPreview height={300} />
        </div>
      </section>

      {/* Footer nav */}
      <section className="px-6 pt-10 pb-16 md:px-10">
        <div className="border-t border-neutral-100 pt-6">
          <div className="flex flex-wrap gap-4 text-sm">
            {parent && (
              <Link
                href={`/chart/${parent}`}
                className="text-neutral-500 transition-colors hover:text-neutral-900"
              >
                &larr; {title.replace(" — Advanced", "")}
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
