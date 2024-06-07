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
	Text,
	TextSpan,
	Element,
	Widget,
	BuildContext,
	AnimationController,
	Opacity,
	SizedBox,
	ConstraintsTransformBox,
	ConstrainedBox,
	Constraints,
	DecoratedBox,
	BoxDecoration,
	Border,
	BorderRadius,
	Radius,
	Alignment,
	TextStyle
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
	#textPainter!: TextPainter;

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

	#sync() {
		this.#text = this.#nativeInput.value;
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
		console.log(this.#caret);
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
		const root = this.element.renderObject.renderOwner.renderContext.view;
		const rootPosition = root.getBoundingClientRect();
		const position = this.element.renderObject.localToGlobal();
		const [x, y] = [
			e.clientX - rootPosition.x - position.x,
			e.clientY - rootPosition.y - position.y
		];

		const lines = this.#textPainter?.paragraph?.lines ?? [];

		/**
		 * TODO: ..
		 * 어디에 있는지 찾도록 이분탐색 조진다
		 * 하지만 구현하기 너무 귀차농
		 */
		/**
		 * 바이너리 서치로 나중에 조지자
		 */
		let location = this.#text.length;
		let charY = lines.reduce((acc, line) => acc + line.height, 0);
		for (let i = lines.length - 1; i >= 0; i--) {
			const line = lines[i];
			charY -= line.height;
			if (charY > y) continue;
			for (let j = line.spanBoxes.length - 1; j >= 0; j--) {
				location--;
				const charX = line.spanBoxes[j].offset.x;
				if (charX < x) {
					this.focus(location + 1);
					return;
				}
			}
		}

		this.focus();
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
						width: 200,
						decoration: new BoxDecoration({
							border: Border.all({ color: 'black', width: 1 }),
							borderRadius: BorderRadius.all(Radius.circular(4))
						}),
						child: ConstraintsTransformBox({
							alignment: Alignment.topLeft,
							constraintsTransform(constraints) {
								return new Constraints({
									minHeight: 30,
									minWidth: 100,
									maxHeight: constraints.maxHeight,
									maxWidth: constraints.maxWidth
								});
							},
							child: Text.rich(
								new TextSpan({
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
									)
								}),
								{
									bindTextPainter: (textPainter: TextPainter) => {
										this.#textPainter = textPainter;
									}
								}
							)
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
				this.#element.setAttribute('style', 'position: absolute; opacity: 0; height: 0; width: 0;');
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
