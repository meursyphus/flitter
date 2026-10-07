import type { Element } from "../element";
import type { Path, Size } from "../type";
import { classToFunction } from "../utils";
import { StatelessWidget } from "../widget";
import type Widget from "../widget/Widget";
import BaseClipPath from "./base/BaseClipPath";

class ClipPath extends StatelessWidget {
  clipped: boolean;
  child?: Widget;
  clipper: (size: Size) => Path;
  constructor({
    child,
    clipped = true,
    key,
    clipper,
  }: {
    key?: any;
    child?: Widget;
    clipper: (size: Size) => Path;
    clipped?: boolean;
  }) {
    super(key);
    this.child = child;
    this.clipper = clipper;
    this.clipped = clipped;
  }

  build(_: Element): Widget {
    // Keep the render-object wrapper so toggling clipping preserves child state.
    return new BaseClipPath({
      child: this.child,
      clipper: this.clipper,
      clipped: this.clipped,
    });
  }
}

export default classToFunction(ClipPath);
