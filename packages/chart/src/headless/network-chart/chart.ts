import {
	StatelessWidget,
	type Widget,
	type BuildContext,
	LayoutBuilder,
} from "flitter-core";
import { NetworkChartProvider } from "./provider";

class Chart extends StatelessWidget {
	override build(_: BuildContext): Widget {
		return new SizeTracker();
	}
}

class SizeTracker extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = NetworkChartProvider.of(context);
		return LayoutBuilder({
			builder: (_ctx, constraints) => {
				ctx.setSize(constraints.maxWidth, constraints.maxHeight);
				return new Layout();
			},
		});
	}
}

export default Chart;

class Layout extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = NetworkChartProvider.of(context);
		return ctx.custom.layout(
			{
				title: new Title(),
				legends: ctx.groups.map((name, index) => new Legend({ name, index })),
				network: new NetworkWidget(),
			},
			ctx,
		);
	}
}

class Title extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = NetworkChartProvider.of(context);
		return ctx.custom.title(undefined, ctx);
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
		const ctx = NetworkChartProvider.of(context);
		return ctx.custom.legend({ name: this.#name, index: this.#index }, ctx);
	}
}

class NetworkWidget extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = NetworkChartProvider.of(context);
		return ctx.custom.network(
			{
				nodes: ctx.layout.nodes.map((node) => new NodeWidget({ index: node.index })),
				edges: ctx.layout.edges.map((edge) => new EdgeWidget({ index: edge.index })),
				nodeLabels: ctx.layout.nodes.map(
					(node) => new NodeLabelWidget({ index: node.index }),
				),
			},
			ctx,
		);
	}
}

class NodeWidget extends StatelessWidget {
	#index: number;

	constructor({ index }: { index: number }) {
		super();
		this.#index = index;
	}

	override build(context: BuildContext): Widget {
		const ctx = NetworkChartProvider.of(context);
		const node = ctx.layout.nodes[this.#index];
		return ctx.custom.node(
			{
				id: node.id,
				label: node.label ?? node.id,
				x: node.x,
				y: node.y,
				size: node.size ?? 1,
				group: node.group,
				index: node.index,
			},
			ctx,
		);
	}
}

class EdgeWidget extends StatelessWidget {
	#index: number;

	constructor({ index }: { index: number }) {
		super();
		this.#index = index;
	}

	override build(context: BuildContext): Widget {
		const ctx = NetworkChartProvider.of(context);
		const edge = ctx.layout.edges[this.#index];
		return ctx.custom.edge(
			{
				source: edge.source,
				target: edge.target,
				x1: edge.x1,
				y1: edge.y1,
				x2: edge.x2,
				y2: edge.y2,
				weight: edge.weight,
				index: edge.index,
			},
			ctx,
		);
	}
}

class NodeLabelWidget extends StatelessWidget {
	#index: number;

	constructor({ index }: { index: number }) {
		super();
		this.#index = index;
	}

	override build(context: BuildContext): Widget {
		const ctx = NetworkChartProvider.of(context);
		const node = ctx.layout.nodes[this.#index];
		return ctx.custom.nodeLabel(
			{
				label: node.label ?? node.id,
				x: node.x,
				y: node.y,
				index: node.index,
			},
			ctx,
		);
	}
}
