/** Unicode boundaries shared by paragraph wrapping and editable-text carets. */
type Segment = { segment: string; index: number };
type Segmenter = { segment(text: string): Iterable<Segment> };
const SegmenterConstructor = (Intl as unknown as {
  Segmenter?: new (locale?: string, options?: { granularity: string }) => Segmenter;
}).Segmenter;
const wordSegmenter = SegmenterConstructor && new SegmenterConstructor(undefined, { granularity: "word" });
const graphemeSegmenter = SegmenterConstructor && new SegmenterConstructor(undefined, { granularity: "grapheme" });

export function graphemes(text: string): Segment[] {
  if (graphemeSegmenter) return Array.from(graphemeSegmenter.segment(text));
  const result: Segment[] = [];
  let index = 0;
  let regionalCount = 0;
  for (const char of Array.from(text)) {
    const previous = result[result.length - 1];
    const code = char.codePointAt(0)!;
    const regional = code >= 0x1f1e6 && code <= 0x1f1ff;
    if (previous && (
      /\p{Mark}/u.test(char) || char === "\u200d" || previous.segment.endsWith("\u200d") ||
      (code >= 0xfe00 && code <= 0xfe0f) || (code >= 0x1f3fb && code <= 0x1f3ff) ||
      (regional && regionalCount % 2 === 1)
    )) previous.segment += char;
    else result.push({ segment: char, index });
    regionalCount = regional ? regionalCount + 1 : 0;
    index += char.length;
  }
  return result;
}

const cjk = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u;
// Opening punctuation may not end a line; closing punctuation and small kana
// may not start one (kinsoku shori). Include both Japanese and Western forms.
const prohibitedEnd = /[([{（［｛〈《「『【〔〖〘〚‘“]$/u;
const prohibitedStart = /^[)\]}）］｝〉》」』】〕〗〙〛、。，．・：；？！ーぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮヵヶ々ゝゞヽヾ’”!?%,.:;]/u;

export type TextSegment = { content: string; start: number; end: number };

export function segmentText(text: string): TextSegment[] {
  const pieces: TextSegment[] = [];
  // Mandatory/discretionary breaks are separated first so word segmentation
  // cannot consume them as whitespace. CRLF is one hard break with two units.
  const chunks = text.match(/\r\n|[\r\n\u00ad]|[^\r\n\u00ad]+/g) ?? [];
  let offset = 0;
  for (const chunk of chunks) {
    if (/^[\r\n\u00ad]/.test(chunk)) {
      pieces.push({ content: chunk, start: offset, end: offset + chunk.length });
    } else {
      const words = wordSegmenter
        ? Array.from(wordSegmenter.segment(chunk))
        : (chunk.match(/\s+|[^\s]+/g) ?? []).map((segment, i, all) => ({
            segment, index: all.slice(0, i).reduce((n, part) => n + part.length, 0),
          }));
      for (const word of words) {
        const units = cjk.test(word.segment) ? graphemes(word.segment) : [{ segment: word.segment, index: 0 }];
        for (const unit of units) {
          const start = offset + word.index + unit.index;
          pieces.push({ content: unit.segment, start, end: start + unit.segment.length });
        }
      }
    }
    offset += chunk.length;
  }
  const result: TextSegment[] = [];
  for (const piece of pieces) {
    const previous = result[result.length - 1];
    if (previous && !/[\r\n\u00ad\s]$/u.test(previous.content) &&
        !/^[\r\n\u00ad\s]/u.test(piece.content) &&
        (prohibitedEnd.test(previous.content) || prohibitedStart.test(piece.content))) {
      previous.content += piece.content;
      previous.end = piece.end;
    } else result.push({ ...piece });
  }
  return result;
}
