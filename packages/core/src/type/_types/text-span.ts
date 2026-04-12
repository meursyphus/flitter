import InlineSpan from "./Inline-span";
import type { Paragraph } from "./text-painter";
import TextStyle from "./text-style";

class TextSpan extends InlineSpan {
  text?: string;
  children: InlineSpan[];

  equals(other: TextSpan): boolean {
    if (other === this) return true;
    return (
      this.text === other.text &&
      this.style!.equals(other.style!) &&
      InlineSpan.equals(this.children, other.children)
    );
  }

  constructor({
    style = new TextStyle(),
    text,
    children = [],
  }: {
    style?: TextStyle;
    text?: string;
    children?: InlineSpan[];
  }) {
    super({ style });
    this.children = children;
    this.text = text;
  }

  visitChildren(visitor: (span: InlineSpan) => void): void {
    visitor(this);
    this.children.forEach(child => child.visitChildren(visitor));
  }

  protected override computeToPlainText(): string {
    let plainText = this.text ?? "";
    this.children.forEach(child => {
      plainText += child.toPlainText();
    });
    return plainText;
  }

  build(
    paragraph: Paragraph,
    parentStyle: TextStyle = this.style ?? new TextStyle(),
  ): void {
    const inheritedStyle = parentStyle.merge(this.style);
    const { fontFamily, fontSize, fontStyle, fontWeight, color, height } =
      inheritedStyle;
    paragraph.addText({
      fontFamily,
      fontSize,
      fontWeight,
      fontStyle,
      color,
      height,
      content: this.computeToPlainText(),
    });

    this.children.forEach(child => {
      child.build(paragraph, inheritedStyle);
    });
  }
}

export default TextSpan;
