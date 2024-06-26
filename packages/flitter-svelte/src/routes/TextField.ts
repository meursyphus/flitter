/* eslint-disable @typescript-eslint/no-empty-function */
import {
	Stack,
	StackFit,
	State,
	StatefulWidget,
	TextPainter,
	Container,
	Positioned,
	GestureDetector,
	TextSpan,
	Widget,
	Opacity,
	SizedBox,
	ConstraintsTransformBox,
	Constraints,
	BoxDecoration,
	Border,
	BorderRadius,
	Radius,
	Alignment,
	TextStyle,
	TextDirection,
	TextWidthBasis,
	TextAlign,
	RichText,
	EdgeInsets,
	BorderSide
} from '@meursyphus/flitter';

const browser = true;

class TextField extends StatefulWidget {
	createState(): TextFieldState {
		return new TextFieldState();
	}
}

class TextFieldState extends State<TextField> {
	#nativeInput = new NativeInput();
	#text = '';

	#selection: [number, number] = [0, 0];
	#caret: {
		width: number;
		height: number;
		color: string;
		y: number;
		x: number;
	} | null = null;
	#textPainter = new TextPainter({
		text: new TextSpan({
			text: '',
			children: [],
			style: new TextStyle({
				fontFamily: 'Roboto',
				fontSize: 20
			})
		}),
		textDirection: TextDirection.ltr,
		textScaleFactor: 1,
		textWidthBasis: TextWidthBasis.parent,
		textAlign: TextAlign.start,
		maxLines: undefined,
		ellipsis: undefined
	});

	get paragraphLines() {
		return this.#textPainter.paragraph?.lines;
	}

	// get #hasSelection() {
	//   return this.#selection[0] > 0 || this.#selection[1] > 0;
	// }

	override initState(): void {
		this.#nativeInput.addEventListener('keydown', () => {
			setTimeout(() => {
				this.#sync();
			}, 0);
		});

		this.#nativeInput.addEventListener('blur', () => {
			this.handleBlur();
		});
	}

	override dispose(): void {
		this.#nativeInput.dispose();
	}

	/**
	 * input과 textpainter를 동기화합니다.
	 */
	#sync() {
		this.#text = this.#nativeInput.value;
		this.#textPainter = new TextPainter({
			text: new TextSpan({
				text: '',
				children: this.#text.split('').map(
					(text) =>
						new TextSpan({
							text,
							style: new TextStyle({
								fontFamily: 'Roboto',
								fontSize: 20
							})
						})
				),
				style: new TextStyle({
					fontFamily: 'Roboto',
					fontSize: 20
				})
			})
		});
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

	#setSelection(start: number, end: number = start, direction: 'ltr' | 'rtl' = 'rtl') {
		this.#selection = [start, end];
		const caretLocation = direction === 'rtl' ? end : start;
		const lines = this.#textPainter?.paragraph?.lines ?? [];

		let currentLocation = 0;
		let currentY = 0;
		let caret: {
			height: number;
			x: number;
			y: number;
			color: string;
			width: number;
		} | null = null;

		for (const line of lines) {
			if (currentLocation + line.spanBoxes.length >= caretLocation) {
				// Caret is in this line
				for (const char of line.spanBoxes) {
					if (currentLocation === caretLocation) {
						// Found the exact location
						caret = {
							height: line.height,
							y: currentY,
							x: char.offset.x,
							color: char.color,
							width: 1
						};
						break;
					}
					currentLocation++;
				}
				if (caret) break; // Exit the outer loop if caret is set
			} else {
				// Move to next line
				currentLocation += line.spanBoxes.length;
				currentY += line.height;
			}
		}

		// If we've gone through all lines and haven't set the caret,
		// it means the caretLocation is at the very end of the text
		if (!caret && lines.length > 0) {
			const lastLine = lines[lines.length - 1];
			const lastChar = lastLine.spanBoxes[lastLine.spanBoxes.length - 1];
			caret = {
				height: lastLine.height,
				y: currentY,
				x: lastChar ? lastChar.offset.x + lastChar.size.width : 0,
				color: lastChar ? lastChar.color : 'black',
				width: 1
			};
		}

		this.#caret = caret;
	}

	#render() {
		this.setState();
	}

	handleBlur = () => {
		this.#selection = [0, 0];
		//this.#caret = null;
		this.#nativeInput.blur();
		this.#focused = false;
	};
	handleMouseDown = (e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		const root = this.element.renderObject.renderOwner.renderContext.view;
		const rootPosition = root.getBoundingClientRect();
		const position = this.element.renderObject.localToGlobal();
		const [x, y] = [
			e.clientX - rootPosition.x - position.x,
			e.clientY - rootPosition.y - position.y
		];
		const lines = this.#textPainter?.paragraph?.lines ?? [];

		let globalCharIndex = 0;
		let found = false;

		for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
			const line = lines[lineIndex];
			const lineTop = line.spanBoxes[0]?.offset.y ?? 0;
			const lineBottom = lineTop + line.height;

			if (y >= lineTop && y < lineBottom) {
				// We're on the correct line
				const lineStartIndex = globalCharIndex;
				const lineEndIndex = lineStartIndex + line.spanBoxes.length;

				// Check if click is beyond the last character of the line
				if (line.spanBoxes.length > 0) {
					const lastBox = line.spanBoxes[line.spanBoxes.length - 1];
					const lineEndX = lastBox.offset.x + lastBox.size.width;

					if (x >= lineEndX) {
						globalCharIndex = lineEndIndex;
						found = true;
						break;
					}
				}

				// If not beyond the last character, find the correct position within the line
				for (let i = 0; i < line.spanBoxes.length; i++) {
					const box = line.spanBoxes[i];
					const boxMiddle = box.offset.x + box.size.width / 2;

					if (x < boxMiddle) {
						globalCharIndex = lineStartIndex + i;
						found = true;
						break;
					}
				}

				// If we haven't found a position yet, it means the click was after the middle of the last character
				// but before the end of the line
				if (!found) {
					globalCharIndex = lineEndIndex;
				}

				found = true;
				break; // We've found our line, no need to continue
			}

			globalCharIndex += line.spanBoxes.length;
		}

		if (!found) {
			// If we haven't found a position, place the caret at the end of the text
			globalCharIndex = this.#text.length;
		}

		// Set focus and selection
		this.focus(globalCharIndex);
	};

	override build() {
		return Stack({
			fit: StackFit.loose,
			clipped: false,
			children: [
				GestureDetector({
					onMouseDown: this.handleMouseDown,
					cursor: 'text',
					child: Container({
						width: 300,
						decoration: new BoxDecoration({
							border: Border.symmetric({
								horizontal: new BorderSide({ color: 'black', width: 1 })
							})
						}),
						child: ConstraintsTransformBox({
							alignment: Alignment.topLeft,
							constraintsTransform(constraints) {
								return new Constraints({
									minHeight: 100,
									minWidth: 100,
									maxHeight: constraints.maxHeight,
									maxWidth: constraints.maxWidth
								});
							},
							child: RichText({
								text: undefined as unknown as TextSpan,
								textPainter: this.#textPainter
							})
						})
					})
				}),
				this.#caret
					? Positioned({
							top: this.#caret.y,
							left: this.#caret.x,
							child: new Caret({
								width: this.#caret.width,
								height: this.#caret.height,
								color: this.#caret.color
							})
					  })
					: SizedBox.shrink()
			]
		});
	}
}

class Caret extends StatefulWidget {
	width: number;
	height: number;
	color: string;
	constructor({ width, height, color }: { width: number; height: number; color: string }) {
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
				color: this.widget.color
			})
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
		assert(!this.#disposed, 'invalid access. because native input is disposed');

		if (this.#element == null) {
			if (browser) {
				this.#element = document.createElement('textarea');
				this.#element.setAttribute(
					'style',
					'width: 300px; height: 150px; font-size: 20px; font-family: Roboto; padding-inline: 4px;'
				);
				//this.#element.setAttribute('style', 'position: absolute; opacity: 0; height: 0; width: 0;');
				document.body.appendChild(this.#element);
			} else {
				this.#element = {
					focus: () => {},
					blur: () => {},
					addEventListener: () => {},
					removeEventListener: () => {}
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
		console.log(pos, 'native pos');
		this.setSelection(pos, pos);
	};

	addEventListener = (...args: Parameters<HTMLTextAreaElement['addEventListener']>) => {
		this.element.addEventListener(...args);
	};

	removeEventListener = (...args: Parameters<HTMLTextAreaElement['removeEventListener']>) => {
		this.element.removeEventListener(...args);
	};
}

export default TextField;

function assert(...args: any) {
	//
}
