import {
	AppRunner,
	CanvasPainter,
	Column,
	Container,
	EdgeInsets,
	GestureDetector,
	MainAxisSize,
	Offset,
	Opacity,
	RepaintBoundary,
	Row,
	State,
	StatefulWidget,
	Text,
	TextStyle,
	Transform,
	ClipRect,
	Rect,
	Stack,
	ZIndex,
	CustomPaint,
	Size,
	RenderObject,
	TextPainter,
	TextSpan,
	BoxDecoration,
	BoxShadow,
	type Widget
} from 'flitter-core';

export const engineScenarios = [
	'identity',
	'paint-one',
	'paint-all',
	'text',
	'resize',
	'reorder',
	'insert-remove',
	'transform',
	'opacity',
	'z-order',
	'z-stable'
] as const;
export type EngineScenario = (typeof engineScenarios)[number];

// A new widget tree every tick, stable keys, ten independently retained rows.
// Same fixture is used for timing and warm-vs-fresh pixel comparisons.
class Scene extends StatefulWidget {
	constructor(
		readonly scenario: EngineScenario,
		readonly initialTick: number,
		readonly ready: (state: SceneState) => void,
		readonly hit: (id: number) => void,
		readonly hover: (id: number) => void
	) {
		super();
	}
	createState() {
		return new SceneState();
	}
}

class SceneState extends State<Scene> {
	tick = 0;
	initState() {
		super.initState(this.element);
		this.tick = this.widget.initialTick;
		this.widget.ready(this);
	}
	step() {
		this.setState(() => {
			this.tick++;
		});
	}
	build(): Widget {
		const scenario = this.widget.scenario;
		const odd = this.tick % 2 === 1;
		if (scenario === 'z-order' || scenario === 'z-stable')
			return Stack({
				children: [
					ZIndex({
						zIndex: scenario === 'z-stable' ? this.tick + 10 : odd ? 3 : 1,
						child: Container({ width: 120, height: 120, color: '#ff0000' })
					}),
					ZIndex({ zIndex: 2, child: Container({ width: 120, height: 120, color: '#0000ff' }) })
				]
			});
		const rows = Array.from({ length: 10 }, (_, row) => {
			let ids = Array.from({ length: 10 }, (_, col) => row * 10 + col);
			if (scenario === 'reorder' && odd) ids = ids.reverse();
			if (scenario === 'insert-remove' && odd) ids.splice(4, 1);
			const cells = ids.map((id) =>
				GestureDetector({
					key: id,
					onClick: () => this.widget.hit(id),
					onMouseEnter: () => this.widget.hover(id),
					child: Container({
						width: scenario === 'resize' && odd ? 80 : 88,
						height: 48,
						padding: EdgeInsets.all(4),
						color: '#eef2f7',
						child: Text(scenario === 'text' ? `Item ${id}: ${this.tick % 10}` : `Item ${id}`, {
							style: new TextStyle({
								fontSize: 12,
								fontFamily: 'sans-serif',
								color:
									odd && (scenario === 'paint-all' || (scenario === 'paint-one' && id === 0))
										? '#c026d3'
										: '#164e63'
							})
						})
					})
				})
			);
			return RepaintBoundary({
				key: row,
				child: Row({ mainAxisSize: MainAxisSize.min, children: cells })
			});
		});
		return Container({
			padding: EdgeInsets.all(12),
			child: Transform.translate({
				offset: new Offset({ x: scenario === 'transform' && odd ? 24 : 0, y: 0 }),
				child: Opacity({
					opacity: scenario === 'opacity' && odd ? 0.35 : 1,
					child: Column({ mainAxisSize: MainAxisSize.min, children: rows })
				})
			})
		});
	}
}

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

