import { StatefulWidget } from "../widget";
import { State } from "../element";
import { assert, classToFunction, browser } from "../utils";
import Text from "./Text";
import Stack from "./Stack";
import GestureDetector from "./GestureDetector";
import type TextPainter from "../type/_types/text-painter";
import { TextSpan, StackFit } from "../type";
import Container from "./Container";
// import Positioned from "./Positioned";

class TextField extends StatefulWidget {
  createState(): TextFieldState {
    return new TextFieldState();
  }
}

class TextFieldState extends State<TextField> {
  #nativeInput = new NativeInput();
  #text = "";

  #selection: [number, number] = [0, 0];
  #textPainter: TextPainter;
  get #caret(): number {
    return this.#selection[0];
  }
  get paragraphLines() {
    return this.#textPainter.paragraph.lines;
  }

  // get #hasSelection() {
  //   return this.#selection[0] > 0 || this.#selection[1] > 0;
  // }

  override initState(): void {
    this.#nativeInput.addEventListener("keydown", () => {
      setTimeout(() => {
        this.#sync();
      }, 0);
    });

    this.#nativeInput.addEventListener("blur", () => {
      this.handleBlur();
    });
  }

  override dispose(): void {
    this.#nativeInput.dispose();
  }

  #sync() {
    this.setState(() => {
      this.#text = this.#nativeInput.value;
      this.#selection = this.#nativeInput.getSelection();
    });
  }

  focus = (location: number = this.#text.length) => {
    this.#nativeInput.value = this.#text;
    this.#nativeInput.focus();
    this.#selection = [location, location];
    this.#nativeInput.setCaret(location);
  };

  handleBlur = () => {
    this.#selection = [0, 0];
    this.#nativeInput.blur();
  };

  handleMouseDown = (e: MouseEvent) => {
    const root = this.element.renderObject.renderOwner.renderContext.view;
    const rootPosition = root.getBoundingClientRect();
    const position = this.element.renderObject.localToGlobal();
    const [x, y] = [
      e.clientX - rootPosition.x - position.x,
      e.clientY - rootPosition.y - position.y,
    ];

    const lines = this.#textPainter?.paragraph?.lines ?? [];

    console.log(lines[0]?.spanBoxes, x, y);
    /**
     * TODO: ..
     * 어디에 있는지 찾도록 이분탐색 조진다
     * 하지만 구현하기 너무 귀차농
     */
    /**
     * 바이너리 서치로 나중에 조지자
     */
    let location = this.#text.length;
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i];
      for (let j = line.spanBoxes.length - 1; j >= 0; j--) {
        location--;
        const offset = line.spanBoxes[j].offset;
        if (offset.x < x && offset.y < y) {
          this.focus(location);

          return;
        }
      }
    }

    this.focus();
  };

  override build() {
    return Stack({
      fit: StackFit.loose,
      children: [
        /**
         * onFocus와 onBlur 없애버리자
         */
        GestureDetector({
          onMouseDown: this.handleMouseDown,
          cursor: "text",
          child: Container({
            color: "grey",
            width: 200,
            height: 200,
            child: Text.rich(
              new TextSpan({
                children: this.#text.split("").map(
                  text =>
                    new TextSpan({
                      text,
                    }),
                ),
              }),
              {
                bindTextPainter: (textPainter: TextPainter) => {
                  this.#textPainter = textPainter;
                },
              },
            ),
          }),
        }),
      ],
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
        // this.#element.setAttribute(
        //   "style",
        //   "position: absolute; opacity: 0; height: 0; width: 0;",
        // );
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
    this.#element.remove();
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
    setTimeout(() => {
      this.element.focus({ preventScroll: true });
    }, 0);
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
