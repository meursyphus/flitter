import { State } from "../element";
import {
  Alignment,
  Border,
  BorderSide,
  BoxDecoration,
  Constraints,
  EdgeInsets,
  StackFit,
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
  style?: TextStyle;
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
        border: new Border({
          bottom: new BorderSide({ color: "black", width: 1 }),
        }),
      }),
      padding = EdgeInsets.all(0),
      width = Infinity,
      height = 20,
      focusedBorder = new Border({
        bottom: new BorderSide({ color: "blue", width: 1 }),
      }),
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

class TextFieldState extends State<TextField> {
  #nativeInput = new NativeInput();
  #text = "";

  #selection: [number, number] = [0, 0];
  #caret: {
    width: number;
    height: number;
    color: string;
    y: number;
    x: number;
  } | null = null;
  #textPainter!: TextPainter;

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
    this.#nativeInput.addEventListener("keydown", () => {
      setTimeout(() => {
        this.#syncThis();
      }, 0);
    });

    this.#nativeInput.addEventListener("blur", () => {
      this.handleBlur();
    });
  }

  override dispose(): void {
    this.#nativeInput.dispose();
  }

  #setText(text: string) {
    this.#text = text;
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
      text: "",
      style: this.widget.style,
      children: this.#text.split("").map(
        text =>
          new TextSpan({
            text,
            style: this.widget.style,
          }),
      ),
    });
  }

  /**
   * @description: syncronize: nativeInput -> this
   */
  #syncThis() {
    this.#setText(this.#nativeInput.value);
    this.#textPainter.layout();
    this.#render();
    this.element.scheduler.addPostFrameCallbacks(() => {
      this.#setSelection(...this.#nativeInput.getSelection());
      this.#render();
    });
  }

  #focused = false;
  focus = (location: number = this.#text.length) => {
    this.#nativeInput.value = this.#text;
    this.#nativeInput.focus();
    this.#setSelection(location);
    this.#nativeInput.setCaret(location);
    this.#focused = true;
    this.#render();
  };
  #render() {
    this.setState();
  }
  #setSelection(
    start: number,
    end: number = start,
    direction: "ltr" | "rtl" = "rtl",
  ) {
    this.#selection = [start, end];
    const caretLocation = direction === "rtl" ? end : start;
    const lines = this.#textPainter?.paragraph?.lines ?? [];
    if (lines.length === 0) {
      this.#caret = {
        width: 1,
        height: 20,
        color: "black",
        y: 0,
        x: 0,
      };
      return;
    }

    // Calculate accumulated character counts and heights for each line
    const accumulatedInfo = lines.reduce(
      (acc, line, index) => {
        acc.push({
          charCount: (acc[index - 1]?.charCount || 0) + line.spanBoxes.length,
          height: (acc[index - 1]?.height || 0) + line.height,
        });
        return acc;
      },
      [] as Array<{ charCount: number; height: number }>,
    );

    // Binary search to find the correct line
    let low = 0;
    let high = lines.length - 1;
    let lineIndex = -1;
    let previousChars = 0;
    let previousHeight = 0;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const lineStartChar = mid > 0 ? accumulatedInfo[mid - 1].charCount : 0;
      const lineEndChar = accumulatedInfo[mid].charCount;

      if (caretLocation > lineStartChar && caretLocation <= lineEndChar) {
        lineIndex = mid;
        previousChars = lineStartChar;
        previousHeight = mid > 0 ? accumulatedInfo[mid - 1].height : 0;
        break;
      } else if (caretLocation <= lineStartChar) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    // Handle the case when caret is at the very beginning of the text
    if (lineIndex === -1 && caretLocation === 0) {
      lineIndex = 0;
    }

    let caret: {
      height: number;
      x: number;
      y: number;
      color: string;
      width: number;
    } | null = null;

    if (lineIndex !== -1) {
      const line = lines[lineIndex];
      const charIndex = caretLocation - previousChars;

      if (charIndex === line.spanBoxes.length) {
        // Caret is at the end of the line
        const lastChar = line.spanBoxes[line.spanBoxes.length - 1];
        caret = {
          height: line.height,
          y: previousHeight,
          x: lastChar ? lastChar.offset.x + lastChar.size.width : 0,
          color: lastChar ? lastChar.color : "black",
          width: 1,
        };
      } else {
        // Caret is within the line
        const char = line.spanBoxes[charIndex];
        caret = {
          height: line.height,
          y: previousHeight,
          x: char.offset.x,
          color: char.color,
          width: 1,
        };
      }
    } else if (lines.length > 0) {
      // If caret is beyond the last character, place it at the end of the text
      const lastLine = lines[lines.length - 1];
      const lastChar = lastLine.spanBoxes[lastLine.spanBoxes.length - 1];
      caret = {
        height: lastLine.height,
        y: accumulatedInfo[accumulatedInfo.length - 1].height - lastLine.height,
        x: lastChar ? lastChar.offset.x + lastChar.size.width : 0,
        color: lastChar ? lastChar.color : "black",
        width: 1,
      };
    }

    this.#caret = caret;
    if (caret) {
      caret.x += this.widget.padding.left;
      caret.y += this.widget.padding.top;
    }
  }

  handleBlur = () => {
    this.#selection = [0, 0];
    this.#caret = null;
    this.#nativeInput.blur();
    this.#focused = false;
    this.setState();
  };

  handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const root = this.element.renderObject.renderOwner.renderContext.view;
    const rootPosition = root.getBoundingClientRect();
    const position = this.element.renderObject.localToGlobal();
    const [x, y] = [
      e.clientX - rootPosition.x - position.x - this.widget.padding.left,
      e.clientY - rootPosition.y - position.y - this.widget.padding.top,
    ];
    const lines = this.#textPainter?.paragraph?.lines ?? [];
    if (lines.length === 0) {
      this.focus(0);
      return;
    }

    // Create accumulated heights array
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

    // If lineIndex is still -1, it means the click was below the last line
    if (lineIndex === -1) {
      lineIndex = lines.length - 1;
    }

    let globalCharIndex = 0;

    // Calculate global char index for previous lines
    for (let i = 0; i < lineIndex; i++) {
      globalCharIndex += lines[i].spanBoxes.length;
    }

    const line = lines[lineIndex];

    // Binary search within the line to find the correct spanBox
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

    // If spanBoxIndex is -1, it means the click was after the last character
    if (spanBoxIndex === -1) {
      globalCharIndex += line.spanBoxes.length;
    } else {
      globalCharIndex += spanBoxIndex;
      const box = line.spanBoxes[spanBoxIndex];
      // If click is on the right half of the character, move to next character
      if (x > box.offset.x + box.size.width / 2) {
        globalCharIndex++;
      }
    }

    // Set focus and selection
    this.focus(globalCharIndex);
  };

  override build() {
    return Stack({
      fit: StackFit.loose,
      clipped: false,
      children: [
        Container({
          child: GestureDetector({
            onMouseDown: this.handleMouseDown,
            cursor: "text",
            child: Container({
              width: this.widget.width,
              padding: this.widget.padding,
              decoration: !this.#focused
                ? this.widget.decoration
                : this.widget.decoration.copyWith({
                    border: this.widget.focusedBorder,
                  }),
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
                  text: undefined as unknown as TextSpan,
                  textPainter: this.#textPainter,
                }),
              }),
            }),
          }),
        }),
        !this.#hasSelection && this.#caret
          ? Positioned({
              top: this.#caret.y,
              left: this.#caret.x,
              child: new Caret({
                width: this.#caret.width,
                height: this.#caret.height,
                color: this.#caret.color,
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
