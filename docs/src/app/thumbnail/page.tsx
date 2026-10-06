import { galleryEntries } from "../chart/_data/gallery/entries.generated";
import ThumbnailGrid from "./renderer";

export default function ThumbnailPage() {
  const entries = galleryEntries.map((e) => ({
    slug: e.slug,
    createWidget: e.createWidget,
  }));
  return <ThumbnailGrid entries={entries} />;
}
