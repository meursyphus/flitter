// Prepare/measure bridge adapted from chenglou/pretext layout.ts.
// Converts TextAnalysis → PreparedLineBreakData by measuring segments
// with canvas measureText and building parallel arrays of widths/kinds.
//
// Multi-span adaptation: unlike pretext (single font), Flitter supports
// multiple spans with different fonts. measureAnalysisWithFont() measures
// a single span's analysis; the caller concatenates results for multi-span.

import {
  analyzeText,
  canContinueKeepAllTextRun,
  endsWithClosingQuote,
  isCJK,
  isNumericRunSegment,
  kinsokuEnd,
  kinsokuStart,
  leftStickyPunctuation,
  type AnalysisChunk,
  type SegmentBreakKind,
  type TextAnalysis,
  type WhiteSpaceMode,
  type WordBreakMode,
} from "./analysis";
import {
  type BreakableFitMode,
  getCorrectedSegmentWidth,
  getEngineProfile,
  getFontMeasurementState,
  getSegmentBreakableFitAdvances,
  getSegmentMetrics,
  textMayContainEmoji,
} from "./measurement";
import type { PreparedLineBreakData } from "./line-break";

export type { WhiteSpaceMode, WordBreakMode };

export type PrepareOptions = {
  whiteSpace?: WhiteSpaceMode;
  wordBreak?: WordBreakMode;
};

// Internal chunk type for hard-break boundaries
type PreparedLineChunk = {
  startSegmentIndex: number;
  endSegmentIndex: number;
  consumedEndSegmentIndex: number;
};

let sharedGraphemeSegmenter: Intl.Segmenter | null = null;

function getSharedGraphemeSegmenter(): Intl.Segmenter {
  if (sharedGraphemeSegmenter === null) {
    sharedGraphemeSegmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
  }
  return sharedGraphemeSegmenter;
}

type MeasuredTextUnit = {
  text: string;
  start: number;
};

function buildBaseCjkUnits(
  segText: string,
  engineProfile: ReturnType<typeof getEngineProfile>,
): MeasuredTextUnit[] {
  const units: MeasuredTextUnit[] = [];
  let unitParts: string[] = [];
  let unitStart = 0;
  let unitContainsCJK = false;
  let unitEndsWithClosingQuote = false;
  let unitIsSingleKinsokuEnd = false;

  function pushUnit(): void {
    if (unitParts.length === 0) return;
    units.push({
      text: unitParts.length === 1 ? unitParts[0]! : unitParts.join(""),
      start: unitStart,
    });
    unitParts = [];
    unitContainsCJK = false;
    unitEndsWithClosingQuote = false;
    unitIsSingleKinsokuEnd = false;
  }

  function startUnit(grapheme: string, start: number, graphemeContainsCJK: boolean): void {
    unitParts = [grapheme];
    unitStart = start;
    unitContainsCJK = graphemeContainsCJK;
    unitEndsWithClosingQuote = endsWithClosingQuote(grapheme);
    unitIsSingleKinsokuEnd = kinsokuEnd.has(grapheme);
  }

  function appendToUnit(grapheme: string, graphemeContainsCJK: boolean): void {
    unitParts.push(grapheme);
    unitContainsCJK = unitContainsCJK || graphemeContainsCJK;
    const graphemeEndsWithClosingQuote = endsWithClosingQuote(grapheme);
    if (grapheme.length === 1 && leftStickyPunctuation.has(grapheme)) {
      unitEndsWithClosingQuote = unitEndsWithClosingQuote || graphemeEndsWithClosingQuote;
    } else {
      unitEndsWithClosingQuote = graphemeEndsWithClosingQuote;
    }
    unitIsSingleKinsokuEnd = false;
  }

  for (const gs of getSharedGraphemeSegmenter().segment(segText)) {
    const grapheme = gs.segment;
    const graphemeContainsCJK = isCJK(grapheme);

    if (unitParts.length === 0) {
      startUnit(grapheme, gs.index, graphemeContainsCJK);
      continue;
    }

    if (
      unitIsSingleKinsokuEnd ||
      kinsokuStart.has(grapheme) ||
      leftStickyPunctuation.has(grapheme) ||
      (engineProfile.carryCJKAfterClosingQuote &&
        graphemeContainsCJK &&
        unitEndsWithClosingQuote)
    ) {
      appendToUnit(grapheme, graphemeContainsCJK);
      continue;
    }

    if (!unitContainsCJK && !graphemeContainsCJK) {
      appendToUnit(grapheme, graphemeContainsCJK);
      continue;
    }

    pushUnit();
    startUnit(grapheme, gs.index, graphemeContainsCJK);
  }

  pushUnit();
  return units;
}

