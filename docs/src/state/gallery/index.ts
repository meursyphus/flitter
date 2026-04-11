import { create } from "comwit";
import type { GalleryState, GalleryActions } from "./types";
import { gallery } from "./model";
import { galleryActions } from "./actions/sync";

export const useGallery = create<GalleryState, GalleryActions>(gallery, {
  actions: [galleryActions],
});

export type { GalleryState, GalleryActions };
