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

const mountFile = (
  slug: string,
) => `import Widget from "@flitterjs/adapter-react";
import CreateDiagram from "./${slug}";

const diagram = CreateDiagram("light");

export default function App() {
  return <Widget widget={diagram} width="100%" height="600px" renderer="svg" />;
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
    <div className="mx-auto max-w-7xl px-5 pb-20 md:px-10">
      <section className="pt-8 pb-6 lg:pt-12">
        <Link
          href="/diagram/gallery"
          className="inline-flex items-center gap-1 text-base text-soft transition-colors hover:text-ink"
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
      </section>

      <ExamplePreview slug={entry.slug} />

      <details
        className="mt-6 rounded-xl border border-line bg-surface/30 p-5"
        data-example-source
      >
        <summary className="cursor-pointer text-sm font-semibold text-ink">
          Source code
        </summary>
        <div className="my-5">
          <CopyCommand command="npx @flitterjs/cli@latest add flow-diagram" />
        </div>
        <TabbedCode files={files} />
        <p className="mt-5 text-sm text-soft">{entry.customization}</p>
        <p className="mt-3 text-sm text-soft">{entry.tryIt}</p>
        <p className="mt-3 text-sm text-soft">
          Demo data; execution and deployment are simulated.
        </p>
        <div className="mt-5 flex flex-wrap gap-4">
          {entry.references.map((reference) => (
            <a
              key={reference.url}
              href={reference.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-soft hover:text-accent"
            >
              {reference.name} ↗
            </a>
          ))}
        </div>
      </details>

      {related.length > 0 && (
        <section className="pt-14">
          <h2 className="mb-4 text-2xl font-semibold text-ink">Related</h2>
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
