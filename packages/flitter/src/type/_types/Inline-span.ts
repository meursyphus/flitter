import type TextStyle from "./text-style";
import type { Paragraph } from "./text-painter";

class InlineSpan {
  style?: TextStyle;

  static equals(targets: InlineSpan[], values: InlineSpan[]): boolean {
    if (targets.length !== values.length) return false;
    return targets.every((value, i) => values[i].eqauls(value));
  }

  eqauls(other: InlineSpan): boolean {
    if (this.style != null || other.style != null) {
      return this.style.equals(other.style);
    }

    if (this.style == null && other.style == null) return true;
    return false;
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
