import { ChangeNotifier } from "flitter-core";
import type {
	NetworkChartCustom,
	NetworkChartData,
	NetworkLayout,
	NetworkNodeLayout,
} from "./types";

function clamp(value: number): number {
	return Math.max(0.05, Math.min(0.95, value));
}

function computeLayout(data: NetworkChartData): NetworkLayout {
	const positions = new Map<string, NetworkNodeLayout>();

	data.nodes.forEach((node, index) => {
		const angle = (index / Math.max(data.nodes.length, 1)) * Math.PI * 2;
		positions.set(node.id, {
			...node,
			index,
			x: 0.5 + Math.cos(angle) * 0.25,
			y: 0.5 + Math.sin(angle) * 0.25,
		});
	});

	for (let iteration = 0; iteration < 60; iteration++) {
		const displacements = new Map<string, { x: number; y: number }>();

		data.nodes.forEach((node) => {
			displacements.set(node.id, { x: 0, y: 0 });
		});

		for (let i = 0; i < data.nodes.length; i++) {
			for (let j = i + 1; j < data.nodes.length; j++) {
				const a = positions.get(data.nodes[i].id)!;
				const b = positions.get(data.nodes[j].id)!;
				const dx = a.x - b.x;
				const dy = a.y - b.y;
				const distance = Math.sqrt(dx * dx + dy * dy) || 0.001;
				const force = 0.002 / distance;
				displacements.get(a.id)!.x += (dx / distance) * force;
				displacements.get(a.id)!.y += (dy / distance) * force;
				displacements.get(b.id)!.x -= (dx / distance) * force;
				displacements.get(b.id)!.y -= (dy / distance) * force;
			}
		}

		data.edges.forEach((edge) => {
			const source = positions.get(edge.source)!;
			const target = positions.get(edge.target)!;
			const dx = target.x - source.x;
			const dy = target.y - source.y;
			const distance = Math.sqrt(dx * dx + dy * dy) || 0.001;
			const force = (distance - 0.18) * 0.03;
			displacements.get(source.id)!.x += dx * force;
			displacements.get(source.id)!.y += dy * force;
			displacements.get(target.id)!.x -= dx * force;
			displacements.get(target.id)!.y -= dy * force;
		});

		data.nodes.forEach((node) => {
			const position = positions.get(node.id)!;
			const displacement = displacements.get(node.id)!;
			position.x = clamp(position.x + displacement.x + (0.5 - position.x) * 0.01);
			position.y = clamp(position.y + displacement.y + (0.5 - position.y) * 0.01);
		});
	}

	return {
		nodes: data.nodes.map((node) => positions.get(node.id)!),
		edges: data.edges.map((edge, index) => {
			const source = positions.get(edge.source)!;
			const target = positions.get(edge.target)!;
			return {
				...edge,
				x1: source.x,
				y1: source.y,
				x2: target.x,
				y2: target.y,
				index,
			};
		}),
	};
}

export class NetworkChartController extends ChangeNotifier {
	#rawData: NetworkChartData;
	#layout: NetworkLayout;
	#width = 0;
	#height = 0;

	custom!: NetworkChartCustom<any>;
	config: any;

	constructor({
		data,
		custom,
		config = {},
	}: {
		data: NetworkChartData;
		custom: NetworkChartCustom<any>;
		config?: any;
	}) {
		super();
		this.#rawData = data;
		this.#layout = computeLayout(data);
		this.custom = custom;
		this.config = config;
	}

	#recalculate(): void {
		this.#layout = computeLayout(this.#rawData);
	}

	set data(value: NetworkChartData) {
		this.#rawData = value;
		this.#recalculate();
		this.notifyListeners();
	}

	get data(): NetworkChartData {
		return this.#rawData;
	}

	get layout(): NetworkLayout {
		return this.#layout;
	}

	get groups(): string[] {
		return Array.from(
			new Set(
				this.#rawData.nodes
					.map((node) => node.group)
					.filter((group): group is string => !!group),
			),
		);
	}

	get width(): number {
		return this.#width;
	}

	get height(): number {
		return this.#height;
	}

	setSize(width: number, height: number): void {
		if (this.#width === width && this.#height === height) return;
		this.#width = width;
		this.#height = height;
		this.#recalculate();
		this.notifyListeners();
	}
}