function mergeKeepAllTextUnits(units: MeasuredTextUnit[]): MeasuredTextUnit[] {
  if (units.length <= 1) return units;

  const merged: MeasuredTextUnit[] = [];
  let currentTextParts = [units[0]!.text];
  let currentStart = units[0]!.start;
  let currentContainsCJK = isCJK(units[0]!.text);
  let currentCanContinue = canContinueKeepAllTextRun(units[0]!.text);

  function flushCurrent(): void {
    merged.push({
      text: currentTextParts.length === 1 ? currentTextParts[0]! : currentTextParts.join(""),
      start: currentStart,
    });
  }

  for (let i = 1; i < units.length; i++) {
    const next = units[i]!;
    const nextContainsCJK = isCJK(next.text);
    const nextCanContinue = canContinueKeepAllTextRun(next.text);

    if (currentContainsCJK && currentCanContinue) {
      currentTextParts.push(next.text);
      currentContainsCJK = currentContainsCJK || nextContainsCJK;
      currentCanContinue = nextCanContinue;
      continue;
    }

    flushCurrent();
    currentTextParts = [next.text];
    currentStart = next.start;
    currentContainsCJK = nextContainsCJK;
    currentCanContinue = nextCanContinue;
  }

  flushCurrent();
  return merged;
}

// Result of measuring a single span's analysis — ready to be concatenated
// with other spans into a combined PreparedLineBreakData.
export type MeasuredSpanResult = {
  widths: number[];
  lineEndFitAdvances: number[];
  lineEndPaintAdvances: number[];
  kinds: SegmentBreakKind[];
  simpleLineWalkFastPath: boolean;
  breakableFitAdvances: (number[] | null)[];
  discretionaryHyphenWidth: number;
  tabStopAdvance: number;
  chunks: PreparedLineChunk[];
  // Per-segment text for building SpanBoxes
  segments: string[];
  // Per-segment start offset in source text
  segmentStarts: number[];
};

/**
 * Analyze and measure a single text span with its font.
 * Returns parallel arrays ready for line-breaking.
 */
export function measureSpanText(
  text: string,
  font: string,
  options?: PrepareOptions,
): MeasuredSpanResult {
  const wordBreak = options?.wordBreak ?? "normal";
  const analysis = analyzeText(text, getEngineProfile(), options?.whiteSpace, wordBreak);
  return measureAnalysisWithFont(analysis, font, wordBreak);
}

