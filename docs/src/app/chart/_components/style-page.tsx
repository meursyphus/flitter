import Link from "next/link";
import ChartPreview from "@/components/chart-preview";
import CodeBlock from "@/components/code-block";
import type { StylePageData } from "../_data";

export type ChartExample = {
  label: string;
  component: React.ReactNode;
};

export default async function StylePage({
  data,
  examples,
}: {
  data: StylePageData;
  examples?: ChartExample[];
}) {
  const { title, description, code, parent } = data;

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

      {/* Config Type — collapsible */}
      {code.fullConfigType && (
        <section className="px-6 pt-6 md:px-10">
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
                Config Type
              </span>
            </summary>
            <p className="mt-2 text-sm text-neutral-500">
              All configuration fields with their types and defaults.
            </p>
            <div className="mt-4">
              <CodeBlock code={code.fullConfigType} />
            </div>
          </details>
        </section>
      )}

      {/* Usage Example */}
      {code.config && (
        <section className="px-6 pt-10 md:px-10">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
            Usage
          </h2>
          <div className="mt-4">
            <CodeBlock code={code.config} />
          </div>
        </section>
      )}

      {/* Examples — from props */}
      {examples && examples.length > 0 && (
        <section className="px-6 pt-10 md:px-10">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
            Examples
          </h2>
          <div className="mt-6 space-y-8">
            {examples.map((ex) => (
              <div key={ex.label}>
                <h3 className="text-sm font-medium text-neutral-700">
                  {ex.label}
                </h3>
                <div className="mt-3">{ex.component}</div>
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
