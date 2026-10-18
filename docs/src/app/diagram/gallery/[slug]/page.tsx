import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { examples } from "../../_examples/catalog";
import ExamplePreview from "../../_components/example-preview";
import { HighlightedCode } from "../../_components/code-blocks";

export function generateStaticParams() {
  return examples.map(({ slug }) => ({ slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = examples.find((example) => example.slug === slug);
  return { title: entry?.title ?? "Example", description: entry?.description };
}

export default async function ExamplePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = examples.find((example) => example.slug === slug);
  if (!entry) notFound();
  // Render the very file used by the live preview, including the public imports.
  const source = await readFile(path.join(process.cwd(), "src/app/diagram/_examples", `${entry.slug}.ts`), "utf8");
  const headless = entry.slug === "headless";
  const mount = `import Widget from "@flitterjs/react";\nimport CreateDiagram from "./${entry.slug}";\n\nconst diagram = CreateDiagram("light");\n\nexport default function App() {\n  return <Widget widget={diagram} width="100%" height="540px" renderer="svg" />;\n}`;
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-10 lg:py-14">
      <Link href="/diagram/gallery" className="text-sm text-accent hover:underline">← All examples</Link>
      <p className="mt-7 text-xs font-medium uppercase tracking-wide text-faint">{entry.layout}</p>
      <h1 className="display mt-2 text-4xl text-ink">{entry.title}</h1>
      <p className="mt-4 mb-7 max-w-2xl text-lg leading-relaxed text-soft">{entry.description}</p>
      <ExamplePreview slug={entry.slug} />
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="text-xl font-semibold text-ink">How this composition works</h2>
          <p className="mt-3 text-sm leading-relaxed text-soft">{entry.concept}</p>
          <p className="mt-3 text-sm leading-relaxed text-soft">The engine supplies measurement, graph state, hit testing and gestures. The widgets in this example own the appearance.</p>
          <Link href={headless ? "/diagram/headless" : "/diagram/customization"} className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">{headless ? "Build directly with Flow" : "Understand builders and source ownership"} →</Link>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-ink">Make it yours</h2>
          <ul className="mt-3 space-y-4">
            {entry.edits.map((edit) => <li key={edit.file}>
              <code className="break-words text-xs text-accent">{edit.file}</code>
              <p className="mt-1 text-sm leading-relaxed text-soft">{edit.change}</p>
            </li>)}
          </ul>
        </section>
      </div>
      <section className="mt-12 space-y-4">
        <h2 className="text-xl font-semibold text-ink">Use this example</h2>
        <p className="text-sm leading-relaxed text-soft">{headless ? "Install the engine and adapter. This example needs no copied preset." : "Install the adapter and copy the starter style, then save the source below in your project."} See <Link href="/diagram/installation" className="text-accent hover:underline">Installation</Link> for Svelte and path aliases.</p>
        <HighlightedCode code={headless ? "npm install flitter-ui @flitterjs/react" : "npm install @flitterjs/react\nnpx flitter-ui init\nnpx flitter-ui add flow-diagram"} lang="bash" />
        <h3 className="font-semibold text-ink">{entry.slug}.ts</h3>
        <p className="text-sm text-soft">This is the complete source running above. The light/dark argument is supplied by the site theme in the preview.</p>
        <HighlightedCode code={source} lang="typescript" />
        <h3 className="font-semibold text-ink">Mount the widget</h3>
        <HighlightedCode code={mount} lang="tsx" />
        <p className="text-sm text-soft">Keep the widget instance stable in the adapter. For application state, use a Flitter StatefulWidget and dispose any controller you create with its State.</p>
      </section>
    </div>
  );
}
