import { model } from "comwit";
import type { GalleryState } from "./types";

export const gallery = model<GalleryState>({
  activeCategoryId: "",
});
