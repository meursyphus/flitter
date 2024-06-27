import { GlobalKey } from "../framework";
import { State } from "../element";
import {
  Alignment,
  Border,
  BoxDecoration,
  Constraints,
  EdgeInsets,
  TextAlign,
  TextDirection,
  TextPainter,
  TextSpan,
  TextStyle,
  TextWidthBasis,
} from "../type";
import { assert, browser, classToFunction } from "../utils";
import { StatefulWidget, type Widget } from "../widget";
import ConstraintsTransformBox from "./ConstraintsTransformBox";
import Container from "./Container";
import GestureDetector from "./GestureDetector";
import Opacity from "./Opacity";
import Positioned from "./Positioned";
import RichText from "./RichText";
import SizedBox from "./SizedBox";
import Stack from "./Stack";

type TextFieldProps = {
  key?: any;
  onChanged?: (text: string) => void;
  onSubmitted?: (text: string) => void;
  onFocused?: () => void;
  onBlurred?: () => void;
  style?: TextStyle;
  maxLines?: number;
  textAlign?: TextAlign;
  textDirection?: TextDirection;
  decoration?: BoxDecoration;
  padding?: EdgeInsets;
  width?: number;
  height?: number;
  focusedBorder?: Border;
};

class TextField extends StatefulWidget {
  text: string;
  onChanged?: (text: string) => void;
  onSubmitted?: (text: string) => void;
  onFocused?: () => void;
  onBlurred?: () => void;
  style: TextStyle;
  maxLines?: number;
  textAlign?: TextAlign;
  textDirection?: TextDirection;
  decoration?: BoxDecoration;
  padding: EdgeInsets;
  width?: number;
  height?: number;
  focusedBorder?: Border;
  constructor(
    text: string,
    {
      key,
      onChanged,
      onSubmitted,
      onFocused,
      onBlurred,
      style = new TextStyle(),
      maxLines = 1,
      textAlign = TextAlign.start,
      textDirection = TextDirection.ltr,
      decoration = new BoxDecoration({
        border: Border.all({ color: "black", width: 1 }),
      }),
      padding = EdgeInsets.all(0),
      width = Infinity,
      height = 20,
      focusedBorder = Border.all({ color: "blue", width: 1 }),
    }: TextFieldProps = {},
  ) {
    super(key);
    this.text = text;
    this.onChanged = onChanged;
    this.onSubmitted = onSubmitted;
    this.onFocused = onFocused;
    this.onBlurred = onBlurred;
    this.style = style;
    this.maxLines = maxLines;
    this.textAlign = textAlign;
    this.textDirection = textDirection;
    this.decoration = decoration;
    this.padding = padding;
    this.width = width;
    this.height = height;
    this.focusedBorder = focusedBorder;
  }
  createState(): TextFieldState {
    return new TextFieldState();
  }
}

interface LineInfo {
  y: number;
  height: number;
  accumulatedChars: number;
  lineLength: number;
}

interface CaretInfo {
  width: number;
  height: number;
  color: string;
  y: number;
  x: number;
}

interface SelectionSegment {
  y: number;
  start: number;
  end: number;
  height: number;
}

const ZERO_WIDTH_SPACE = "\u200B";

class TextFieldState extends State<TextField> {
  #nativeInput = new NativeInput();
  value = "";
  #selection: [number, number] = [0, 0];
  #caretUi: CaretInfo | null = null;
  #textPainter!: TextPainter;
  #selectionUI: SelectionSegment[] = [];
  #textKey = new GlobalKey();
  #selectionStart: number = 0;
  #textFieldPosition: { x: number; y: number } | null = null;
  #focused = false;

  constructor() {
    super();
  }

  override didUpdateWidget(oldWidget: TextField): void {
    if (
      oldWidget.text !== this.widget.text ||
      !oldWidget.style.equals(this.widget.style)
    ) {
      this.#setText(this.widget.text);

      return;
    }
  }

  get paragraphLines() {
    return this.#textPainter.paragraph?.lines;
  }

