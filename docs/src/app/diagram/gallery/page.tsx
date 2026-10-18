import Link from "next/link";
import DiagramGallery from "../_components/gallery";

export const metadata = {
  title: "Gallery",
  description: "Explore live headless diagram examples: workflows, org charts, service maps, database schemas, nested groups, resource boards and a style built from scratch.",
};

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-20 pt-10 md:px-10 lg:pt-14">
      <h1 className="display text-[clamp(2.25rem,5vw,3.5rem)] text-ink">Diagram gallery</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-soft">
        Different products, layouts and visual languages on one headless engine.
        Each example runs live: move nodes, select elements, switch renderers, then open the source and make it yours.
      </p>
      <p className="mt-4 mb-9 text-sm text-soft">
        These are starting points you can edit. <Link href="/diagram/customization" className="font-semibold text-accent hover:underline">Learn how the parts fit together →</Link>
      </p>
      <DiagramGallery />
    </div>
  );
}
