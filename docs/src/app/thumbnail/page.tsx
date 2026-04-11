import { galleryEntries } from "../chart/_data/gallery/entries.generated";
import ThumbnailGrid from "./renderer";

export default function ThumbnailPage() {
  const entries = galleryEntries.map((e) => ({
    slug: e.slug,
    Component: e.Component,
  }));
  return <ThumbnailGrid entries={entries} />;
}