function measureAnalysisWithFont(
  analysis: TextAnalysis,
  font: string,
  wordBreak: WordBreakMode,
): MeasuredSpanResult {
  const engineProfile = getEngineProfile();
  const { cache, emojiCorrection } = getFontMeasurementState(
    font,
    textMayContainEmoji(analysis.normalized),
  );
  const discretionaryHyphenWidth = getCorrectedSegmentWidth("-", getSegmentMetrics("-", cache), emojiCorrection);
  const spaceWidth = getCorrectedSegmentWidth(" ", getSegmentMetrics(" ", cache), emojiCorrection);
  const tabStopAdvance = spaceWidth * 8;

  if (analysis.len === 0) {
    return {
      widths: [],
      lineEndFitAdvances: [],
      lineEndPaintAdvances: [],
      kinds: [],
      simpleLineWalkFastPath: true,
      breakableFitAdvances: [],
      discretionaryHyphenWidth,
      tabStopAdvance,
      chunks: [],
      segments: [],
      segmentStarts: [],
    };
  }

  const widths: number[] = [];
  const lineEndFitAdvances: number[] = [];
  const lineEndPaintAdvances: number[] = [];
  const kinds: SegmentBreakKind[] = [];
  let simpleLineWalkFastPath = analysis.chunks.length <= 1;
  const breakableFitAdvances: (number[] | null)[] = [];
  const segments: string[] = [];
  const segmentStarts: number[] = [];
  const preparedStartByAnalysisIndex = Array.from<number>({ length: analysis.len });

  function pushMeasuredSegment(
    text: string,
    width: number,
    lineEndFitAdvance: number,
    lineEndPaintAdvance: number,
    kind: SegmentBreakKind,
    start: number,
    breakableFitAdvance: number[] | null,
  ): void {
    if (kind !== "text" && kind !== "space" && kind !== "zero-width-break") {
      simpleLineWalkFastPath = false;
    }
    widths.push(width);
    lineEndFitAdvances.push(lineEndFitAdvance);
    lineEndPaintAdvances.push(lineEndPaintAdvance);
    kinds.push(kind);
    breakableFitAdvances.push(breakableFitAdvance);
    segments.push(text);
    segmentStarts.push(start);
  }

  function pushMeasuredTextSegment(
    text: string,
    kind: SegmentBreakKind,
    start: number,
    wordLike: boolean,
    allowOverflowBreaks: boolean,
  ): void {
    const textMetrics = getSegmentMetrics(text, cache);
    const width = getCorrectedSegmentWidth(text, textMetrics, emojiCorrection);
    const lineEndFitAdvance =
      kind === "space" || kind === "preserved-space" || kind === "zero-width-break"
        ? 0
        : width;
    const lineEndPaintAdvance =
      kind === "space" || kind === "zero-width-break"
        ? 0
        : width;

    if (allowOverflowBreaks && wordLike && text.length > 1) {
      let fitMode: BreakableFitMode = "sum-graphemes";
      if (isNumericRunSegment(text)) {
        fitMode = "pair-context";
      } else if (engineProfile.preferPrefixWidthsForBreakableRuns) {
        fitMode = "segment-prefixes";
      }
      const fitAdvances = getSegmentBreakableFitAdvances(
        text,
        textMetrics,
        cache,
        emojiCorrection,
        fitMode,
      );
      pushMeasuredSegment(
        text,
        width,
        lineEndFitAdvance,
        lineEndPaintAdvance,
        kind,
        start,
        fitAdvances,
      );
      return;
    }

    pushMeasuredSegment(
      text,
      width,
      lineEndFitAdvance,
      lineEndPaintAdvance,
      kind,
      start,
      null,
    );
  }

  for (let mi = 0; mi < analysis.len; mi++) {
    preparedStartByAnalysisIndex[mi] = widths.length;
    const segText = analysis.texts[mi]!;
    const segWordLike = analysis.isWordLike[mi]!;
    const segKind = analysis.kinds[mi]!;
    const segStart = analysis.starts[mi]!;

    if (segKind === "soft-hyphen") {
      pushMeasuredSegment(
        segText,
        0,
        discretionaryHyphenWidth,
        discretionaryHyphenWidth,
        segKind,
        segStart,
        null,
      );
      continue;
    }

    if (segKind === "hard-break") {
      pushMeasuredSegment(segText, 0, 0, 0, segKind, segStart, null);
      continue;
    }

    if (segKind === "tab") {
      pushMeasuredSegment(segText, 0, 0, 0, segKind, segStart, null);
      continue;
    }

    const segMetrics = getSegmentMetrics(segText, cache);

    if (segKind === "text" && segMetrics.containsCJK) {
      const baseUnits = buildBaseCjkUnits(segText, engineProfile);
      const measuredUnits = wordBreak === "keep-all"
        ? mergeKeepAllTextUnits(baseUnits)
        : baseUnits;

      for (let i = 0; i < measuredUnits.length; i++) {
        const unit = measuredUnits[i]!;
        pushMeasuredTextSegment(
          unit.text,
          "text",
          segStart + unit.start,
          segWordLike,
          wordBreak === "keep-all" || !isCJK(unit.text),
        );
      }
      continue;
    }

    pushMeasuredTextSegment(segText, segKind, segStart, segWordLike, true);
  }

  const chunks = mapAnalysisChunksToPreparedChunks(analysis.chunks, preparedStartByAnalysisIndex, widths.length);

  return {
    widths,
    lineEndFitAdvances,
    lineEndPaintAdvances,
    kinds,
    simpleLineWalkFastPath,
    breakableFitAdvances,
    discretionaryHyphenWidth,
    tabStopAdvance,
    chunks,
    segments,
    segmentStarts,
  };
}

function mapAnalysisChunksToPreparedChunks(
  chunks: AnalysisChunk[],
  preparedStartByAnalysisIndex: number[],
  preparedEndSegmentIndex: number,
): PreparedLineChunk[] {
  const preparedChunks: PreparedLineChunk[] = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]!;
    const startSegmentIndex =
      chunk.startSegmentIndex < preparedStartByAnalysisIndex.length
        ? preparedStartByAnalysisIndex[chunk.startSegmentIndex]!
        : preparedEndSegmentIndex;
    const endSegmentIndex =
      chunk.endSegmentIndex < preparedStartByAnalysisIndex.length
        ? preparedStartByAnalysisIndex[chunk.endSegmentIndex]!
        : preparedEndSegmentIndex;
    const consumedEndSegmentIndex =
      chunk.consumedEndSegmentIndex < preparedStartByAnalysisIndex.length
        ? preparedStartByAnalysisIndex[chunk.consumedEndSegmentIndex]!
        : preparedEndSegmentIndex;

    preparedChunks.push({
      startSegmentIndex,
      endSegmentIndex,
      consumedEndSegmentIndex,
    });
  }
  return preparedChunks;
}

