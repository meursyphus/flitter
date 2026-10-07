import {
	AppRunner,
	EdgeInsets,
	NeverScrollableScrollPhysics,
	Container,
	GestureDetector,
	ListView,
	Positioned,
	ScrollController,
	Stack,
	State,
	StatefulWidget,
	type Widget
} from 'flitter-core';
const params = new URLSearchParams(location.search);
const renderer = params.get('renderer') ?? 'svg';
const horizontal = params.has('horizontal');
const variable = params.has('variable');
const view =
	renderer === 'svg'
		? document.createElementNS('http://www.w3.org/2000/svg', 'svg')
		: document.createElement('canvas');
view.id = 'view';
document.body.append(view);
const controller = new ScrollController();
const stats = {
	built: [] as number[],
	mounts: 0,
	disposals: 0,
	clicks: [] as number[],
	activations: 0,
	dragStarts: 0
};
class RowWidget extends StatefulWidget {
	constructor(readonly index: number) {
		super(index);
	}
	createState() {
		return new RowState();
	}
}
class RowState extends State<RowWidget> {
	selected = false;
	override initState() {
		stats.mounts++;
	}
	override dispose() {
		stats.disposals++;
	}
	override activate() {
		stats.activations++;
	}
	build(): Widget {
		const extent = variable ? (this.widget.index % 2 === 0 ? 10 : 30) : 20;
		return GestureDetector({
			onDragStart: () => {
				stats.dragStarts++;
			},
			onClick: () => {
				stats.clicks.push(this.widget.index);
				this.setState(() => (this.selected = !this.selected));
			},
			child: Container({
				width: horizontal ? extent : undefined,
				height: horizontal ? undefined : extent,
				color: this.selected ? '#00ff00' : this.widget.index % 2 === 0 ? '#ff0000' : '#0000ff'
			})
		});
	}
}
const runner = new AppRunner({ view, ssrSize: { width: 260, height: 180 } });
runner.runApp(
	Stack({
		children: [
			Container({ width: 260, height: 180, color: '#ffffff' }),
			Positioned({
				left: 20,
				top: 20,
				width: 200,
				height: 100,
				child: ListView.builder({
					reverse: params.has('reverse'),
					padding: params.has('padded')
						? EdgeInsets.only({ top: 10, bottom: 30, left: 10, right: 30 })
						: undefined,
					physics: params.has('disabled') ? new NeverScrollableScrollPhysics() : undefined,
					controller,
					itemCount: 10000,
					itemExtent: variable ? undefined : 20,
					scrollDirection: horizontal ? 'horizontal' : 'vertical',
					cacheExtent: 20,
					keepAliveCount: 20,
					itemBuilder: (index) => {
						stats.built.push(index);
						return new RowWidget(index);
					}
				})
			})
		]
	})
);
const settle = async () => {
	for (let i = 0; i < 3; i++) await new Promise(requestAnimationFrame);
};
const pixel = async (x: number, y: number) => {
	if (view instanceof HTMLCanvasElement) {
		const dpr = window.devicePixelRatio;
		return [...view.getContext('2d')!.getImageData(x * dpr, y * dpr, 1, 1).data];
	}
	const image = new Image();
	image.src = URL.createObjectURL(
		new Blob([new XMLSerializer().serializeToString(view)], { type: 'image/svg+xml' })
	);
	await image.decode();
	const canvas = document.createElement('canvas');
	canvas.width = 260;
	canvas.height = 180;
	const context = canvas.getContext('2d')!;
	context.drawImage(image, 0, 0, 260, 180);
	URL.revokeObjectURL(image.src);
	return [...context.getImageData(x, y, 1, 1).data];
};
(window as any).sliverTest = {
	stats,
	controller,
	settle,
	pixel,
	dispose: () => {
		runner.dispose();
		controller.dispose();
	}
};
