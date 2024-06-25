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
	RichText
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
		} = {
			height: lines[0]?.height,
			x: 0,
			y: 0,
			color: lines[0]?.spanBoxes[0]?.color ?? 'black',
			width: 1
		};

		/**
		 * 이것도 좀 알짤딱으로 해보자
		 */
		for (const line of lines) {
			for (const char of line.spanBoxes) {
				currentLocation++;
				caret = {
					height: line.height,
					y: currentY,
					x: char.offset.x + char.size.width,
					color: char.color,
					width: 1
				};

				if (currentLocation === caretLocation) {
					break;
				}
			}
			currentY += line.height;
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

		// Binary search to find the correct line
		let low = 0;
		let high = lines.length - 1;
		let lineIndex = -1;
		let accumulatedHeight = 0;

		while (low <= high) {
			const mid = Math.floor((low + high) / 2);
			const midHeight = accumulatedHeight + lines[mid].height;

			if (y >= accumulatedHeight && y < midHeight) {
				lineIndex = mid;
				break;
			} else if (y < accumulatedHeight) {
				high = mid - 1;
			} else {
				low = mid + 1;
				accumulatedHeight = midHeight;
			}
		}

		if (lineIndex === -1) {
			// If no line is found, focus on the end
			this.focus(this.#text.length);
			return;
		}

		const line = lines[lineIndex];
		let charIndex = 0;
		let globalCharIndex = 0;

		// Calculate global char index for previous lines
		for (let i = 0; i < lineIndex; i++) {
			globalCharIndex += lines[i].spanBoxes.length;
		}

		// Find the character based on x position
		for (let i = 0; i < line.spanBoxes.length; i++) {
			const currentBox = line.spanBoxes[i];
			const nextBox = i < line.spanBoxes.length - 1 ? line.spanBoxes[i + 1] : null;

			const charMiddle = nextBox
				? (currentBox.offset.x + nextBox.offset.x) / 2
				: currentBox.offset.x + currentBox.size.width / 2;

			if (x < charMiddle) {
				break;
			}
			charIndex++;
		}

		globalCharIndex += charIndex;

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
							border: Border.all({ color: 'black', width: 1 }),
							borderRadius: BorderRadius.all(Radius.circular(4))
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
					'width: 300px; height: 150px; font-size: 20px; font-family: Roboto;'
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
