import { listedEntries } from "../_data/gallery/catalog";
import GalleryGrid from "../_components/gallery-grid";

export const metadata = {
  title: "Gallery",
  description: "Live diagram examples that echo shipping products, filtered by the interactions they use.",
};

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-5 pb-20 pt-10 md:px-10 lg:pt-14">
      <h1 className="display text-[clamp(2.25rem,5vw,3.5rem)] text-ink">Diagram gallery</h1>
      <p className="mb-8 mt-4 max-w-xl text-[17px] leading-relaxed text-soft">
        {listedEntries.length} editors in the spirit of shipping products. Filter by interaction, open one for its live stage and source.
      </p>
      <GalleryGrid filter />
    </div>
  );
}
