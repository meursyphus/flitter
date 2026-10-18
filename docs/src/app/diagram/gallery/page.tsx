import GalleryGrid from "../_components/gallery-grid";

export const metadata = {
  title: "Gallery",
  description: "Live diagram examples that echo shipping products, filtered by the interactions they use.",
};

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-5 pb-20 pt-10 md:px-10 lg:pt-14">
      <h1 className="display mb-8 text-[clamp(2.25rem,5vw,3.5rem)] text-ink">Diagram gallery</h1>
      <GalleryGrid filter />
    </div>
  );
}
