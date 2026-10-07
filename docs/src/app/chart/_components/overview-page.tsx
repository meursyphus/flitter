import Link from "next/link";
import CodeBlock from "@/components/code-block";
import CopyCommand from "@/components/copy-command";
import type { OverviewPageData } from "../_data";

export default async function OverviewPage({
  data,
}: {
  data: OverviewPageData;
}) {
  const { title, description, quickStartCode, slug } = data;

  return (
    <div className="mx-auto max-w-5xl px-5 md:px-10">
      {/* Header */}
      <section className="pt-10 pb-2">
        <h1 className="display text-[clamp(2rem,5vw,3rem)] text-ink">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-soft">
          {description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <CopyCommand command={`npx flitter-ui add ${slug[0]}`} />

          <Link
            href={`/chart/gallery`}
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-[13px] font-medium text-soft transition-colors hover:border-accent hover:text-ink"
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
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-[13px] font-medium text-soft transition-colors hover:border-accent hover:text-ink"
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
            <summary className="flex cursor-pointer select-none items-center gap-2 rounded-md border border-line bg-surface px-3 py-2 text-[13px] font-medium text-soft transition-colors hover:text-ink">
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
              <p className="mt-3 text-[13px] text-faint">
                See{" "}
                <Link
                  href="/integration"
                  className="text-soft underline underline-offset-2 hover:text-ink"
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
