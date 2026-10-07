import type RenderObject from '../../../../packages/core/src/renderobject/RenderObject';
import {
	AppRunner,
	Column,
	Container,
	EdgeInsets,
	FocusNode,
	GlobalKey,
	InputDecoration,
	MainAxisSize,
	State,
	StatefulWidget,
	Text,
	TextEditingController,
	TextField,
	TextStyle,
	type Widget
} from 'flitter-core';

export function mountTextFieldBench(host: HTMLElement, renderer: 'svg' | 'canvas') {
	const view =
		renderer === 'svg'
			? document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			: document.createElement('canvas');
	view.setAttribute('width', '480');
	view.setAttribute('height', '240');
	host.appendChild(view);
	const runner = new AppRunner({ view, ssrSize: { width: 480, height: 240 } });
	const controller = new TextEditingController('Hello');
	const focusNode = new FocusNode();
	const ownedControllers = [controller];
	const ownedFocusNodes = [focusNode];
	const fieldKey = new GlobalKey();
	const changes: string[] = [];
	const submitted: string[] = [];
	let state: SceneState;

	class Scene extends StatefulWidget {
		createState() {
			state = new SceneState();
			return state;
		}
	}
	class SceneState extends State<Scene> {
		controlled = true;
		activeController = controller;
		activeFocusNode = focusNode;
		mounted = true;
		multiline = false;
		revision = 0;
		build(): Widget {
			return Container({
				width: 480,
				height: 240,
				color: '#ffffff',
				padding: EdgeInsets.all(16),
				child: Column({
					mainAxisSize: MainAxisSize.min,
					children: [
						this.mounted
							? TextField('', {
									key: fieldKey,
									controller: this.controlled ? this.activeController : undefined,
									focusNode: this.activeFocusNode,
									ariaLabel: 'Message',
									maxLines: this.multiline ? 4 : 1,
									width: 400,
									style: new TextStyle({ fontSize: 18, fontFamily: 'sans-serif' }),
									decoration: new InputDecoration({
										labelText: 'Message',
										hintText: 'Write a message',
										prefixIcon: Text('>'),
										suffixIcon: Text('*'),
										contentPadding: EdgeInsets.all(8)
									}),
									onChanged: (value) => changes.push(value),
									onSubmitted: (value) => submitted.push(value)
								})
							: Text('Removed')
					]
				})
			});
		}
	}
	runner.runApp(new Scene());
	const api = {
		controller,
		focusNode,
		changes,
		submitted,
		get activeController() {
			return state.activeController;
		},
		get activeFocusNode() {
			return state.activeFocusNode;
		},
		replaceHandles() {
			const replacement = new TextEditingController('Replacement');
			const replacementFocus = new FocusNode();
			ownedControllers.push(replacement);
			ownedFocusNodes.push(replacementFocus);
			state.setState(() => {
				state.activeController = replacement;
				state.activeFocusNode = replacementFocus;
			});
		},
		get viewportBounds() {
			const findViewport = (render: RenderObject): RenderObject | undefined => {
				if ('clipped' in render && render.clipped === true) return render;
				for (const child of render.children) {
					const found = findViewport(child);
					if (found) return found;
				}
			};
			const viewport = findViewport(fieldKey.currentContext.renderObject)!;
			const origin = viewport.localToGlobal();
			const bounds = view.getBoundingClientRect();
			return {
				x: origin.x + bounds.x,
				y: origin.y + bounds.y,
				width: viewport.size.width,
				height: viewport.size.height
			};
		},
		get renderedText() {
			return (fieldKey.currentContext as any).state.value;
		},
		get paintedText() {
			const field = (fieldKey.currentContext as any).state;
			return field.paragraphLines
				?.flatMap((line: any) => line.spanBoxes.map((box: any) => box.content))
				.join('');
		},
		async configure(options: { controlled?: boolean; mounted?: boolean; multiline?: boolean }) {
			state.setState(() => Object.assign(state, options));
			await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
		},
		rerender() {
			state.setState(() => {
				state.revision++;
			});
		},
		dispose() {
			runner.dispose();
			ownedControllers.forEach((controller) => controller.dispose());
			ownedFocusNodes.forEach((focusNode) => focusNode.dispose());
			host.replaceChildren();
		}
	};
	return api;
}
export type TextFieldBench = ReturnType<typeof mountTextFieldBench>;
