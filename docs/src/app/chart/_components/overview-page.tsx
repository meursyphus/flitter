import Link from "next/link";
import CodeBlock from "@/components/code-block";
import type { OverviewPageData } from "../_data";

export default async function OverviewPage({
  data,
}: {
  data: OverviewPageData;
}) {
  const { title, description, quickStartCode, slug, styles, hasAdvanced } =
    data;

  return (
    <div className="-mx-6 -mt-8 md:-mx-10">
      {/* Header */}
      <section className="px-6 pt-10 pb-4 md:px-10">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-neutral-500 max-w-xl">
          {description}
        </p>
      </section>

      {/* Quick Start Code */}
      {quickStartCode && (
        <section className="px-6 pt-6 md:px-10">
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

      {/* Styles */}
      {styles && styles.length > 0 && (
        <section className="px-6 pt-14 md:px-10">
          <div className="space-y-12">
            {styles.map((style) => (
              <div key={style.slug.join("/")}>
                <div className="mb-3">
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      {style.title}
                    </h3>
                    {style.inspiration && (
                      <span className="text-[11px] text-neutral-400">
                        {style.reference ? (
                          <a
                            href={style.reference}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-2 hover:text-neutral-600"
                          >
                            {style.inspiration}
                          </a>
                        ) : (
                          style.inspiration
                        )}
                      </span>
                    )}
                    <Link
                      href={`/chart/${style.slug.join("/")}`}
                      className="ml-auto text-[13px] font-medium text-neutral-500 transition-colors hover:text-neutral-900"
                    >
                      Details &rarr;
                    </Link>
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">
                    {style.tagline}
                  </p>
                </div>
                <div className="h-125">{style.chart}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Go Deeper */}
      {hasAdvanced && (
        <section className="px-6 pt-10 pb-16 md:px-10">
          <h2 className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-4">
            Go Deeper
          </h2>
          <Link
            href={`/chart/${slug[0]}/advanced`}
            className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
          >
            Advanced &mdash; Custom renderers, headless API &rarr;
          </Link>
        </section>
      )}
    </div>
  );
}
