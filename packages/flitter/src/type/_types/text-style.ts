import type TextAlign from "./text-align";
import type TextDirection from "./text-direction";

class TextStyle {
  inherit: boolean;
  color?: string;
  fontSize?: number;
  fontWeight?: string;
  fontFamily?: string;
  textBaseline?: string;
  fontStyle?: FontStyle;
  /// The height of this text span, as a multiple of the font size.
  ///
  /// When [height] is null or omitted, the line height will be determined
  /// by the font's metrics directly, which may differ from the fontSize.
  /// When [height] is non-null, the line height of the span of text will be a
  /// multiple of [fontSize] and be exactly `fontSize * height` logical pixels
  /// tall.
  height?: number;

  equals(other: TextStyle): boolean {
    if (this === other) return true;

    return (
      this.inherit === other.inherit &&
      this.color === other.color &&
      this.fontSize === other.fontSize &&
      this.fontWeight === other.fontWeight &&
      this.fontFamily === other.fontFamily &&
      this.textBaseline === other.textBaseline &&
      this.fontStyle === other.fontStyle
    );
  }

  constructor({
    inherit = true,
    color,
    fontSize,
    fontWeight,
    fontFamily,
    textBaseline,
    fontStyle,
    height,
  }: TextStyleProps = {}) {
    this.inherit = inherit;
    this.color = color;
    this.fontSize = fontSize;
    this.fontWeight = fontWeight;
    this.fontFamily = fontFamily;
    this.textBaseline = textBaseline;
    this.fontStyle = fontStyle;
    this.height = height;
  }

  copyWidth({
    inherit = this.inherit,
    color = this.color,
    fontSize = this.fontSize,
    fontWeight = this.fontWeight,
    fontFamily = this.fontFamily,
    textBaseline = this.textBaseline,
    fontStyle = this.fontStyle,
    height = this.height,
  }: TextStyleProps): TextStyle {
    return new TextStyle({
      inherit,
      color,
      fontFamily,
      fontSize,
      fontWeight,
      textBaseline,
      fontStyle,
      height,
    });
  }

  merge(other?: TextStyle): TextStyle {
    if (other == null) return this;

    if (!other.inherit) return other;

    return this.copyWidth({
      ...other,
    });
  }

  getParagraphStyle({
    textAlign,
    textDirection,
    maxLines,
    fontFamily = this.fontFamily,
    fontSize = this.fontSize,
    fontWeight = this.fontWeight,
    fontStyle = this.fontStyle,
    ellipsis,
    height = this.height,
    textScaleFactor = 1,
  }: {
    textAlign?: TextAlign;
    textDirection?: TextDirection;
    maxLines?: number;
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    fontStyle?: FontStyle;
    ellipsis?: string;
    height?: number;
    textScaleFactor?: number;
  }) {
    return new ParagraphStyle({
      textAlign,
      textDirection,
      maxLines,
      fontFamily,
      fontStyle,
      fontWeight,
      ellipsis,
      height,
      fontSize: (fontSize ?? 16) * textScaleFactor,
    });
  }
}

type TextStyleProps = {
  inherit?: boolean;
  color?: string;
  fontSize?: number;
  fontWeight?: string;
  textBaseline?: string;
  fontFamily?: string;
  fontStyle?: FontStyle;
  height?: number;
};

export default TextStyle;

class ParagraphStyle {
  textAlign?: TextAlign;
  textDirection?: TextDirection;
  maxLines?: number;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: FontStyle;
  ellipsis?: string;
  height?: number;

  constructor({
    textAlign,
    textDirection,
    maxLines,
    fontFamily,
    fontSize,
    fontStyle,
    fontWeight,
    ellipsis,
    height,
  }: {
    textAlign?: TextAlign;
    textDirection?: TextDirection;
    maxLines?: number;
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    fontStyle?: FontStyle;
    ellipsis?: string;
    height?: number;
  }) {
    this.textAlign = textAlign;
    this.textDirection = textDirection;
    this.maxLines = maxLines;
    this.fontFamily = fontFamily;
    this.fontSize = fontSize;
    this.fontStyle = fontStyle;
    this.fontWeight = fontWeight;
    this.ellipsis = ellipsis;
    this.height = height;
  }
}

export enum FontStyle {
  normal = "normal",
  italic = "italic",
}
