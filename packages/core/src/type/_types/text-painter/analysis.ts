// Text analysis and segmentation pipeline from pretext (chenglou/pretext).
// Handles word segmentation, CJK detection, kinsoku shori rules, whitespace
// normalization, and multi-pass merge pipeline for optimal break opportunities.
//
// Adapted for Flitter's SSR-safe environment.

export type WhiteSpaceMode = "normal" | "pre-line" | "pre-wrap";
export type WordBreakMode = "normal" | "keep-all";

export type SegmentBreakKind =
  | "text"
  | "space"
  | "preserved-space"
  | "tab"
  | "glue"
  | "zero-width-break"
  | "soft-hyphen"
  | "hard-break";

type SegmentationPiece = {
  text: string;
  isWordLike: boolean;
  kind: SegmentBreakKind;
  start: number;
};

export type MergedSegmentation = {
  len: number;
  texts: string[];
  isWordLike: boolean[];
  kinds: SegmentBreakKind[];
  starts: number[];
};

export type AnalysisChunk = {
  startSegmentIndex: number;
  endSegmentIndex: number;
  consumedEndSegmentIndex: number;
};

export type TextAnalysis = {
  normalized: string;
  chunks: AnalysisChunk[];
} & MergedSegmentation;

export type AnalysisProfile = {
  carryCJKAfterClosingQuote: boolean;
};

const collapsibleWhitespaceRunRe = /[ \t\n\r\f]+/g;
const collapsibleWhitespaceWithoutHardBreaksRunRe = /[ \t\r\f]+/g;
const needsWhitespaceNormalizationRe = /[\t\n\r\f]| {2,}|^ | $/;
const needsWhitespaceNormalizationWithHardBreaksRe = /[\t\n\r\f]| {2,}|^ | $/;

type WhiteSpaceProfile = {
  mode: WhiteSpaceMode;
  preserveOrdinarySpaces: boolean;
  preserveHardBreaks: boolean;
};

function getWhiteSpaceProfile(whiteSpace?: WhiteSpaceMode): WhiteSpaceProfile {
  const mode = whiteSpace ?? "normal";
  switch (mode) {
    case "pre-wrap":
      return { mode, preserveOrdinarySpaces: true, preserveHardBreaks: true };
    case "pre-line":
      return { mode, preserveOrdinarySpaces: false, preserveHardBreaks: true };
    default:
      return { mode, preserveOrdinarySpaces: false, preserveHardBreaks: false };
  }
}

