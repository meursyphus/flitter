import { Rect, TextOverflow } from "../type";
import { functionalizeClass } from "../utils";
import { StatelessWidget } from "../widget";
import ClipRect from "./ClipRect";
import type { RichTextProps } from "./base/BaseRichText";
import _RichText from "./base/BaseRichText";

class RichText extends StatelessWidget {
  private overflow: TextOverflow;
  private rest;
  constructor({
    overflow = TextOverflow.visible,
    key,
    ...rest
  }: RichTextProps & { key?: any }) {
    super(key);
    this.overflow = overflow;
    this.rest = rest;
  }

  build() {
    return ClipRect({
      clipped: this.overflow === TextOverflow.clip,
      clipper: (size) =>
        Rect.fromLTWH({
          left: 0,
          top: 0,
          width: size.width,
          height: size.width,
        }),
      child: new _RichText({
        overflow: this.overflow,
        ...this.rest,
      }),
    });
  }
}
export default functionalizeClass(RichText);
