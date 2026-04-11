import Link from "next/link";
import CodeBlock from "@/components/code-block";
import type { OverviewPageData } from "../_data";

export default async function OverviewPage({
  data,
}: {
  data: OverviewPageData;
}) {
  const { title, description, quickStartCode, slug } = data;

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <section className="pt-10 pb-2">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          {title}
        </h1>
        <p className="mt-2 text-base leading-relaxed text-neutral-500 max-w-2xl">
          {description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="inline-flex flex-col gap-1 rounded-lg bg-neutral-50 border border-neutral-200 px-3 py-2">
            <code className="text-xs text-neutral-600">
              <span className="text-teal-500">$</span> npx flitter-ui add {slug[0]}
            </code>
          </div>

          <Link
            href={`/chart/gallery`}
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-medium text-neutral-600 transition-all hover:border-teal-300 hover:text-teal-700 hover:shadow-sm"
          >
            Gallery
            <svg
              width="10"
              height="10"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M4.5 2.5L8 6l-3.5 3.5" />
            </svg>
          </Link>

          <Link
            href={`/chart/api/${slug[0]}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-medium text-neutral-600 transition-all hover:border-teal-300 hover:text-teal-700 hover:shadow-sm"
          >
            API Reference
            <svg
              width="10"
              height="10"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M4.5 2.5L8 6l-3.5 3.5" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Quick Start Code (always show if available) ── */}
      {quickStartCode && (
        <section className="pt-6">
          <details className="group max-w-2xl">
            <summary className="flex cursor-pointer items-center gap-2 rounded-md bg-neutral-100 px-3 py-2 text-xs font-medium uppercase tracking-widest text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-700 select-none">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-open:rotate-90"
              >
                <path d="M4.5 2.5L8 6l-3.5 3.5" />
              </svg>
              Quick Start
            </summary>
            <div className="mt-4">
              <CodeBlock code={quickStartCode} lang="tsx" />
              <p className="mt-3 text-[13px] text-neutral-400">
                See{" "}
                <Link
                  href="/integration"
                  className="text-neutral-600 underline underline-offset-2 hover:text-neutral-900"
                >
                  Integration guide
                </Link>{" "}
                for Svelte, vanilla JS, and more options.
              </p>
            </div>
          </details>
        </section>
      )}
    </div>
  );
}