  get #hasSelection() {
    return this.#selection[0] !== this.#selection[1];
  }

  override initState(): void {
    this.#setText(this.widget.text);

    this.#nativeInput.addEventListener("input", () => {
      this.widget.onChanged?.(this.#nativeInput.value);
    });
    this.#nativeInput.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.widget.onSubmitted?.(this.#nativeInput.value);
      }
      setTimeout(() => {
        this.#syncThis();
      }, 0);
    });

    this.#nativeInput.addEventListener("blur", () => {
      this.#syncBlur();
      this.widget.onBlurred?.();
    });

    this.#nativeInput.addEventListener("focus", () => {
      this.widget.onFocused?.();
    });
  }

  override dispose(): void {
    this.#nativeInput.dispose();
  }

  #setText(text: string) {
    this.value = text;
    this.#textPainter = new TextPainter({
      text: this.#toTextSpan(),
      textDirection: this.widget.textDirection,
      textScaleFactor: 1,
      textWidthBasis: TextWidthBasis.parent,
      textAlign: this.widget.textAlign,
      maxLines: this.widget.maxLines,
      ellipsis: undefined,
    });
  }
  #toTextSpan() {
    return new TextSpan({
      /**
       * Please insert an empty string.
       * Otherwise, the caret position cannot be calculated when there are no lines and nothing is present.
       */
      text: this.value ? "" : ZERO_WIDTH_SPACE,
      style: this.widget.style,
      children: this.value.split("").map(
        text =>
          new TextSpan({
            text,
            style: this.widget.style,
          }),
      ),
    });
  }

  #syncThis() {
    this.#setText(this.#nativeInput.value);
    this.#textPainter.layout();
    this.#render();
    this.element.scheduler.addPostFrameCallbacks(() => {
      this.#setSelection(...this.#nativeInput.getSelection());
      this.#render();
    });
  }

  #syncBlur = () => {
    this.#selection = [0, 0];
    this.#caretUi = null;
    this.#selectionUI = null;
    this.#focused = false;
    this.#render();
  };

  focus = (location: number = this.value.length) => {
    this.#nativeInput.value = this.value;
    this.#nativeInput.focus();
    this.#setSelection(location);
    this.#nativeInput.setCaret(location);
    this.#focused = true;
    this.#render();
  };

  #render() {
    this.setState();
  }

  #calculateLineInfo(): LineInfo[] {
    const lines = this.#textPainter?.paragraph?.lines ?? [];
    let accumulatedChars = 0;
    let accumulatedHeight = 0;

    return lines.map(line => {
      const lineInfo: LineInfo = {
        y: accumulatedHeight,
        height: line.height,
        accumulatedChars: accumulatedChars,
        lineLength: line.spanBoxes.length,
      };
      accumulatedChars += line.spanBoxes.length;
      accumulatedHeight += line.height;
      return lineInfo;
    });
  }

  #findLineIndexForPosition(lineInfo: LineInfo[], position: number): number {
    let low = 0;
    let high = lineInfo.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const lineStart = lineInfo[mid].accumulatedChars;
      const lineEnd = lineStart + lineInfo[mid].lineLength;

      if (position >= lineStart && position < lineEnd) {
        return mid;
      } else if (position < lineStart) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    return lineInfo.length - 1; // handle the last line
  }

  #calculateCaret(lineInfo: LineInfo[], caretLocation: number): CaretInfo {
    const lineIndex = this.#findLineIndexForPosition(lineInfo, caretLocation);
    const line = lineInfo[lineIndex];
    const localCaretPosition = caretLocation - line.accumulatedChars;

    const lines = this.#textPainter?.paragraph?.lines ?? [];
    const spanBoxes = lines[lineIndex]?.spanBoxes ?? [];

    let x = 0;
    if (localCaretPosition > 0 && localCaretPosition <= spanBoxes.length) {
      const prevChar = spanBoxes[localCaretPosition - 1];
      x = prevChar.offset.x + prevChar.size.width;
    } else if (spanBoxes.length > 0) {
      x = spanBoxes[0].offset.x;
    }

    return {
      height: line.height,
      y: line.y,
      x: x,
      color: spanBoxes[localCaretPosition]?.color || "black",
      width: 1,
    };
  }

  #calculateSelectionUI(
    lineInfo: LineInfo[],
    start: number,
    end: number,
  ): SelectionSegment[] {
    const startLineIndex = this.#findLineIndexForPosition(lineInfo, start);
    const endLineIndex = this.#findLineIndexForPosition(lineInfo, end);

    const segments: SelectionSegment[] = [];
    const lines = this.#textPainter?.paragraph?.lines ?? [];

    for (let i = startLineIndex; i <= endLineIndex; i++) {
      const line = lineInfo[i];
      const spanBoxes = lines[i]?.spanBoxes ?? [];

      const segmentStart =
        i === startLineIndex ? start - line.accumulatedChars : 0;
      const segmentEnd =
        i === endLineIndex ? end - line.accumulatedChars : line.lineLength;

      const startX =
        segmentStart > 0 && segmentStart <= spanBoxes.length
          ? spanBoxes[segmentStart - 1].offset.x +
            spanBoxes[segmentStart - 1].size.width
          : spanBoxes[0]?.offset.x || 0;

      const endX =
        segmentEnd > 0 && segmentEnd <= spanBoxes.length
          ? spanBoxes[segmentEnd - 1].offset.x +
            spanBoxes[segmentEnd - 1].size.width
          : spanBoxes[spanBoxes.length - 1]?.offset.x +
              spanBoxes[spanBoxes.length - 1]?.size.width || 0;

      segments.push({
        y: line.y,
        start: startX,
        end: endX,
        height: line.height,
      });
    }

    return segments;
  }

  #setSelection(start: number, end: number = start) {
    this.#selection = [start, end];
    const caretLocation = start;

    const lineInfo = this.#calculateLineInfo();
    if (this.#hasSelection) {
      this.#selectionUI = this.#calculateSelectionUI(lineInfo, start, end);
      this.#caretUi = null;
    } else {
      this.#selectionUI = null;
      this.#caretUi = this.#calculateCaret(lineInfo, caretLocation);
    }
    this.#render();
  }

  blur = () => {
    this.#syncBlur();
    this.#nativeInput.blur();
  };

  #getCharIndexFromMouseEvent = (e: MouseEvent): number => {
    if (!this.#textFieldPosition) {
      return 0;
    }

    const [x, y] = [
      e.clientX - this.#textFieldPosition.x,
      e.clientY - this.#textFieldPosition.y,
    ];

    const lines = this.#textPainter?.paragraph?.lines ?? [];
    if (lines.length === 0) {
      return 0;
    }

    const accumulatedHeights = lines.reduce((acc, line, index) => {
      acc.push((acc[index - 1] || 0) + line.height);
      return acc;
    }, [] as number[]);

    // Binary search to find the correct line
    let low = 0;
    let high = lines.length - 1;
    let lineIndex = -1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const lineTop = mid > 0 ? accumulatedHeights[mid - 1] : 0;
      const lineBottom = accumulatedHeights[mid];

      if (y >= lineTop && y < lineBottom) {
        lineIndex = mid;
        break;
      } else if (y < lineTop) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    // If the click is below the last line, handle it as the last line
    if (lineIndex === -1) {
      lineIndex = lines.length - 1;
    }

    let globalCharIndex = 0;

    // Calculate the number of characters in previous lines
    for (let i = 0; i < lineIndex; i++) {
      globalCharIndex += lines[i].spanBoxes.length;
    }

    const line = lines[lineIndex];

    // Binary search to find the correct spanBox in the line
    low = 0;
    high = line.spanBoxes.length - 1;
    let spanBoxIndex = -1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const box = line.spanBoxes[mid];
      const boxStart = box.offset.x;
      const boxEnd = boxStart + box.size.width;

      if (x >= boxStart && x < boxEnd) {
        spanBoxIndex = mid;
        break;
      } else if (x < boxStart) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    // If the click is after the last character, handle it as the next character
    if (spanBoxIndex === -1) {
      globalCharIndex += line.spanBoxes.length;
    } else {
      globalCharIndex += spanBoxIndex;
      const box = line.spanBoxes[spanBoxIndex];
      // Move to the next character if the click is on the right half of the character
      if (x > box.offset.x + box.size.width / 2) {
        globalCharIndex++;
      }
    }

    return globalCharIndex;
  };

  handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();

    const root = this.element.renderObject.renderOwner.renderContext.view;
    const rootPosition = root.getBoundingClientRect();
    const position = this.#textKey.currentContext.renderObject.localToGlobal();
    this.#textFieldPosition = {
      x: rootPosition.x + position.x,
      y: rootPosition.y + position.y,
    };

    const globalCharIndex = this.#getCharIndexFromMouseEvent(e);
    this.#selectionStart = globalCharIndex;
    this.focus(globalCharIndex);
  };

  handleMouseMove = (e: MouseEvent) => {
    if (!this.#textFieldPosition) return;
    const currentIndex = this.#getCharIndexFromMouseEvent(e);
    const start = Math.min(this.#selectionStart, currentIndex);
    const end = Math.max(this.#selectionStart, currentIndex);

    this.#setSelection(start, end);
    this.#nativeInput.setSelection(start, end);
  };

  handleMouseUp = () => {
    this.#textFieldPosition = null;
  };

  override build() {
    return Container({
      width: this.widget.width,
      padding: this.widget.padding,
      decoration: !this.#focused
        ? this.widget.decoration
        : this.widget.decoration.copyWith({
            border: this.widget.focusedBorder,
          }),
      child: GestureDetector({
        onMouseDown: this.handleMouseDown,
        onMouseMove: this.handleMouseMove,
        onMouseUp: this.handleMouseUp,
        cursor: "text",
        child: Stack({
          clipped: false,
          children: [
            Container({
              child: ConstraintsTransformBox({
                alignment: Alignment.topLeft,
                constraintsTransform: constraints => {
                  return new Constraints({
                    minHeight: Math.max(
                      this.widget.height,
                      constraints.minHeight,
                    ),
                    minWidth: constraints.minWidth,
                    maxHeight: constraints.maxHeight,
                    maxWidth: constraints.maxWidth,
                  });
                },
                child: RichText({
                  key: this.#textKey,
                  text: undefined as unknown as TextSpan,
                  textPainter: this.#textPainter,
                }),
              }),
            }),
            ...(this.#selectionUI?.map(segment =>
              Positioned({
                top: segment.y,
                left: segment.start,
                child: Container({
                  width: segment.end - segment.start,
                  height: segment.height,
                  color: "rgba(0, 0, 255, 0.2)", // 반투명한 파란색
                }),
              }),
            ) ?? []),
            this.#caretUi
              ? Positioned({
                  top: this.#caretUi.y,
                  left: this.#caretUi.x,
                  child: new Caret({
                    width: this.#caretUi.width,
                    height: this.#caretUi.height,
                    color: this.#caretUi.color,
                  }),
                })
              : SizedBox.shrink(),
          ],
        }),
      }),
    });
  }
}

class Caret extends StatefulWidget {
  width: number;
  height: number;
  color: string;
  constructor({
    width,
    height,
    color,
  }: {
    width: number;
    height: number;
    color: string;
  }) {
    super();
    this.width = width;
    this.height = height;
    this.color = color;
  }

  override createState(): State<StatefulWidget> {
    return new CaretState();
  }
}

class CaretState extends State<Caret> {
  visible = false;
  interval?: NodeJS.Timeout;
  initState(): void {
    this.interval = setInterval(() => {
      this.setState(() => {
        this.visible = !this.visible;
      });
    }, 500);
  }

  dispose(): void {
    this.interval && clearInterval(this.interval);
  }

  build(): Widget {
    return Opacity({
      opacity: this.visible ? 1 : 0,
      child: Container({
        width: this.widget.width,
        height: this.widget.height,
        color: this.widget.color,
      }),
    });
  }
}

/**
 * @description This class serves as an abstraction layer to handle browser-specific implementations,
 * ensuring compatibility across different environments.
 */
class NativeInput {
  #element: HTMLTextAreaElement | null = null;
  private get element(): HTMLTextAreaElement {
    assert(!this.#disposed, "invalid access. because native input is disposed");

    if (this.#element == null) {
      if (browser) {
        this.#element = document.createElement("textarea");
        this.#element.setAttribute(
          "style",
          "width: 300px; height: 150px; font-size: 20px; font-family: Roboto;",
        );
        //this.#element.setAttribute('style', 'position: absolute; opacity: 0; height: 0; width: 0;');
        document.body.appendChild(this.#element);
      } else {
        this.#element = {
          focus: () => {},
          blur: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
        } as unknown as HTMLTextAreaElement;
      }
    }

    return this.#element!;
  }

  #disposed = false;
  dispose = () => {
    this.#element?.remove();
    this.#element = null;
    this.#disposed = true;
  };

  set value(newValue: string) {
    this.element.value = newValue;
  }
  get value(): string {
    return this.element.value;
  }

  focus = () => {
    this.element.focus({ preventScroll: true });
  };

  blur = () => {
    this.element.blur();
  };

  getSelection = (): [number, number] => {
    return [this.element.selectionStart, this.element.selectionEnd];
  };

  setSelection = (start: number, end: number = start) => {
    this.element.selectionStart = start;
    this.element.selectionEnd = end;
  };

  setCaret = (pos: number) => {
    this.setSelection(pos, pos);
  };

  addEventListener = (
    ...args: Parameters<HTMLTextAreaElement["addEventListener"]>
  ) => {
    this.element.addEventListener(...args);
  };

  removeEventListener = (
    ...args: Parameters<HTMLTextAreaElement["removeEventListener"]>
  ) => {
    this.element.removeEventListener(...args);
  };
}

export default classToFunction(TextField);
