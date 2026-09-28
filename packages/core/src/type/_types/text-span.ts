import InlineSpan, { RenderComparison } from "./Inline-span";
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

  override compareTo(other: InlineSpan): RenderComparison {
    if (this === other) return RenderComparison.identical;
    if (other.constructor !== this.constructor) {
      return RenderComparison.layout;
    }
    const textSpan = other as TextSpan;
    if (
      this.text !== textSpan.text ||
      this.children.length !== textSpan.children.length ||
      (this.style == null) !== (textSpan.style == null)
    ) {
      return RenderComparison.layout;
    }
    let result = RenderComparison.identical;
    if (this.style != null) {
      const candidate = this.style.compareTo(textSpan.style!);
      if (candidate > result) result = candidate;
      if (result === RenderComparison.layout) return result;
    }
    for (let index = 0; index < this.children.length; index += 1) {
      const candidate = this.children[index].compareTo(textSpan.children[index]);
      if (candidate > result) result = candidate;
      if (result === RenderComparison.layout) return result;
    }
    return result;
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
    return this.text || "";
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
