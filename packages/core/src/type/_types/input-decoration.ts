import type { Widget } from "../../widget";
import type { Border, EdgeInsets, TextStyle } from "..";

export type InputDecorationProps = {
  hintText?: string;
  labelText?: string;
  hintStyle?: TextStyle;
  labelStyle?: TextStyle;
  prefixIcon?: Widget;
  suffixIcon?: Widget;
  border?: Border;
  focusedBorder?: Border;
  contentPadding?: EdgeInsets;
};

/** Optional labels, hints and adornments around a TextField. */
export default class InputDecoration {
  readonly hintText?: string;
  readonly labelText?: string;
  readonly hintStyle?: TextStyle;
  readonly labelStyle?: TextStyle;
  readonly prefixIcon?: Widget;
  readonly suffixIcon?: Widget;
  readonly border?: Border;
  readonly focusedBorder?: Border;
  readonly contentPadding?: EdgeInsets;
  constructor(props: InputDecorationProps = {}) {
    Object.assign(this, props);
  }
}
