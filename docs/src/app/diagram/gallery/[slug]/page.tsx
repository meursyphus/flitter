import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import CopyCommand from "@/components/copy-command";
import { highlight } from "@/lib/highlight";
import {
  findEntry,
  listedEntries,
  relatedEntries,
} from "../../_data/gallery/catalog";

import ExamplePreview from "../../_components/example-preview";
import GalleryCard from "../../_components/gallery-card";
import TabbedCode from "../../_components/tabbed-code";

export function generateStaticParams() {
  return listedEntries.map(({ slug }) => ({ slug }));
}
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = findEntry(slug);
  return {
    title: entry?.title ?? "Example",
    description:
      entry?.description ?? "A live diagram built from replaceable widgets.",
  };
}

const mountFile = (slug: string) => `import Widget from "@flitterjs/adapter-react";
import CreateDiagram from "./${slug}";

const diagram = CreateDiagram("light");

export default function App() {
  return <Widget widget={diagram} width="100%" height="540px" renderer="svg" />;
}
`;

export default async function ExamplePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = findEntry(slug);
  if (!entry) notFound();
  // The file the live stage runs, read at build time.
  const source = await readFile(
    path.join(
      process.cwd(),
      "src/app/diagram/_examples",
      `${entry.file ?? entry.slug}.ts`,
    ),
    "utf8",
  );
  const mount = mountFile(entry.slug);
  const files = [
    {
      filename: `${entry.slug}.ts`,
      code: source,
      html: await highlight(source, "typescript"),
    },
    { filename: "mount.tsx", code: mount, html: await highlight(mount, "tsx") },
  ];
  const related = relatedEntries(entry.slug);

  return (
    <div className="mx-auto max-w-5xl px-5 pb-20 md:px-10">
      <section className="pt-8 pb-6 lg:pt-12">
        <Link
          href="/diagram/gallery"
          className="inline-flex items-center gap-1 text-[13px] text-faint transition-colors hover:text-ink"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M7.5 2.5L4 6l3.5 3.5" />
          </svg>
          Gallery
        </Link>
        <h1 className="display mt-4 text-[clamp(1.75rem,4vw,2.75rem)] text-ink">
          {entry.title}
        </h1>
        <p className="mt-2 text-[13px] text-faint">
          {entry.description ??
            "Custom widgets composed on the installed flow-diagram preset."}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-line px-3 py-1.5 text-[12px] text-soft">
            Default
          </span>
          <CopyCommand command="npx @flitterjs/cli@latest add flow-diagram" />
        </div>
      </section>

      <ExamplePreview slug={entry.slug} />

      <section className="pt-6 text-[13px] leading-relaxed text-soft">
        {entry.customParts?.length ? (
          <>
            Replaces <code>{entry.customParts.join(", ")}</code>. The engine
            keeps drag, selection, hover and connection behavior attached.
          </>
        ) : (
          <>
            Install the preset, then pass your data and config. Replace any
            widget through <code>custom</code>.
          </>
        )}
        <p className="mt-2">
          The command installs the shared preset. Copy the example below into
          your project to use this variation.
        </p>
      </section>
      <section className="pt-8">
        <h2 className="mb-4 text-[15px] font-semibold text-ink">Code</h2>
        <TabbedCode files={files} />
      </section>

      {related.length > 0 && (
        <section className="pt-14">
          <h2 className="mb-4 text-[15px] font-semibold text-ink">Related</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {related.map((other) => (
              <GalleryCard key={other.slug} entry={other} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
