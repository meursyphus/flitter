import { listedEntries } from "../_data/gallery/catalog";
import GalleryGrid from "../_components/gallery-grid";

export const metadata = {
  title: "Gallery",
  description:
    "Diagram presets and widget customizations. Preview an example and copy its source.",
};

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-5 pb-20 pt-10 md:px-10 lg:pt-14">
      <h1 className="display text-[clamp(2.25rem,5vw,3.5rem)] text-ink">
        Diagram gallery
      </h1>
      <p className="mb-8 mt-4 max-w-xl text-[17px] leading-relaxed text-soft">
        {listedEntries.length} examples, from the default preset to custom
        widget trees. Open one to preview it and copy the source.
      </p>
      <GalleryGrid filter />
    </div>
  );
}
