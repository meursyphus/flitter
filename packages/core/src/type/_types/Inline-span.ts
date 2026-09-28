import type TextStyle from "./text-style";
import type { Paragraph } from "./text-painter";

/**
 * The difference between two text-rendering objects, in terms of how much
 * damage it does to the rendering.
 *
 * The values are ordered by increasing cost; a value with index N implies
 * all the values with index less than N (`layout` implies `paint`).
 */
export enum RenderComparison {
  /** The two objects are identical (meaning deeply equal, not necessarily the same reference). */
  identical = 0,
  /** The two objects are identical for the purpose of layout and paint, but may be different in other ways. */
  metadata = 1,
  /** The two objects are different but only in ways that affect paint, not layout (e.g. only the color changed). */
  paint = 2,
  /** The two objects are different in ways that affect layout (and therefore paint). */
  layout = 3,
}

class InlineSpan {
  style?: TextStyle;

  static equals(targets: InlineSpan[], values: InlineSpan[]): boolean {
    if (targets.length !== values.length) return false;
    return targets.every((value, i) => values[i].equals(value));
  }

  equals(other: InlineSpan): boolean {
    if (this.style != null || other.style != null) {
      return this.style!.equals(other.style!);
    }

    if (this.style == null && other.style == null) return true;
    return false;
  }

  /**
   * Describe the difference between this span and another, in terms of how
   * much damage it will make to the rendering. The comparison is deep.
   *
   * The base implementation must stay maximally conservative: a subclass
   * that does not refine it always relayouts, so stale layout can never be
   * kept by mistake.
   */
  compareTo(other: InlineSpan): RenderComparison {
    return this === other
      ? RenderComparison.identical
      : RenderComparison.layout;
  }

  constructor({ style }: { style?: TextStyle }) {
    this.style = style;
  }

  protected computeToPlainText(): string {
    throw new Error("Not implemented: computeToPlainText");
  }

  build(_paragraph: Paragraph, _inheritedStyle?: TextStyle) {
    throw new Error("Not implemented: build");
  }

  visitChildren(_visitor: (span: InlineSpan) => void) {
    throw new Error("Not implemented: visitChildren");
  }

  toPlainText(): string {
    return this.computeToPlainText();
  }
}

export default InlineSpan;
