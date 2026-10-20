import GalleryGrid from "../_components/gallery-grid";

export const metadata = {
  title: "Diagram gallery",
  description: "Interactive diagram applications with editable source.",
};
export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-20 pt-12 md:px-10">
      <h1 className="display mb-8 text-[clamp(2.5rem,5vw,4rem)] text-ink">
        Diagrams
      </h1>
      <GalleryGrid filter />
    </div>
  );
}
