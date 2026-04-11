import { action } from "comwit";
import type { GalleryActions } from "../types";
import { gallery } from "../model";

export const galleryActions = action<GalleryActions>(({ state }) => {
  class GalleryActionsImpl {
    private model = state(gallery);

    setActiveCategory(id: string) {
      this.model.activeCategoryId = id;
    }
  }
  return new GalleryActionsImpl();
});
