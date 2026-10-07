import { GlobalKey } from "../framework";
import { State } from "../element";
import {
  Alignment,
  Border,
  BoxDecoration,
  Constraints,
  CrossAxisAlignment,
  EdgeInsets,
  FocusNode,
  InputDecoration,
  MainAxisSize,
  Offset,
  Rect,
  TextAlign,
  TextDirection,
  TextPainter,
  TextEditingController,
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
import Column from "./Column";
import Row from "./Row";
import Expanded from "./Expanded";
import Text from "./Text";
import ClipRect from "./ClipRect";
import Transform from "./Transform";

type TextFieldProps = {
  key?: any;
  controller?: TextEditingController;
  focusNode?: FocusNode;
  autofocus?: boolean;
  ariaLabel?: string;
  onChanged?: (text: string) => void;
  onSubmitted?: (text: string) => void;
  onFocused?: () => void;
  onBlurred?: () => void;
  style?: TextStyle;
  maxLines?: number;
  textAlign?: TextAlign;
  textDirection?: TextDirection;
  decoration?: BoxDecoration | InputDecoration;
  padding?: EdgeInsets;
  width?: number;
  height?: number;
  focusedBorder?: Border;
};

class TextField extends StatefulWidget {
  controller?: TextEditingController;
  focusNode?: FocusNode;
  autofocus: boolean;
  ariaLabel?: string;
  inputDecoration?: InputDecoration;
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
    text: string = "",
    {
      key,
      controller,
      focusNode,
      autofocus = false,
      ariaLabel,
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
    assert(
      Number.isInteger(maxLines) && maxLines > 0,
      "maxLines must be a positive integer",
    );
    this.controller = controller;
    this.focusNode = focusNode;
    this.autofocus = autofocus;
    this.ariaLabel = ariaLabel;
    this.inputDecoration =
      decoration instanceof InputDecoration ? decoration : undefined;
    this.text = text;
    this.onChanged = onChanged;
    this.onSubmitted = onSubmitted;
    this.onFocused = onFocused;
    this.onBlurred = onBlurred;
    this.style = style;
    this.maxLines = maxLines;
    this.textAlign = textAlign;
    this.textDirection = textDirection;
    this.decoration =
      decoration instanceof InputDecoration
        ? new BoxDecoration({
            border:
              decoration.border ?? Border.all({ color: "black", width: 1 }),
          })
        : decoration;
    this.padding = this.inputDecoration?.contentPadding ?? padding;
    this.width = width;
    this.height = height;
    this.focusedBorder = this.inputDecoration?.focusedBorder ?? focusedBorder;
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

interface SelectionSegment {
  y: number;
  start: number;
  end: number;
  height: number;
}

const ZERO_WIDTH_SPACE = "\u200B";

type CurrentCharUI = {
  rect: Rect;
  color: string;
};

class TextFieldState extends State<TextField> {
  #nativeInput = new NativeInput();
  value = "";
  #selection: [number, number] = [0, 0];
  #textPainter!: TextPainter;
  #selectionUI: SelectionSegment[] = [];
  #textKey = new GlobalKey();
  #viewportKey = new GlobalKey();
  #scrollX = 0;
  #scrollY = 0;
  #lastViewportWidth = NaN;
  #lastViewportHeight = NaN;
  #selectionStart: number = 0;
  #textFieldPosition: { x: number; y: number } | null = null;
  #focused = false;
  #isTyping = false;
  #typingTimer?: ReturnType<typeof setTimeout>;
  #keyTimer?: ReturnType<typeof setTimeout>;
  #disposed = false;
  #updatingController = false;
  #detachFocus?: () => void;
  #isComposing = false;
  #lineInfo: LineInfo[] = [];
  #currentCharUI?: CurrentCharUI;

  constructor() {
    super();
  }

  override didUpdateWidget(oldWidget: TextField): void {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller !== this.widget.controller) {
      oldWidget.controller?.removeListener(this.#controllerChanged);
      this.widget.controller?.addListener(this.#controllerChanged);
    }
    if (oldWidget.focusNode !== this.widget.focusNode) {
      this.#detachFocus?.();
      this.#attachFocus();
    }
    const text =
      this.widget.controller?.text ??
      (oldWidget.text !== this.widget.text ? this.widget.text : this.value);
    this.#nativeInput.configure(this.widget);
    this.#nativeInput.value = text;
    if (
      text !== this.value ||
      !oldWidget.style.equals(this.widget.style) ||
      oldWidget.style.height !== this.widget.style.height ||
      oldWidget.maxLines !== this.widget.maxLines ||
      oldWidget.textAlign !== this.widget.textAlign ||
      oldWidget.textDirection !== this.widget.textDirection
    )
      this.#setText(text);
    if (this.widget.controller) this.#controllerChanged();
  }

  get paragraphLines() {
    return this.#textPainter.paragraph?.getCharacterLines();
  }

  get #hasSelection() {
    return this.#selection[0] !== this.#selection[1];
  }

  override initState(): void {
    super.initState(this.element);
    this.#setText(this.widget.controller?.text ?? this.widget.text);

    this.#nativeInput.addEventListener("compositionstart", () => {
      this.setState(() => {
        this.#isComposing = true;
      });
    });
    this.#nativeInput.addEventListener("compositionend", () => {
      this.setState(() => {
        this.#isComposing = false;
      });
    });

    this.#nativeInput.addEventListener("input", () => {
      const previous = this.value;
      this.#syncThis();
      if (previous !== this.value) this.widget.onChanged?.(this.value);
    });

    this.#nativeInput.addEventListener("keydown", e => {
      if (e.key === "Enter" && !e.isComposing && this.widget.maxLines === 1) {
        this.widget.onSubmitted?.(this.#nativeInput.value);
        return;
      }

      clearTimeout(this.#keyTimer);
      this.#keyTimer = setTimeout(() => {
        if (this.#disposed) return;
        this.#syncThis();
      }, 0);
    });

    this.#nativeInput.addEventListener("blur", () => {
      this.#syncBlur();
      this.widget.onBlurred?.();
    });

    this.#nativeInput.addEventListener("focus", () => {
      this.setState(() => {
        this.#focused = true;
      });
      this.widget.focusNode?.updateFocus(true);
      this.#syncSelectionAfterLayout();
      this.widget.onFocused?.();
    });
    this.#nativeInput.addEventListener("selection", () => {
      if (this.#focused) {
        this.#updateController();
        this.#syncSelectionAfterLayout();
      }
    });
    this.#nativeInput.configure(this.widget);
    this.#nativeInput.value = this.value;
    this.widget.controller?.addListener(this.#controllerChanged);
    if (this.widget.controller) this.#controllerChanged();
    this.#attachFocus();
    if (this.widget.autofocus) this.#afterLayout(() => this.focus());
  }

  override dispose(): void {
    this.#disposed = true;
    clearTimeout(this.#typingTimer);
    clearTimeout(this.#keyTimer);
    this.widget.controller?.removeListener(this.#controllerChanged);
    this.#detachFocus?.();
    this.#nativeInput.dispose();
    if (browser) {
      document.removeEventListener("mousemove", this.handleMouseMove);
      document.removeEventListener("mouseup", this.handleMouseUp);
    }
    super.dispose();
  }

  #afterLayout(callback: () => void) {
    this.element.scheduler.addPostFrameCallbacks(() => {
      if (!this.#disposed) callback();
    });
    this.element.scheduler.ensureVisualUpdate();
  }

  #attachFocus() {
    const node = this.widget.focusNode;
    this.#detachFocus = node?.attach(
      // Native focus is ready after configure(); only selection geometry waits
      // for layout. An unfocus in the same turn can therefore cancel normally.
      () => this.focus(),
      () => this.blur(),
    );
    this.widget.focusNode?.updateFocus(this.#focused);
  }

  #controllerChanged = () => {
    if (this.#updatingController || this.#disposed) return;
    const controller = this.widget.controller;
    if (!controller) return;
    if (controller.text !== this.value) this.#setText(controller.text);
    this.#nativeInput.value = controller.text;
    this.#nativeInput.setSelection(
      controller.selection.start,
      controller.selection.end,
    );
    if (this.#focused) this.#syncSelectionAfterLayout();
  };

  #updateController() {
    const controller = this.widget.controller;
    if (!controller) return;
    const [start, end] = this.#nativeInput.getSelection();
    this.#updatingController = true;
    try {
      controller.value = { text: this.value, selection: { start, end } };
    } finally {
      this.#updatingController = false;
    }
  }

  #syncSelectionAfterLayout() {
    this.#afterLayout(() => {
      if (!this.#focused) return;
      this.#lineInfo = this.#calculateLineInfo();
      this.#setSelection(...this.#nativeInput.getSelection());
    });
  }

  #resetTypingTimer() {
    if (this.#typingTimer) {
      clearTimeout(this.#typingTimer);
    }
    this.#typingTimer = setTimeout(() => {
      if (!this.#disposed)
        this.setState(() => {
          this.#isTyping = false;
        });
    }, 10);
  }

  #setText(text: string) {
    this.setState(() => {
      this.value = text;
      this.#textPainter = new TextPainter({
        text: this.#toTextSpan(),
        textDirection: this.widget.textDirection,
        textScaleFactor: 1,
        textWidthBasis: TextWidthBasis.parent,
        textAlign: this.widget.textAlign,
        // maxLines bounds the viewport, never the editable document.
        ellipsis: undefined,
      });
    });
    this.#afterLayout(() => this.#refreshViewport());
  }

  #refreshViewport() {
    this.#lineInfo = this.#calculateLineInfo();
    if (!this.#viewportKey.buildOwner) return;
    if (this.#focused) {
      this.#setSelection(...this.#nativeInput.getSelection());
      return;
    }
    const { width, height } =
      this.#viewportKey.currentContext.renderObject.size;
    const x = Math.max(
      0,
      Math.min(this.#scrollX, this.#textPainter.width + 1 - width),
    );
    const y = Math.max(
      0,
      Math.min(this.#scrollY, this.#textPainter.height - height),
    );
    if (x !== this.#scrollX || y !== this.#scrollY)
      this.setState(() => {
        this.#scrollX = x;
        this.#scrollY = y;
      });
  }

  #toTextSpan() {
    return new TextSpan({
      // Keep an empty editable line available for the caret.
      text: this.value || ZERO_WIDTH_SPACE,
      style: this.widget.style,
    });
  }

  /**
   * Sync the text field with the native input.
   */
  #syncThis() {
    if (this.#nativeInput.value !== this.value)
      this.#setText(this.#nativeInput.value);
    this.setState(() => {
      this.#isTyping = true;
    });
    this.#resetTypingTimer();
    this.#updateController();
    this.#syncSelectionAfterLayout();
  }

  #syncBlur = () => {
    if (this.#disposed) return;
    this.setState(() => {
      this.#selection = [0, 0];
      this.#currentCharUI = undefined;
      this.#selectionUI = [];
      this.#focused = false;
    });
    this.widget.focusNode?.updateFocus(false);
  };

  focus = (location?: number) => {
    if (this.#disposed) return;
    const selection =
      location === undefined && this.widget.controller
        ? this.widget.controller.selection
        : {
            start: location ?? this.value.length,
            end: location ?? this.value.length,
          };
    this.#nativeInput.value = this.value;
    this.#nativeInput.focus();
    this.#nativeInput.setSelection(selection.start, selection.end);
    this.setState(() => {
      this.#focused = true;
    });
    this.widget.focusNode?.updateFocus(true);
    this.#updateController();
    this.#syncSelectionAfterLayout();
  };

  #render() {
    if (!this.#disposed) this.setState();
  }

  #calculateLineInfo(): LineInfo[] {
    const lines = this.paragraphLines ?? [];
    let accumulatedChars = 0;
    let accumulatedHeight = 0;

    return lines.map(line => {
      const lineInfo: LineInfo = {
        y: accumulatedHeight,
        height: line.height,
        accumulatedChars: line.spanBoxes[0]?.textStart ?? accumulatedChars,
        lineLength:
          (line.spanBoxes[line.spanBoxes.length - 1]?.textEnd ??
            accumulatedChars) -
          (line.spanBoxes[0]?.textStart ?? accumulatedChars),
      };
      accumulatedChars = lineInfo.accumulatedChars + lineInfo.lineLength;
      accumulatedHeight += line.height;
      return lineInfo;
    });
  }

  #findLineIndexForPosition(position: number): number {
    // Constraints can reflow the paragraph without changing the field value.
    this.#lineInfo = this.#calculateLineInfo();
    let low = 0;
    let high = this.#lineInfo.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const lineStart = this.#lineInfo[mid].accumulatedChars;
      const lineEnd = lineStart + this.#lineInfo[mid].lineLength;

      if (position >= lineStart && position < lineEnd) {
        return mid;
      } else if (position < lineStart) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    return this.#lineInfo.length - 1; // handle the last line
  }

  #calculateCurrentCharRect(caretLocation: number): CurrentCharUI {
    const lineIndex = this.#findLineIndexForPosition(caretLocation);
    const line = this.#lineInfo[lineIndex];
    const boxes = this.paragraphLines?.[lineIndex]?.spanBoxes ?? [];
    const previous = boxes.find(
      box => box.textStart < caretLocation && box.textEnd >= caretLocation,
    );
    return {
      rect: Rect.fromLTWH({
        left: previous?.offset.x ?? boxes[0]?.offset.x ?? 0,
        top: line?.y ?? 0,
        width: previous?.size.width ?? 0,
        height: line?.height ?? this.widget.style.fontSize ?? 16,
      }),
      color: previous?.color ?? boxes[0]?.color ?? "black",
    };
  }

  #caretX(lineIndex: number, position: number): number {
    const boxes = this.paragraphLines?.[lineIndex]?.spanBoxes ?? [];
    for (const box of boxes) {
      if (position <= box.textStart) return box.offset.x;
      if (position <= box.textEnd) return box.offset.x + box.size.width;
    }
    const last = boxes[boxes.length - 1];
    return last ? last.offset.x + last.size.width : 0;
  }

  #calculateSelectionUI(start: number, end: number): SelectionSegment[] {
    const startLineIndex = this.#findLineIndexForPosition(start);
    const endLineIndex = this.#findLineIndexForPosition(end);

    const segments: SelectionSegment[] = [];
    for (let i = startLineIndex; i <= endLineIndex; i++) {
      const line = this.#lineInfo[i];
      if (!line) continue;

      const segmentStart =
        i === startLineIndex ? start - line.accumulatedChars : 0;
      const segmentEnd =
        i === endLineIndex ? end - line.accumulatedChars : line.lineLength;

      const startX = this.#caretX(i, line.accumulatedChars + segmentStart);
      const endX = this.#caretX(i, line.accumulatedChars + segmentEnd);

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
    if (this.#lineInfo.length === 0) return;
    this.setState(() => {
      this.#selection = [start, end];
      if (this.#hasSelection) {
        this.#selectionUI = this.#calculateSelectionUI(start, end);
        this.#currentCharUI = undefined;
      } else {
        this.#selectionUI = [];
        this.#currentCharUI = this.#calculateCurrentCharRect(start);
      }
      this.#scrollToCaret(this.#nativeInput.activeSelectionOffset);
    });
  }

  #scrollToCaret(position: number) {
    const viewport = this.#viewportKey.currentContext?.renderObject;
    if (!viewport) return;
    const caret = this.#calculateCurrentCharRect(position).rect;
    const { width, height } = viewport.size;
    if (caret.right < this.#scrollX) this.#scrollX = caret.right;
    else if (caret.right + 1 > this.#scrollX + width)
      this.#scrollX = caret.right + 1 - width;
    if (caret.top < this.#scrollY) this.#scrollY = caret.top;
    else if (caret.bottom > this.#scrollY + height)
      this.#scrollY = caret.bottom - height;
    this.#scrollX = Math.max(
      0,
      Math.min(this.#scrollX, this.#textPainter.width + 1 - width),
    );
    this.#scrollY = Math.max(
      0,
      Math.min(this.#scrollY, this.#textPainter.height - height),
    );
    const root =
      viewport.renderOwner.renderContext.view.getBoundingClientRect();
    const origin = viewport.localToGlobal();
    this.#nativeInput.position(
      root.x + origin.x + caret.right - this.#scrollX,
      root.y + origin.y + caret.top - this.#scrollY,
      caret.height,
    );
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
      e.clientX - this.#textFieldPosition.x + this.#scrollX,
      e.clientY - this.#textFieldPosition.y + this.#scrollY,
    ];

    const lines = this.paragraphLines ?? [];
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
      lineIndex = y < 0 ? 0 : lines.length - 1;
    }

    let globalCharIndex = 0;

    // Calculate the number of characters in previous lines
    for (let i = 0; i < lineIndex; i++) {
      globalCharIndex =
        lines[i].spanBoxes[lines[i].spanBoxes.length - 1]?.textEnd ??
        globalCharIndex;
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

    if (spanBoxIndex === -1) {
      const first = line.spanBoxes[0];
      const last = line.spanBoxes[line.spanBoxes.length - 1];
      globalCharIndex =
        first && x < first.offset.x ? first.textStart : (last?.textEnd ?? 0);
    } else {
      const box = line.spanBoxes[spanBoxIndex];
      globalCharIndex =
        x > box.offset.x + box.size.width / 2 ? box.textEnd : box.textStart;
    }

    return Math.min(this.value.length, globalCharIndex);
  };

  handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();

    const root = this.element.renderObject.renderOwner.renderContext.view;
    const rootPosition = root.getBoundingClientRect();
    const position =
      this.#viewportKey.currentContext.renderObject.localToGlobal();
    this.#textFieldPosition = {
      x: rootPosition.x + position.x,
      y: rootPosition.y + position.y,
    };

    const globalCharIndex = this.#getCharIndexFromMouseEvent(e);
    this.#selectionStart = globalCharIndex;
    this.focus(globalCharIndex);
    if (browser) {
      document.addEventListener("mousemove", this.handleMouseMove);
      document.addEventListener("mouseup", this.handleMouseUp);
    }
  };

  handleMouseMove = (e: MouseEvent) => {
    if (!this.#textFieldPosition) return;
    const currentIndex = this.#getCharIndexFromMouseEvent(e);
    const start = Math.min(this.#selectionStart, currentIndex);
    const end = Math.max(this.#selectionStart, currentIndex);

    this.#nativeInput.setSelection(start, end);
    this.#setSelection(start, end);
    this.setState(() => this.#scrollToCaret(currentIndex));
    this.#updateController();
  };

  handleMouseUp = () => {
    this.#textFieldPosition = null;
    if (browser) {
      document.removeEventListener("mousemove", this.handleMouseMove);
      document.removeEventListener("mouseup", this.handleMouseUp);
    }
  };

  override build() {
    const decoration = this.widget.inputDecoration;
    const editable = GestureDetector({
      onMouseDown: this.handleMouseDown,
      cursor: "text",
      child: this.#buildEditingArea(),
    });
    const content =
      decoration?.prefixIcon || decoration?.suffixIcon
        ? Row({
            children: [
              ...(decoration.prefixIcon
                ? [decoration.prefixIcon, SizedBox({ width: 8 })]
                : []),
              Expanded({ child: editable }),
              ...(decoration.suffixIcon
                ? [SizedBox({ width: 8 }), decoration.suffixIcon]
                : []),
            ],
          })
        : editable;
    return Container({
      width: this.widget.width,
      padding: this.widget.padding,
      decoration: !this.#focused
        ? this.widget.decoration
        : this.widget.decoration!.copyWith({
            border: this.widget.focusedBorder,
          }),
      child: decoration?.labelText
        ? Column({
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(decoration.labelText, {
                style:
                  decoration.labelStyle ??
                  new TextStyle({ fontSize: 12, color: "#555555" }),
              }),
              SizedBox({ height: 4 }),
              content,
            ],
          })
        : content,
    });
  }

  #buildEditingArea() {
    const lineHeight =
      (this.widget.style.fontSize ?? 16) * (this.widget.style.height ?? 1.2);
    return SizedBox({
      height: Math.max(
        this.widget.height ?? 20,
        lineHeight * (this.widget.maxLines ?? 1),
      ),
      child: ClipRect({
        key: this.#viewportKey,
        clipper: size =>
          Rect.fromLTWH({
            left: 0,
            top: 0,
            width: size.width,
            height: size.height,
          }),
        child: Transform.translate({
          offset: new Offset({ x: -this.#scrollX, y: -this.#scrollY }),
          child: this.#buildEditableContents(),
        }),
      }),
    });
  }

  #buildEditableContents() {
    return Stack({
      clipped: false,
      children: [
        Container({
          child: ConstraintsTransformBox({
            alignment: Alignment.topLeft,
            constraintsTransform: constraints => {
              if (
                this.#lastViewportWidth !== constraints.maxWidth ||
                this.#lastViewportHeight !== constraints.maxHeight
              ) {
                this.#lastViewportWidth = constraints.maxWidth;
                this.#lastViewportHeight = constraints.maxHeight;
                this.#afterLayout(() => this.#refreshViewport());
              }
              return new Constraints({
                minHeight: constraints.minHeight,
                minWidth: constraints.minWidth,
                maxHeight: Infinity,
                maxWidth:
                  this.widget.maxLines === 1 ? Infinity : constraints.maxWidth,
              });
            },
            child: RichText({
              key: this.#textKey,
              text: undefined as unknown as TextSpan,
              textPainter: this.#textPainter,
              softWrap: this.widget.maxLines !== 1,
            }),
          }),
        }),

        ...(this.value === "" && this.widget.inputDecoration?.hintText
          ? [
              Positioned({
                left: 0,
                top: 0,
                child: Text(this.widget.inputDecoration.hintText, {
                  style:
                    this.widget.inputDecoration.hintStyle ??
                    this.widget.style.copyWidth({ color: "#777777" }),
                }),
              }),
            ]
          : []),

        /**
         * selection
         */
        ...(this.#selectionUI?.map(segment =>
          Positioned({
            top: segment.y,
            left: segment.start,
            child: Container({
              width: segment.end - segment.start,
              height: segment.height,
              color: "rgba(0, 0, 255, 0.3)",
            }),
          }),
        ) ?? []),

        /**
         * caret
         */
        this.#currentCharUI
          ? Positioned({
              top: this.#currentCharUI.rect.top,
              left: this.#currentCharUI.rect.right,
              child: new Caret({
                width: 1,
                height: this.#currentCharUI.rect.height,
                color: this.#currentCharUI.color,
                isTyping: this.#isTyping,
              }),
            })
          : SizedBox.shrink(),

        /**
         * composing
         */
        this.#currentCharUI && this.#isComposing
          ? Positioned({
              top: this.#currentCharUI.rect.bottom,
              left: this.#currentCharUI.rect.left + 1,
              child: Container({
                width: this.#currentCharUI.rect.width - 1,
                height: 2,
                color: "rgba(0, 0, 255, 0.8)",
              }),
            })
          : SizedBox.shrink(),
      ],
    });
  }
}

class Caret extends StatefulWidget {
  width: number;
  height: number;
  color: string;
  isTyping: boolean;
  constructor({
    width,
    height,
    color,
    isTyping,
  }: {
    width: number;
    height: number;
    color: string;
    isTyping: boolean;
  }) {
    super();
    this.width = width;
    this.height = height;
    this.color = color;
    this.isTyping = isTyping;
  }

  override createState(): State<StatefulWidget> {
    return new CaretState();
  }
}

class CaretState extends State<Caret> {
  visible = true;
  interval?: ReturnType<typeof setInterval>;

  initState(): void {
    this.startBlinking();
  }

  didUpdateWidget(oldWidget: Caret): void {
    if (this.widget.isTyping !== oldWidget.isTyping) {
      if (this.widget.isTyping) {
        this.stopBlinking();
        this.setState(() => {
          this.visible = true;
        });
      } else {
        this.startBlinking();
      }
    }
  }

  startBlinking(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      this.setState(() => {
        this.visible = !this.visible;
      });
    }, 500);
  }

  stopBlinking(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  dispose(): void {
    this.stopBlinking();
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

type InputEventType = {
  input: { value: string };
  compositionstart: undefined;
  compositionend: undefined;
  keydown: {
    key: string;
    ctrlKey: boolean;
    shiftKey: boolean;
    isComposing: boolean;
  };
  selection: undefined;
  focus: undefined;
  blur: undefined;
};
/**
 * @description This class serves as an abstraction layer to handle browser-specific implementations,
 * ensuring compatibility across different environments.
 * example) chrome: composingstart, composingend does not work
 */
class NativeInput {
  #multiline = false;
  #isComposing: boolean = false;
  #element: HTMLTextAreaElement | null = null;
  #listeners: Partial<{
    [K in keyof InputEventType]: ((event: InputEventType[K]) => void)[];
  }> = {};
  private get element(): HTMLTextAreaElement {
    assert(!this.#disposed, "invalid access. because native input is disposed");

    if (this.#element == null) {
      if (browser) {
        this.#element = this.#createElement();
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

  #createElement() {
    const el = document.createElement("textarea");
    el.setAttribute(
      "style",
      "position: fixed; left: 0; top: 0; opacity: 0; height: 1px; width: 1px; padding: 0; border: 0; pointer-events: none;",
    );

    el.addEventListener("input", ((e: InputEvent) => {
      if (!this.#multiline && /[\r\n]/.test(el.value)) {
        const before = el.value;
        const start = before
          .slice(0, el.selectionStart)
          .replace(/[\r\n]+/g, " ").length;
        const end = before
          .slice(0, el.selectionEnd)
          .replace(/[\r\n]+/g, " ").length;
        el.value = before.replace(/[\r\n]+/g, " ");
        el.setSelectionRange(start, end);
      }
      this.#dispatch("input", { value: this.value });

      /**
       * Even if you type a space, it seems that composing is not canceled.
       */
      if (e.isComposing && this.value[this.value.length - 1] === " ") {
        this.#setComposing(false);
        return;
      }

      this.#setComposing(e.isComposing);
    }) as EventListener);

    el.addEventListener("keydown", (e: KeyboardEvent) => {
      if (
        e.key === "Enter" &&
        !e.isComposing &&
        !this.#isComposing &&
        !this.#multiline
      ) {
        e.preventDefault();
      }

      this.#dispatch("keydown", {
        key: e.key,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        isComposing: e.isComposing || this.#isComposing,
      });
    });

    el.addEventListener("compositionstart", () => this.#setComposing(true));
    el.addEventListener("compositionend", () => {
      this.#setComposing(false);
      this.#dispatch("input", { value: this.value });
    });
    el.addEventListener("select", () => this.#dispatch("selection", undefined));
    el.addEventListener("keyup", () => this.#dispatch("selection", undefined));

    el.addEventListener("focus", () => {
      this.#dispatch("focus", undefined);
    });

    el.addEventListener("blur", () => {
      this.#dispatch("blur", undefined);
    });

    return el;
  }

  configure(widget: TextField) {
    this.#multiline = widget.maxLines !== 1;
    if (!browser) return;
    this.element.setAttribute(
      "aria-label",
      widget.ariaLabel ??
        widget.inputDecoration?.labelText ??
        widget.inputDecoration?.hintText ??
        "Text input",
    );
    this.element.setAttribute("aria-multiline", String(this.#multiline));
    this.element.setAttribute("autocomplete", "off");
    this.element.setAttribute("data-flitter-text-input", "");
  }

  #setComposing(isComposing: boolean) {
    if (this.#isComposing === isComposing) return;
    this.#isComposing = isComposing;
    if (isComposing) {
      this.#dispatch("compositionstart", undefined);
    } else {
      this.#dispatch("compositionend", undefined);
    }
  }

  #disposed = false;
  dispose = () => {
    this.#element?.remove();
    this.#element = null;
    this.#disposed = true;
    this.#listeners = {};
  };

  set value(newValue: string) {
    if (this.element.value !== newValue) this.element.value = newValue;
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

  get activeSelectionOffset(): number {
    return this.element.selectionDirection === "backward"
      ? this.element.selectionStart
      : this.element.selectionEnd;
  }

  position(x: number, y: number, height: number) {
    if (!browser) return;
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
    this.element.style.height = `${height}px`;
  }

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

  addEventListener<K extends keyof InputEventType>(
    type: K,
    listener: (event: InputEventType[K]) => void,
  ) {
    if (!this.#listeners[type]) {
      this.#listeners[type] = [];
    }
    this.#listeners[type]!.push(listener);
  }

  #dispatch<K extends keyof InputEventType>(type: K, event: InputEventType[K]) {
    this.#listeners[type]?.forEach(listener => listener(event));
  }

  removeEventListener = (
    ...args: Parameters<HTMLTextAreaElement["removeEventListener"]>
  ) => {
    assert(false, "not implemented removeEventListener on native input" + args);
  };
}

export default classToFunction(TextField);