/**
 * Combine multiple MeasuredSpanResults (one per source span) into a single
 * PreparedLineBreakData for the line walker. Also returns per-segment metadata
 * for creating SpanBoxes after layout.
 */
export function combineMeasuredSpans(
  spans: MeasuredSpanResult[],
): {
  prepared: PreparedLineBreakData;
  segments: string[];
  segmentStarts: number[];
} {
  if (spans.length === 0) {
    return {
      prepared: {
        widths: [],
        lineEndFitAdvances: [],
        lineEndPaintAdvances: [],
        kinds: [],
        simpleLineWalkFastPath: true,
        breakableFitAdvances: [],
        discretionaryHyphenWidth: 0,
        tabStopAdvance: 0,
        chunks: [],
      },
      segments: [],
      segmentStarts: [],
    };
  }

  if (spans.length === 1) {
    const s = spans[0]!;
    return {
      prepared: {
        widths: s.widths,
        lineEndFitAdvances: s.lineEndFitAdvances,
        lineEndPaintAdvances: s.lineEndPaintAdvances,
        kinds: s.kinds,
        simpleLineWalkFastPath: s.simpleLineWalkFastPath,
        breakableFitAdvances: s.breakableFitAdvances,
        discretionaryHyphenWidth: s.discretionaryHyphenWidth,
        tabStopAdvance: s.tabStopAdvance,
        chunks: s.chunks,
      },
      segments: s.segments,
      segmentStarts: s.segmentStarts,
    };
  }

  // Concatenate all spans
  const widths: number[] = [];
  const lineEndFitAdvances: number[] = [];
  const lineEndPaintAdvances: number[] = [];
  const kinds: SegmentBreakKind[] = [];
  const breakableFitAdvances: (number[] | null)[] = [];
  const allSegments: string[] = [];
  const allSegmentStarts: number[] = [];
  let simpleLineWalkFastPath = true;
  let discretionaryHyphenWidth = 0;
  let tabStopAdvance = 0;
  const allChunks: PreparedLineChunk[] = [];

  for (const span of spans) {
    const offset = widths.length;

    widths.push(...span.widths);
    lineEndFitAdvances.push(...span.lineEndFitAdvances);
    lineEndPaintAdvances.push(...span.lineEndPaintAdvances);
    kinds.push(...span.kinds);
    breakableFitAdvances.push(...span.breakableFitAdvances);
    allSegments.push(...span.segments);
    allSegmentStarts.push(...span.segmentStarts);

    if (!span.simpleLineWalkFastPath) {
      simpleLineWalkFastPath = false;
    }

    // Use the first non-zero values
    if (discretionaryHyphenWidth === 0 && span.discretionaryHyphenWidth > 0) {
      discretionaryHyphenWidth = span.discretionaryHyphenWidth;
    }
    if (tabStopAdvance === 0 && span.tabStopAdvance > 0) {
      tabStopAdvance = span.tabStopAdvance;
    }

    // Offset chunk indices
    for (const chunk of span.chunks) {
      allChunks.push({
        startSegmentIndex: chunk.startSegmentIndex + offset,
        endSegmentIndex: chunk.endSegmentIndex + offset,
        consumedEndSegmentIndex: chunk.consumedEndSegmentIndex + offset,
      });
    }
  }

  // When combining multiple spans that each have no hard breaks (<=1 chunk),
  // the combined result might still be simple if no individual span broke it
  if (allChunks.length > 1) {
    simpleLineWalkFastPath = false;
  } else if (allChunks.length === 0 && widths.length > 0) {
    // No chunks from any span — treat as single chunk spanning everything
    allChunks.push({
      startSegmentIndex: 0,
      endSegmentIndex: widths.length,
      consumedEndSegmentIndex: widths.length,
    });
  }

  return {
    prepared: {
      widths,
      lineEndFitAdvances,
      lineEndPaintAdvances,
      kinds,
      simpleLineWalkFastPath,
      breakableFitAdvances,
      discretionaryHyphenWidth,
      tabStopAdvance,
      chunks: allChunks,
    },
    segments: allSegments,
    segmentStarts: allSegmentStarts,
  };
}