function trimCollapsedEdges(text: string): string {
  let normalized = text;
  if (normalized.charCodeAt(0) === 0x20) {
    normalized = normalized.slice(1);
  }
  if (
    normalized.length > 0 &&
    normalized.charCodeAt(normalized.length - 1) === 0x20
  ) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

export function normalizeWhitespaceNormal(text: string): string {
  if (!needsWhitespaceNormalizationRe.test(text)) return text;

  return trimCollapsedEdges(text.replace(collapsibleWhitespaceRunRe, " "));
}

function normalizeWhitespacePreLine(text: string): string {
  if (!needsWhitespaceNormalizationWithHardBreaksRe.test(text)) return text;

  const normalizedBreaks = text.replace(/\r\n/g, "\n").replace(/[\r\f]/g, "\n");
  return normalizedBreaks
    .split("\n")
    .map(line =>
      trimCollapsedEdges(
        line.replace(collapsibleWhitespaceWithoutHardBreaksRunRe, " "),
      ),
    )
    .join("\n");
}

function normalizeWhitespacePreWrap(text: string): string {
  if (!/[\r\f]/.test(text)) return text;
  return text.replace(/\r\n/g, "\n").replace(/[\r\f]/g, "\n");
}

let sharedWordSegmenter: Intl.Segmenter | null = null;
let segmenterLocale: string | undefined;

function getSharedWordSegmenter(): Intl.Segmenter {
  if (sharedWordSegmenter === null) {
    sharedWordSegmenter = new Intl.Segmenter(segmenterLocale, {
      granularity: "word",
    });
  }
  return sharedWordSegmenter;
}

export function clearAnalysisCaches(): void {
  sharedWordSegmenter = null;
}

export function setAnalysisLocale(locale?: string): void {
  const nextLocale = locale && locale.length > 0 ? locale : undefined;
  if (segmenterLocale === nextLocale) return;
  segmenterLocale = nextLocale;
  sharedWordSegmenter = null;
}

const arabicScriptRe = /\p{Script=Arabic}/u;
const combiningMarkRe = /\p{M}/u;
const decimalDigitRe = /\p{Nd}/u;

function containsArabicScript(text: string): boolean {
  return arabicScriptRe.test(text);
}

function isCJKCodePoint(codePoint: number): boolean {
  return (
    (codePoint >= 0x4e00 && codePoint <= 0x9fff) ||
    (codePoint >= 0x3400 && codePoint <= 0x4dbf) ||
    (codePoint >= 0x20000 && codePoint <= 0x2a6df) ||
    (codePoint >= 0x2a700 && codePoint <= 0x2b73f) ||
    (codePoint >= 0x2b740 && codePoint <= 0x2b81f) ||
    (codePoint >= 0x2b820 && codePoint <= 0x2ceaf) ||
    (codePoint >= 0x2ceb0 && codePoint <= 0x2ebef) ||
    (codePoint >= 0x2ebf0 && codePoint <= 0x2ee5d) ||
    (codePoint >= 0x2f800 && codePoint <= 0x2fa1f) ||
    (codePoint >= 0x30000 && codePoint <= 0x3134f) ||
    (codePoint >= 0x31350 && codePoint <= 0x323af) ||
    (codePoint >= 0x323b0 && codePoint <= 0x33479) ||
    (codePoint >= 0xf900 && codePoint <= 0xfaff) ||
    (codePoint >= 0x3000 && codePoint <= 0x303f) ||
    (codePoint >= 0x3040 && codePoint <= 0x309f) ||
    (codePoint >= 0x30a0 && codePoint <= 0x30ff) ||
    (codePoint >= 0xac00 && codePoint <= 0xd7af) ||
    (codePoint >= 0xff00 && codePoint <= 0xffef)
  );
}

export function isCJK(s: string): boolean {
  for (let i = 0; i < s.length; i++) {
    const first = s.charCodeAt(i);
    if (first < 0x3000) continue;

    if (first >= 0xd800 && first <= 0xdbff && i + 1 < s.length) {
      const second = s.charCodeAt(i + 1);
      if (second >= 0xdc00 && second <= 0xdfff) {
        const codePoint =
          ((first - 0xd800) << 10) + (second - 0xdc00) + 0x10000;
        if (isCJKCodePoint(codePoint)) return true;
        i++;
        continue;
      }
    }

    if (isCJKCodePoint(first)) return true;
  }
  return false;
}

function endsWithLineStartProhibitedText(text: string): boolean {
  const last = getLastCodePoint(text);
  return (
    last !== null && (kinsokuStart.has(last) || leftStickyPunctuation.has(last))
  );
}

const keepAllGlueChars = new Set(["\u00a0", "\u202f", "\u2060", "\ufeff"]);

function endsWithKeepAllGlueText(text: string): boolean {
  const last = getLastCodePoint(text);
  return last !== null && keepAllGlueChars.has(last);
}

export function canContinueKeepAllTextRun(previousText: string): boolean {
  return (
    !endsWithLineStartProhibitedText(previousText) &&
    !endsWithKeepAllGlueText(previousText)
  );
}

export const kinsokuStart = new Set([
  "\uff0c",
  "\uff0e",
  "\uff01",
  "\uff1a",
  "\uff1b",
  "\uff1f",
  "\u3001",
  "\u3002",
  "\u30fb",
  "\uff09",
  "\u3015",
  "\u3009",
  "\u300b",
  "\u300d",
  "\u300f",
  "\u3011",
  "\u3017",
  "\u3019",
  "\u301b",
  "\u30fc",
  "\u3005",
  "\u303b",
  "\u309d",
  "\u309e",
  "\u30fd",
  "\u30fe",
]);

export const kinsokuEnd = new Set([
  '"',
  "(",
  "[",
  "{",
  "\u201c",
  "\u2018",
  "\u00ab",
  "\u2039",
  "\uff08",
  "\u3014",
  "\u3008",
  "\u300a",
  "\u300c",
  "\u300e",
  "\u3010",
  "\u3016",
  "\u3018",
  "\u301a",
]);

const forwardStickyGlue = new Set(["'", "\u2019"]);

export const leftStickyPunctuation = new Set([
  ".",
  ",",
  "!",
  "?",
  ":",
  ";",
  "\u060c",
  "\u061b",
  "\u061f",
  "\u0964",
  "\u0965",
  "\u104a",
  "\u104b",
  "\u104c",
  "\u104d",
  "\u104f",
  ")",
  "]",
  "}",
  "%",
  '"',
  "\u201d",
  "\u2019",
  "\u00bb",
  "\u203a",
  "\u2026",
]);

const arabicNoSpaceTrailingPunctuation = new Set([
  ":",
  ".",
  "\u060c",
  "\u061b",
]);

const myanmarMedialGlue = new Set(["\u104f"]);

const closingQuoteChars = new Set([
  "\u201d",
  "\u2019",
  "\u00bb",
  "\u203a",
  "\u300d",
  "\u300f",
  "\u3011",
  "\u300b",
  "\u3009",
  "\u3015",
  "\uff09",
]);

function isLeftStickyPunctuationSegment(segment: string): boolean {
  if (isEscapedQuoteClusterSegment(segment)) return true;
  let sawPunctuation = false;
  for (const ch of segment) {
    if (leftStickyPunctuation.has(ch)) {
      sawPunctuation = true;
      continue;
    }
    if (sawPunctuation && combiningMarkRe.test(ch)) continue;
    return false;
  }
  return sawPunctuation;
}

function isCJKLineStartProhibitedSegment(segment: string): boolean {
  for (const ch of segment) {
    if (!kinsokuStart.has(ch) && !leftStickyPunctuation.has(ch)) return false;
  }
  return segment.length > 0;
}

function isForwardStickyClusterSegment(segment: string): boolean {
  if (isEscapedQuoteClusterSegment(segment)) return true;
  for (const ch of segment) {
    if (
      !kinsokuEnd.has(ch) &&
      !forwardStickyGlue.has(ch) &&
      !combiningMarkRe.test(ch)
    )
      return false;
  }
  return segment.length > 0;
}

function isEscapedQuoteClusterSegment(segment: string): boolean {
  let sawQuote = false;
  for (const ch of segment) {
    if (ch === "\\" || combiningMarkRe.test(ch)) continue;
    if (
      kinsokuEnd.has(ch) ||
      leftStickyPunctuation.has(ch) ||
      forwardStickyGlue.has(ch)
    ) {
      sawQuote = true;
      continue;
    }
    return false;
  }
  return sawQuote;
}

function previousCodePointStart(text: string, end: number): number {
  const last = end - 1;
  if (last <= 0) return Math.max(last, 0);

  const lastCodeUnit = text.charCodeAt(last);
  if (lastCodeUnit < 0xdc00 || lastCodeUnit > 0xdfff) return last;

  const maybeHigh = last - 1;
  if (maybeHigh < 0) return last;

  const highCodeUnit = text.charCodeAt(maybeHigh);
  return highCodeUnit >= 0xd800 && highCodeUnit <= 0xdbff ? maybeHigh : last;
}

function getLastCodePoint(text: string): string | null {
  if (text.length === 0) return null;
  const start = previousCodePointStart(text, text.length);
  return text.slice(start);
}

function splitTrailingForwardStickyCluster(
  text: string,
): { head: string; tail: string } | null {
  const chars = Array.from(text);
  let splitIndex = chars.length;

  while (splitIndex > 0) {
    const ch = chars[splitIndex - 1]!;
    if (combiningMarkRe.test(ch)) {
      splitIndex--;
      continue;
    }
    if (kinsokuEnd.has(ch) || forwardStickyGlue.has(ch)) {
      splitIndex--;
      continue;
    }
    break;
  }

  if (splitIndex <= 0 || splitIndex === chars.length) return null;
  return {
    head: chars.slice(0, splitIndex).join(""),
    tail: chars.slice(splitIndex).join(""),
  };
}

function getRepeatableSingleCharRunChar(
  text: string,
  isWordLike: boolean,
  kind: SegmentBreakKind,
): string | null {
  return kind === "text" &&
    !isWordLike &&
    text.length === 1 &&
    text !== "-" &&
    text !== "\u2014"
    ? text
    : null;
}

function materializeDeferredSingleCharRun(
  texts: string[],
  chars: (string | null)[],
  lengths: number[],
  index: number,
): string {
  const ch = chars[index];
  const text = texts[index]!;
  if (ch == null) return text;

  const length = lengths[index]!;
  if (text.length === length) return text;

  const materialized = ch.repeat(length);
  texts[index] = materialized;
  return materialized;
}

function hasArabicNoSpacePunctuation(
  containsArabic: boolean,
  lastCodePoint: string | null,
): boolean {
  return (
    containsArabic &&
    lastCodePoint !== null &&
    arabicNoSpaceTrailingPunctuation.has(lastCodePoint)
  );
}

function endsWithMyanmarMedialGlue(segment: string): boolean {
  const lastCodePoint = getLastCodePoint(segment);
  return lastCodePoint !== null && myanmarMedialGlue.has(lastCodePoint);
}

function splitLeadingSpaceAndMarks(
  segment: string,
): { space: string; marks: string } | null {
  if (segment.length < 2 || segment[0] !== " ") return null;
  const marks = segment.slice(1);
  if (/^\p{M}+$/u.test(marks)) {
    return { space: " ", marks };
  }
  return null;
}

export function endsWithClosingQuote(text: string): boolean {
  let end = text.length;
  while (end > 0) {
    const start = previousCodePointStart(text, end);
    const ch = text.slice(start, end);
    if (closingQuoteChars.has(ch)) return true;
    if (!leftStickyPunctuation.has(ch)) return false;
    end = start;
  }
  return false;
}

function classifySegmentBreakChar(
  ch: string,
  whiteSpaceProfile: WhiteSpaceProfile,
): SegmentBreakKind {
  if (whiteSpaceProfile.preserveOrdinarySpaces) {
    if (ch === " ") return "preserved-space";
    if (ch === "\t") return "tab";
  }
  if (whiteSpaceProfile.preserveHardBreaks && ch === "\n") return "hard-break";
  if (ch === " ") return "space";
  if (
    ch === "\u00a0" ||
    ch === "\u202f" ||
    ch === "\u2060" ||
    ch === "\ufeff"
  ) {
    return "glue";
  }
  if (ch === "\u200b") return "zero-width-break";
  if (ch === "\u00ad") return "soft-hyphen";
  return "text";
}

const breakCharRe = /[\x20\t\n\xA0\xAD\u200B\u202F\u2060\uFEFF]/;

function joinTextParts(parts: string[]): string {
  return parts.length === 1 ? parts[0]! : parts.join("");
}

function joinReversedPrefixParts(prefixParts: string[], tail: string): string {
  const parts: string[] = [];
  for (let i = prefixParts.length - 1; i >= 0; i--) {
    parts.push(prefixParts[i]!);
  }
  parts.push(tail);
  return joinTextParts(parts);
}

function splitSegmentByBreakKind(
  segment: string,
  isWordLike: boolean,
  start: number,
  whiteSpaceProfile: WhiteSpaceProfile,
): SegmentationPiece[] {
  if (!breakCharRe.test(segment)) {
    return [{ text: segment, isWordLike, kind: "text", start }];
  }

  const pieces: SegmentationPiece[] = [];
  let currentKind: SegmentBreakKind | null = null;
  let currentTextParts: string[] = [];
  let currentStart = start;
  let currentWordLike = false;
  let offset = 0;

  for (const ch of segment) {
    const kind = classifySegmentBreakChar(ch, whiteSpaceProfile);
    const wordLike = kind === "text" && isWordLike;

    if (
      currentKind !== null &&
      kind === currentKind &&
      wordLike === currentWordLike
    ) {
      currentTextParts.push(ch);
      offset += ch.length;
      continue;
    }

    if (currentKind !== null) {
      pieces.push({
        text: joinTextParts(currentTextParts),
        isWordLike: currentWordLike,
        kind: currentKind,
        start: currentStart,
      });
    }

    currentKind = kind;
    currentTextParts = [ch];
    currentStart = start + offset;
    currentWordLike = wordLike;
    offset += ch.length;
  }

  if (currentKind !== null) {
    pieces.push({
      text: joinTextParts(currentTextParts),
      isWordLike: currentWordLike,
      kind: currentKind,
      start: currentStart,
    });
  }

  return pieces;
}

function isTextRunBoundary(kind: SegmentBreakKind): boolean {
  return (
    kind === "space" ||
    kind === "preserved-space" ||
    kind === "zero-width-break" ||
    kind === "hard-break"
  );
}

const urlSchemeSegmentRe = /^[A-Za-z][A-Za-z0-9+.-]*:$/;

function isUrlLikeRunStart(
  segmentation: MergedSegmentation,
  index: number,
): boolean {
  const text = segmentation.texts[index]!;
  if (text.startsWith("www.")) return true;
  return (
    urlSchemeSegmentRe.test(text) &&
    index + 1 < segmentation.len &&
    segmentation.kinds[index + 1] === "text" &&
    segmentation.texts[index + 1] === "//"
  );
}

function isUrlQueryBoundarySegment(text: string): boolean {
  return (
    text.includes("?") && (text.includes("://") || text.startsWith("www."))
  );
}

function mergeUrlLikeRuns(
  segmentation: MergedSegmentation,
): MergedSegmentation {
  const texts = segmentation.texts.slice();
  const isWordLike = segmentation.isWordLike.slice();
  const kinds = segmentation.kinds.slice();
  const starts = segmentation.starts.slice();

  for (let i = 0; i < segmentation.len; i++) {
    if (kinds[i] !== "text" || !isUrlLikeRunStart(segmentation, i)) continue;

    const mergedParts = [texts[i]!];
    let j = i + 1;
    while (j < segmentation.len && !isTextRunBoundary(kinds[j]!)) {
      mergedParts.push(texts[j]!);
      isWordLike[i] = true;
      const endsQueryPrefix = texts[j]!.includes("?");
      kinds[j] = "text";
      texts[j] = "";
      j++;
      if (endsQueryPrefix) break;
    }
    texts[i] = joinTextParts(mergedParts);
  }

  let compactLen = 0;
  for (let read = 0; read < texts.length; read++) {
    const text = texts[read]!;
    if (text.length === 0) continue;
    if (compactLen !== read) {
      texts[compactLen] = text;
      isWordLike[compactLen] = isWordLike[read]!;
      kinds[compactLen] = kinds[read]!;
      starts[compactLen] = starts[read]!;
    }
    compactLen++;
  }

  texts.length = compactLen;
  isWordLike.length = compactLen;
  kinds.length = compactLen;
  starts.length = compactLen;

  return { len: compactLen, texts, isWordLike, kinds, starts };
}

function mergeUrlQueryRuns(
  segmentation: MergedSegmentation,
): MergedSegmentation {
  const texts: string[] = [];
  const isWordLike: boolean[] = [];
  const kinds: SegmentBreakKind[] = [];
  const starts: number[] = [];

  for (let i = 0; i < segmentation.len; i++) {
    const text = segmentation.texts[i]!;
    texts.push(text);
    isWordLike.push(segmentation.isWordLike[i]!);
    kinds.push(segmentation.kinds[i]!);
    starts.push(segmentation.starts[i]!);

    if (!isUrlQueryBoundarySegment(text)) continue;

    const nextIndex = i + 1;
    if (
      nextIndex >= segmentation.len ||
      isTextRunBoundary(segmentation.kinds[nextIndex]!)
    ) {
      continue;
    }

    const queryParts: string[] = [];
    const queryStart = segmentation.starts[nextIndex]!;
    let j = nextIndex;
    while (j < segmentation.len && !isTextRunBoundary(segmentation.kinds[j]!)) {
      queryParts.push(segmentation.texts[j]!);
      j++;
    }

    if (queryParts.length > 0) {
      texts.push(joinTextParts(queryParts));
      isWordLike.push(true);
      kinds.push("text");
      starts.push(queryStart);
      i = j - 1;
    }
  }

  return { len: texts.length, texts, isWordLike, kinds, starts };
}

const numericJoinerChars = new Set([
  ":",
  "-",
  "/",
  "\u00d7",
  ",",
  ".",
  "+",
  "\u2013",
  "\u2014",
]);

const asciiPunctuationChainSegmentRe = /^[A-Za-z0-9_]+[,:;]*$/;
const asciiPunctuationChainTrailingJoinersRe = /[,:;]+$/;

function segmentContainsDecimalDigit(text: string): boolean {
  for (const ch of text) {
    if (decimalDigitRe.test(ch)) return true;
  }
  return false;
}

export function isNumericRunSegment(text: string): boolean {
  if (text.length === 0) return false;
  for (const ch of text) {
    if (decimalDigitRe.test(ch) || numericJoinerChars.has(ch)) continue;
    return false;
  }
  return true;
}

function mergeNumericRuns(
  segmentation: MergedSegmentation,
): MergedSegmentation {
  const texts: string[] = [];
  const isWordLike: boolean[] = [];
  const kinds: SegmentBreakKind[] = [];
  const starts: number[] = [];

  for (let i = 0; i < segmentation.len; i++) {
    const text = segmentation.texts[i]!;
    const kind = segmentation.kinds[i]!;

    if (
      kind === "text" &&
      isNumericRunSegment(text) &&
      segmentContainsDecimalDigit(text)
    ) {
      const mergedParts = [text];
      let j = i + 1;
      while (
        j < segmentation.len &&
        segmentation.kinds[j] === "text" &&
        isNumericRunSegment(segmentation.texts[j]!)
      ) {
        mergedParts.push(segmentation.texts[j]!);
        j++;
      }

      texts.push(joinTextParts(mergedParts));
      isWordLike.push(true);
      kinds.push("text");
      starts.push(segmentation.starts[i]!);
      i = j - 1;
      continue;
    }

    texts.push(text);
    isWordLike.push(segmentation.isWordLike[i]!);
    kinds.push(kind);
    starts.push(segmentation.starts[i]!);
  }

  return { len: texts.length, texts, isWordLike, kinds, starts };
}

function mergeAsciiPunctuationChains(
  segmentation: MergedSegmentation,
): MergedSegmentation {
  const texts: string[] = [];
  const isWordLike: boolean[] = [];
  const kinds: SegmentBreakKind[] = [];
  const starts: number[] = [];

  for (let i = 0; i < segmentation.len; i++) {
    const text = segmentation.texts[i]!;
    const kind = segmentation.kinds[i]!;
    const wordLike = segmentation.isWordLike[i]!;

    if (
      kind === "text" &&
      wordLike &&
      asciiPunctuationChainSegmentRe.test(text)
    ) {
      const mergedParts = [text];
      let endsWithJoiners = asciiPunctuationChainTrailingJoinersRe.test(text);
      let j = i + 1;

      while (
        endsWithJoiners &&
        j < segmentation.len &&
        segmentation.kinds[j] === "text" &&
        segmentation.isWordLike[j] &&
        asciiPunctuationChainSegmentRe.test(segmentation.texts[j]!)
      ) {
        const nextText = segmentation.texts[j]!;
        mergedParts.push(nextText);
        endsWithJoiners = asciiPunctuationChainTrailingJoinersRe.test(nextText);
        j++;
      }

      texts.push(joinTextParts(mergedParts));
      isWordLike.push(true);
      kinds.push("text");
      starts.push(segmentation.starts[i]!);
      i = j - 1;
      continue;
    }

    texts.push(text);
    isWordLike.push(wordLike);
    kinds.push(kind);
    starts.push(segmentation.starts[i]!);
  }

  return { len: texts.length, texts, isWordLike, kinds, starts };
}

function splitHyphenatedNumericRuns(
  segmentation: MergedSegmentation,
): MergedSegmentation {
  const texts: string[] = [];
  const isWordLike: boolean[] = [];
  const kinds: SegmentBreakKind[] = [];
  const starts: number[] = [];

  for (let i = 0; i < segmentation.len; i++) {
    const text = segmentation.texts[i]!;
    if (segmentation.kinds[i] === "text" && text.includes("-")) {
      const parts = text.split("-");
      let shouldSplit = parts.length > 1;
      for (let j = 0; j < parts.length; j++) {
        const part = parts[j]!;
        if (!shouldSplit) break;
        if (
          part.length === 0 ||
          !segmentContainsDecimalDigit(part) ||
          !isNumericRunSegment(part)
        ) {
          shouldSplit = false;
        }
      }

      if (shouldSplit) {
        let offset = 0;
        for (let j = 0; j < parts.length; j++) {
          const part = parts[j]!;
          const splitText = j < parts.length - 1 ? `${part}-` : part;
          texts.push(splitText);
          isWordLike.push(true);
          kinds.push("text");
          starts.push(segmentation.starts[i]! + offset);
          offset += splitText.length;
        }
        continue;
      }
    }

    texts.push(text);
    isWordLike.push(segmentation.isWordLike[i]!);
    kinds.push(segmentation.kinds[i]!);
    starts.push(segmentation.starts[i]!);
  }

  return { len: texts.length, texts, isWordLike, kinds, starts };
}

function mergeGlueConnectedTextRuns(
  segmentation: MergedSegmentation,
): MergedSegmentation {
  const texts: string[] = [];
  const isWordLike: boolean[] = [];
  const kinds: SegmentBreakKind[] = [];
  const starts: number[] = [];

  let read = 0;
  while (read < segmentation.len) {
    const textParts = [segmentation.texts[read]!];
    let wordLike = segmentation.isWordLike[read]!;
    let kind = segmentation.kinds[read]!;
    let start = segmentation.starts[read]!;

    if (kind === "glue") {
      const glueParts = [textParts[0]!];
      const glueStart = start;
      read++;
      while (read < segmentation.len && segmentation.kinds[read] === "glue") {
        glueParts.push(segmentation.texts[read]!);
        read++;
      }
      const glueText = joinTextParts(glueParts);

      if (read < segmentation.len && segmentation.kinds[read] === "text") {
        textParts[0] = glueText;
        textParts.push(segmentation.texts[read]!);
        wordLike = segmentation.isWordLike[read]!;
        kind = "text";
        start = glueStart;
        read++;
      } else {
        texts.push(glueText);
        isWordLike.push(false);
        kinds.push("glue");
        starts.push(glueStart);
        continue;
      }
    } else {
      read++;
    }

    if (kind === "text") {
      while (read < segmentation.len && segmentation.kinds[read] === "glue") {
        const glueParts: string[] = [];
        while (read < segmentation.len && segmentation.kinds[read] === "glue") {
          glueParts.push(segmentation.texts[read]!);
          read++;
        }
        const glueText = joinTextParts(glueParts);

        if (read < segmentation.len && segmentation.kinds[read] === "text") {
          textParts.push(glueText, segmentation.texts[read]!);
          wordLike = wordLike || segmentation.isWordLike[read]!;
          read++;
          continue;
        }

        textParts.push(glueText);
      }
    }

    texts.push(joinTextParts(textParts));
    isWordLike.push(wordLike);
    kinds.push(kind);
    starts.push(start);
  }

  return { len: texts.length, texts, isWordLike, kinds, starts };
}

function carryTrailingForwardStickyAcrossCJKBoundary(
  segmentation: MergedSegmentation,
): MergedSegmentation {
  const texts = segmentation.texts.slice();
  const isWordLike = segmentation.isWordLike.slice();
  const kinds = segmentation.kinds.slice();
  const starts = segmentation.starts.slice();

  for (let i = 0; i < texts.length - 1; i++) {
    if (kinds[i] !== "text" || kinds[i + 1] !== "text") continue;
    if (!isCJK(texts[i]!) || !isCJK(texts[i + 1]!)) continue;

    const split = splitTrailingForwardStickyCluster(texts[i]!);
    if (split === null) continue;

    texts[i] = split.head;
    texts[i + 1] = split.tail + texts[i + 1]!;
    starts[i + 1] = starts[i]! + split.head.length;
  }

  return { len: texts.length, texts, isWordLike, kinds, starts };
}

function buildMergedSegmentation(
  normalized: string,
  profile: AnalysisProfile,
  whiteSpaceProfile: WhiteSpaceProfile,
): MergedSegmentation {
  const wordSegmenter = getSharedWordSegmenter();
  let mergedLen = 0;
  const mergedTexts: string[] = [];
  const mergedTextParts: string[][] = [];
  const mergedWordLike: boolean[] = [];
  const mergedKinds: SegmentBreakKind[] = [];
  const mergedStarts: number[] = [];
  const mergedSingleCharRunChars: (string | null)[] = [];
  const mergedSingleCharRunLengths: number[] = [];
  const mergedContainsCJK: boolean[] = [];
  const mergedContainsArabicScript: boolean[] = [];
  const mergedEndsWithClosingQuote: boolean[] = [];
  const mergedEndsWithMyanmarMedialGlue: boolean[] = [];
  const mergedHasArabicNoSpacePunctuation: boolean[] = [];

  for (const s of wordSegmenter.segment(normalized)) {
    for (const piece of splitSegmentByBreakKind(
      s.segment,
      s.isWordLike ?? false,
      s.index,
      whiteSpaceProfile,
    )) {
      const isText = piece.kind === "text";
      const repeatableSingleCharRunChar = getRepeatableSingleCharRunChar(
        piece.text,
        piece.isWordLike,
        piece.kind,
      );
      const pieceContainsCJK = isCJK(piece.text);
      const pieceContainsArabicScript = containsArabicScript(piece.text);
      const pieceLastCodePoint = getLastCodePoint(piece.text);
      const pieceEndsWithClosingQuote = endsWithClosingQuote(piece.text);
      const pieceEndsWithMyanmarMedialGlue = endsWithMyanmarMedialGlue(
        piece.text,
      );
      const prevIndex = mergedLen - 1;

      function appendPieceToPrevious(): void {
        if (mergedSingleCharRunChars[prevIndex] !== null) {
          mergedTextParts[prevIndex] = [
            materializeDeferredSingleCharRun(
              mergedTexts,
              mergedSingleCharRunChars,
              mergedSingleCharRunLengths,
              prevIndex,
            ),
          ];
          mergedSingleCharRunChars[prevIndex] = null;
        }
        mergedTextParts[prevIndex]!.push(piece.text);
        mergedWordLike[prevIndex] =
          mergedWordLike[prevIndex]! || piece.isWordLike;
        mergedContainsCJK[prevIndex] =
          mergedContainsCJK[prevIndex]! || pieceContainsCJK;
        mergedContainsArabicScript[prevIndex] =
          mergedContainsArabicScript[prevIndex]! || pieceContainsArabicScript;
        mergedEndsWithClosingQuote[prevIndex] = pieceEndsWithClosingQuote;
        mergedEndsWithMyanmarMedialGlue[prevIndex] =
          pieceEndsWithMyanmarMedialGlue;
        mergedHasArabicNoSpacePunctuation[prevIndex] =
          hasArabicNoSpacePunctuation(
            mergedContainsArabicScript[prevIndex]!,
            pieceLastCodePoint,
          );
      }

      if (
        profile.carryCJKAfterClosingQuote &&
        isText &&
        mergedLen > 0 &&
        mergedKinds[prevIndex] === "text" &&
        pieceContainsCJK &&
        mergedContainsCJK[prevIndex] &&
        mergedEndsWithClosingQuote[prevIndex]!
      ) {
        appendPieceToPrevious();
      } else if (
        isText &&
        mergedLen > 0 &&
        mergedKinds[prevIndex] === "text" &&
        isCJKLineStartProhibitedSegment(piece.text) &&
        mergedContainsCJK[prevIndex]
      ) {
        appendPieceToPrevious();
      } else if (
        isText &&
        mergedLen > 0 &&
        mergedKinds[prevIndex] === "text" &&
        mergedEndsWithMyanmarMedialGlue[prevIndex]
      ) {
        appendPieceToPrevious();
      } else if (
        isText &&
        mergedLen > 0 &&
        mergedKinds[prevIndex] === "text" &&
        piece.isWordLike &&
        pieceContainsArabicScript &&
        mergedHasArabicNoSpacePunctuation[prevIndex]
      ) {
        appendPieceToPrevious();
        mergedWordLike[prevIndex] = true;
      } else if (
        repeatableSingleCharRunChar !== null &&
        mergedLen > 0 &&
        mergedKinds[prevIndex] === "text" &&
        mergedSingleCharRunChars[prevIndex] === repeatableSingleCharRunChar
      ) {
        mergedSingleCharRunLengths[prevIndex] =
          (mergedSingleCharRunLengths[prevIndex] ?? 1) + 1;
      } else if (
        isText &&
        !piece.isWordLike &&
        mergedLen > 0 &&
        mergedKinds[prevIndex] === "text" &&
        (isLeftStickyPunctuationSegment(piece.text) ||
          (piece.text === "-" && mergedWordLike[prevIndex]!))
      ) {
        appendPieceToPrevious();
      } else {
        mergedTexts[mergedLen] = piece.text;
        mergedTextParts[mergedLen] = [piece.text];
        mergedWordLike[mergedLen] = piece.isWordLike;
        mergedKinds[mergedLen] = piece.kind;
        mergedStarts[mergedLen] = piece.start;
        mergedSingleCharRunChars[mergedLen] = repeatableSingleCharRunChar;
        mergedSingleCharRunLengths[mergedLen] =
          repeatableSingleCharRunChar === null ? 0 : 1;
        mergedContainsCJK[mergedLen] = pieceContainsCJK;
        mergedContainsArabicScript[mergedLen] = pieceContainsArabicScript;
        mergedEndsWithClosingQuote[mergedLen] = pieceEndsWithClosingQuote;
        mergedEndsWithMyanmarMedialGlue[mergedLen] =
          pieceEndsWithMyanmarMedialGlue;
        mergedHasArabicNoSpacePunctuation[mergedLen] =
          hasArabicNoSpacePunctuation(
            pieceContainsArabicScript,
            pieceLastCodePoint,
          );
        mergedLen++;
      }
    }
  }

  for (let i = 0; i < mergedLen; i++) {
    if (mergedSingleCharRunChars[i] !== null) {
      mergedTexts[i] = materializeDeferredSingleCharRun(
        mergedTexts,
        mergedSingleCharRunChars,
        mergedSingleCharRunLengths,
        i,
      );
      continue;
    }
    mergedTexts[i] = joinTextParts(mergedTextParts[i]!);
  }

  // Forward-sticky cluster carry and compaction
  for (let i = 1; i < mergedLen; i++) {
    if (
      mergedKinds[i] === "text" &&
      !mergedWordLike[i]! &&
      isEscapedQuoteClusterSegment(mergedTexts[i]!) &&
      mergedKinds[i - 1] === "text"
    ) {
      mergedTexts[i - 1] += mergedTexts[i]!;
      mergedWordLike[i - 1] = mergedWordLike[i - 1]! || mergedWordLike[i]!;
      mergedTexts[i] = "";
    }
  }

  const forwardStickyPrefixParts: (string[] | null)[] = Array.from(
    { length: mergedLen },
    () => null,
  );
  let nextLiveIndex = -1;

  for (let i = mergedLen - 1; i >= 0; i--) {
    const text = mergedTexts[i]!;
    if (text.length === 0) continue;

    if (
      mergedKinds[i] === "text" &&
      !mergedWordLike[i]! &&
      isForwardStickyClusterSegment(text) &&
      nextLiveIndex >= 0 &&
      mergedKinds[nextLiveIndex] === "text"
    ) {
      const prefixParts = forwardStickyPrefixParts[nextLiveIndex] ?? [];
      prefixParts.push(text);
      forwardStickyPrefixParts[nextLiveIndex] = prefixParts;
      mergedStarts[nextLiveIndex] = mergedStarts[i]!;
      mergedTexts[i] = "";
      continue;
    }

    nextLiveIndex = i;
  }

  for (let i = 0; i < mergedLen; i++) {
    const prefixParts = forwardStickyPrefixParts[i];
    if (prefixParts == null) continue;
    mergedTexts[i] = joinReversedPrefixParts(prefixParts, mergedTexts[i]!);
  }

  let compactLen = 0;
  for (let read = 0; read < mergedLen; read++) {
    const text = mergedTexts[read]!;
    if (text.length === 0) continue;
    if (compactLen !== read) {
      mergedTexts[compactLen] = text;
      mergedWordLike[compactLen] = mergedWordLike[read]!;
      mergedKinds[compactLen] = mergedKinds[read]!;
      mergedStarts[compactLen] = mergedStarts[read]!;
    }
    compactLen++;
  }

  mergedTexts.length = compactLen;
  mergedWordLike.length = compactLen;
  mergedKinds.length = compactLen;
  mergedStarts.length = compactLen;

  const compacted = mergeGlueConnectedTextRuns({
    len: compactLen,
    texts: mergedTexts,
    isWordLike: mergedWordLike,
    kinds: mergedKinds,
    starts: mergedStarts,
  });
  const withMergedUrls = carryTrailingForwardStickyAcrossCJKBoundary(
    mergeAsciiPunctuationChains(
      splitHyphenatedNumericRuns(
        mergeNumericRuns(mergeUrlQueryRuns(mergeUrlLikeRuns(compacted))),
      ),
    ),
  );

  // Arabic leading mark fix
  for (let i = 0; i < withMergedUrls.len - 1; i++) {
    const split = splitLeadingSpaceAndMarks(withMergedUrls.texts[i]!);
    if (split === null) continue;
    if (
      (withMergedUrls.kinds[i] !== "space" &&
        withMergedUrls.kinds[i] !== "preserved-space") ||
      withMergedUrls.kinds[i + 1] !== "text" ||
      !containsArabicScript(withMergedUrls.texts[i + 1]!)
    ) {
      continue;
    }

    withMergedUrls.texts[i] = split.space;
    withMergedUrls.isWordLike[i] = false;
    withMergedUrls.kinds[i] =
      withMergedUrls.kinds[i] === "preserved-space"
        ? "preserved-space"
        : "space";
    withMergedUrls.texts[i + 1] = split.marks + withMergedUrls.texts[i + 1]!;
    withMergedUrls.starts[i + 1] =
      withMergedUrls.starts[i]! + split.space.length;
  }

  return withMergedUrls;
}

function compileAnalysisChunks(
  segmentation: MergedSegmentation,
  whiteSpaceProfile: WhiteSpaceProfile,
): AnalysisChunk[] {
  if (segmentation.len === 0) return [];
  if (!whiteSpaceProfile.preserveHardBreaks) {
    return [
      {
        startSegmentIndex: 0,
        endSegmentIndex: segmentation.len,
        consumedEndSegmentIndex: segmentation.len,
      },
    ];
  }

  const chunks: AnalysisChunk[] = [];
  let startSegmentIndex = 0;

  for (let i = 0; i < segmentation.len; i++) {
    if (segmentation.kinds[i] !== "hard-break") continue;

    chunks.push({
      startSegmentIndex,
      endSegmentIndex: i,
      consumedEndSegmentIndex: i + 1,
    });
    startSegmentIndex = i + 1;
  }

  if (startSegmentIndex < segmentation.len) {
    chunks.push({
      startSegmentIndex,
      endSegmentIndex: segmentation.len,
      consumedEndSegmentIndex: segmentation.len,
    });
  }

  return chunks;
}

function mergeKeepAllTextSegments(
  segmentation: MergedSegmentation,
): MergedSegmentation {
  if (segmentation.len <= 1) return segmentation;

  const texts: string[] = [];
  const isWordLike: boolean[] = [];
  const kinds: SegmentBreakKind[] = [];
  const starts: number[] = [];

  let pendingTextParts: string[] | null = null;
  let pendingWordLike = false;
  let pendingStart = 0;
  let pendingContainsCJK = false;
  let pendingCanContinue = false;

  function flushPendingText(): void {
    if (pendingTextParts === null) return;
    texts.push(joinTextParts(pendingTextParts));
    isWordLike.push(pendingWordLike);
    kinds.push("text");
    starts.push(pendingStart);
    pendingTextParts = null;
  }

  for (let i = 0; i < segmentation.len; i++) {
    const text = segmentation.texts[i]!;
    const kind = segmentation.kinds[i]!;
    const wordLike = segmentation.isWordLike[i]!;
    const start = segmentation.starts[i]!;

    if (kind === "text") {
      const textContainsCJK = isCJK(text);
      const textCanContinue = canContinueKeepAllTextRun(text);

      if (
        pendingTextParts !== null &&
        pendingContainsCJK &&
        pendingCanContinue
      ) {
        pendingTextParts.push(text);
        pendingWordLike = pendingWordLike || wordLike;
        pendingContainsCJK = pendingContainsCJK || textContainsCJK;
        pendingCanContinue = textCanContinue;
        continue;
      }

      flushPendingText();
      pendingTextParts = [text];
      pendingWordLike = wordLike;
      pendingStart = start;
      pendingContainsCJK = textContainsCJK;
      pendingCanContinue = textCanContinue;
      continue;
    }

    flushPendingText();
    texts.push(text);
    isWordLike.push(wordLike);
    kinds.push(kind);
    starts.push(start);
  }

  flushPendingText();

  return { len: texts.length, texts, isWordLike, kinds, starts };
}

export function analyzeText(
  text: string,
  profile: AnalysisProfile,
  whiteSpace: WhiteSpaceMode = "normal",
  wordBreak: WordBreakMode = "normal",
): TextAnalysis {
  const whiteSpaceProfile = getWhiteSpaceProfile(whiteSpace);
  const normalized =
    whiteSpaceProfile.mode === "pre-wrap"
      ? normalizeWhitespacePreWrap(text)
      : whiteSpaceProfile.mode === "pre-line"
        ? normalizeWhitespacePreLine(text)
        : normalizeWhitespaceNormal(text);
  if (normalized.length === 0) {
    return {
      normalized,
      chunks: [],
      len: 0,
      texts: [],
      isWordLike: [],
      kinds: [],
      starts: [],
    };
  }
  const segmentation =
    wordBreak === "keep-all"
      ? mergeKeepAllTextSegments(
          buildMergedSegmentation(normalized, profile, whiteSpaceProfile),
        )
      : buildMergedSegmentation(normalized, profile, whiteSpaceProfile);
  return {
    normalized,
    chunks: compileAnalysisChunks(segmentation, whiteSpaceProfile),
    ...segmentation,
  };
}
