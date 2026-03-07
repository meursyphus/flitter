import {
	StatelessWidget,
	type Widget,
	type BuildContext,
	LayoutBuilder,
} from "flitter-core";
import { TreemapChartProvider } from "./provider";

class Chart extends StatelessWidget {
	override build(_: BuildContext): Widget {
		return new SizeTracker();
	}
}

class SizeTracker extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = TreemapChartProvider.of(context);
		return LayoutBuilder({
			builder: (_ctx: BuildContext, constraints) => {
				ctx.setSize(constraints.maxWidth, constraints.maxHeight);
				return new Layout();
			},
		});
	}
}

export default Chart;

class Layout extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = TreemapChartProvider.of(context);
		return ctx.custom.layout(
			{
				title: new Title(),
				legends: ctx.legends.map(
					(name, index) => new Legend({ name, index }),
				),
				treemap: new TreemapWidget(),
			},
			ctx,
		);
	}
}

class Legend extends StatelessWidget {
	#name: string;
	#index: number;

	constructor({ name, index }: { name: string; index: number }) {
		super();
		this.#name = name;
		this.#index = index;
	}

	override build(context: BuildContext): Widget {
		const ctx = TreemapChartProvider.of(context);
		return ctx.custom.legend({ name: this.#name, index: this.#index }, ctx);
	}
}

class Title extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = TreemapChartProvider.of(context);
		return ctx.custom.title(undefined, ctx);
	}
}

class TreemapWidget extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = TreemapChartProvider.of(context);
		const { visibleData, layouts } = ctx;
		const total = visibleData.nodes.reduce((sum, n) => sum + n.value, 0);

		const nodes = visibleData.nodes.map((node, index) => {
			const layout = layouts[index];
			if (!layout) return null;
			const color = node.color ?? "";
			return new NodeWidget({
				label: node.label,
				value: node.value,
				color,
				index,
				ratio: total > 0 ? node.value / total : 0,
				x: layout.x,
				y: layout.y,
				width: layout.width,
				height: layout.height,
			});
		});

			return ctx.custom.treemap(
				{ nodes: nodes.filter((n): n is NodeWidget => n !== null) },
				ctx,
			);
	}
}

class NodeWidget extends StatelessWidget {
	#label: string;
	#value: number;
	#color: string;
	#index: number;
	#ratio: number;
	#x: number;
	#y: number;
	#width: number;
	#height: number;

	constructor(props: {
		label: string;
		value: number;
		color: string;
		index: number;
		ratio: number;
		x: number;
		y: number;
		width: number;
		height: number;
	}) {
		super();
		this.#label = props.label;
		this.#value = props.value;
		this.#color = props.color;
		this.#index = props.index;
		this.#ratio = props.ratio;
		this.#x = props.x;
		this.#y = props.y;
		this.#width = props.width;
		this.#height = props.height;
	}

	override build(context: BuildContext): Widget {
		const ctx = TreemapChartProvider.of(context);
		return ctx.custom.node(
			{
				label: this.#label,
				value: this.#value,
				color: this.#color,
				index: this.#index,
				ratio: this.#ratio,
				x: this.#x,
				y: this.#y,
				width: this.#width,
				height: this.#height,
			},
			ctx,
		);
	}
}