export function mountEngineBench(
	host: HTMLElement,
	renderer: 'canvas' | 'svg',
	scenario: EngineScenario
) {
	const view =
		renderer === 'canvas'
			? document.createElement('canvas')
			: document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	view.style.width = '960px';
	view.style.height = '540px';
	host.append(view);
	const runner = new AppRunner({ view, ssrSize: { width: 960, height: 540 } });
	let state: SceneState;
	const hits: number[] = [];
	const hoverHits: number[] = [];
	let shadowBlurAtChild = -1;
	const mount = (tick = 0) =>
		runner.runApp(
			new Scene(
				scenario,
				tick,
				(s) => {
					state = s;
				},
				(id) => hits.push(id),
				(id) => hoverHits.push(id)
			),
			{ performanceTracing: true }
		);
	mount();
	return {
		hits,
		hoverHits,
		get shadowBlurAtChild() {
			return shadowBlurAtChild;
		},
		async settle() {
			await nextFrame();
			await nextFrame();
		},
		async run(frames: number) {
			for (let i = 0; i < frames; i++) {
				const before = performance.getEntriesByName('flitter:drawFrame').length;
				state.step();
				for (let attempt = 0; ; attempt++) {
					await nextFrame();
					if (performance.getEntriesByName('flitter:drawFrame').length > before) break;
					if (attempt >= 120) throw new Error(`No frame for ${scenario}`);
				}
			}
		},
		async fresh() {
			mount(state.tick);
			await nextFrame();
			await nextFrame();
		},
		// Work counts are measured separately from timings to avoid instrumentation
		// cost contaminating the performance distribution.
		async countPaints() {
			return (await this.countWork()).paints;
		},
		async countWork() {
			const counts = {
				paints: 0,
				layouts: 0,
				textMeasurements: 0,
				canvasAllocations: 0,
				structureChanges: 0
			};
			const original = CanvasPainter.prototype.paint;
			const layout = RenderObject.prototype.layout;
			const measure = CanvasRenderingContext2D.prototype.measureText;
			const createElement = document.createElement;
			const pipeline = state.element.renderObject.renderOwner;
			const beforeEpoch = pipeline.structureEpoch;
			CanvasPainter.prototype.paint = function (...args) {
				counts.paints++;
				return original.apply(this, args);
			};
			RenderObject.prototype.layout = function (...args) {
				if (this.needsLayout || !this.constraints.equals(args[0].normalize())) counts.layouts++;
				return layout.apply(this, args);
			};
			CanvasRenderingContext2D.prototype.measureText = function (text) {
				counts.textMeasurements++;
				return measure.call(this, text);
			};
			document.createElement = function (
				this: Document,
				...args: Parameters<typeof createElement>
			) {
				if (args[0] === 'canvas') counts.canvasAllocations++;
				return createElement.apply(this, args);
			} as typeof createElement;
			try {
				await this.run(1);
				counts.structureChanges = pipeline.structureEpoch - beforeEpoch;
				return counts;
			} finally {
				CanvasPainter.prototype.paint = original;
				RenderObject.prototype.layout = layout;
				CanvasRenderingContext2D.prototype.measureText = measure;
				document.createElement = createElement;
			}
		},
		async renderCase(name: string, boundary = true) {
			const retain = (child: Widget) => (boundary ? RepaintBoundary({ child }) : child);
			let child: Widget;
			if (name === 'shadow-state') {
				runner.runApp(
					Container({
						width: 120,
						height: 100,
						decoration: new BoxDecoration({
							color: 'yellow',
							boxShadow: [
								new BoxShadow({ color: 'blue', blurRadius: 10, offset: { x: -10, y: -10 } })
							]
						}),
						child: CustomPaint({
							painter: {
								canvas: {
									paint: ({ canvas }) => {
										shadowBlurAtChild = canvas.shadowBlur;
									}
								}
							}
						})
					}),
					{ performanceTracing: true }
				);
				await nextFrame();
				await nextFrame();
				return;
			}
			if (name === 'z-order') {
				child = Stack({
					children: [
						ZIndex({ zIndex: 2, child: Container({ width: 80, height: 80, color: '#ff0000' }) }),
						ZIndex({
							zIndex: 1,
							child: retain(Container({ width: 80, height: 80, color: '#0000ff' }))
						})
					]
				});
			} else {
				child = retain(Container({ width: 80, height: 80, color: '#ff0000' }));
			}
			if (name === 'custom-state') {
				child = Row({
					mainAxisSize: MainAxisSize.min,
					children: [
						CustomPaint({
							size: new Size({ width: 80, height: 80 }),
							painter: {
								canvas: {
									paint: ({ canvas }) => {
										canvas.translate(20, 0);
										canvas.globalAlpha = 0.25;
										canvas.fillStyle = '#ff0000';
										canvas.fillRect(0, 0, 20, 20);
									}
								}
							}
						}),
						Container({ width: 80, height: 80, color: '#0000ff' })
					]
				});
			} else {
				child = Transform.translate({
					offset: new Offset({ x: 30, y: 20 }),
					child: Opacity({
						opacity: name === 'hidden' ? 0 : 0.5,
						child: ClipRect({
							clipper: () => Rect.fromLTWH({ left: 0, top: 0, width: 40, height: 40 }),
							child
						})
					})
				});
			}
			runner.runApp(child, { performanceTracing: true });
			await nextFrame();
			await nextFrame();
		},
		pixels(points: [number, number][]) {
			if (!(view instanceof HTMLCanvasElement)) throw new Error('Pixel sampling requires canvas');
			const ctx = view.getContext('2d')!;
			const dpr = window.devicePixelRatio;
			return points.map(([x, y]) => [...ctx.getImageData(x * dpr, y * dpr, 1, 1).data]);
		},
		benchmarkText(words: number, iterations: number) {
			const text = new TextSpan({
				text: 'render engine '.repeat(words),
				style: new TextStyle({ fontSize: 12 })
			});
			const samples: number[] = [];
			for (let i = 0; i < iterations + 5; i++) {
				const painter = new TextPainter({ text });
				const start = performance.now();
				painter.layout({ minWidth: 1e7, maxWidth: 1e7 });
				const elapsed = performance.now() - start;
				if (i >= 5) samples.push(elapsed);
			}
			return samples;
		},
		async cycleRunners(count: number) {
			for (let i = 0; i < count; i++) {
				const other = new AppRunner({ view, ssrSize: { width: 960, height: 540 } });
				other.runApp(Container({ width: 100, height: 100, color: 'red' }), {
					performanceTracing: true
				});
				other.dispose();
			}
			performance.clearMarks();
			performance.clearMeasures();
			await nextFrame();
			await nextFrame();
			return performance.getEntriesByName('flitter:drawFrame').length;
		},
		dispose() {
			runner.dispose();
			view.remove();
		}
	};
}

export type EngineBench = ReturnType<typeof mountEngineBench>;
