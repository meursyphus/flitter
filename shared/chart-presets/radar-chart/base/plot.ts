import {
	Constraints,
	MultiChildRenderObject,
	MultiChildRenderObjectWidget,
	Offset,
	Size,
	Stack,
	StackFit,
	type Widget,
} from "flitter-ui";
import type { RadarChartCustom } from "flitter-ui/chart";

const EPSILON = 0.0001;
const CONTENT_CHILD_OFFSET = 1;

class RadarPlotLayout extends MultiChildRenderObjectWidget {
	angles: number[];
	gap: number;

	constructor({
		content,
		angularItems,
		gap,
		key,
	}: {
		content: Widget;
		angularItems: Parameters<RadarChartCustom["plot"]>[0]["angularItems"];
		gap: number;
		key?: unknown;
	}) {
		super({
			key,
			children: [content, ...angularItems.map((item) => item.label)],
		});
		this.angles = angularItems.map((item) => item.angle);
		this.gap = gap;
	}

	override createRenderObject(): RenderRadarPlotLayout {
		return new RenderRadarPlotLayout({
			angles: this.angles,
			gap: this.gap,
		});
	}

	override updateRenderObject(renderObject: RenderRadarPlotLayout): void {
		renderObject.angles = this.angles;
		renderObject.gap = this.gap;
	}
}

class RenderRadarPlotLayout extends MultiChildRenderObject {
	#angles: number[];
	#gap: number;

	constructor({ angles, gap }: { angles: number[]; gap: number }) {
		super({ isPainter: false });
		this.#angles = angles;
		this.#gap = gap;
	}

	get angles(): number[] {
		return this.#angles;
	}

	set angles(value: number[]) {
		if (
			value.length === this.#angles.length &&
			value.every((angle, index) => angle === this.#angles[index])
		) {
			return;
		}

		this.#angles = value;
		this.markNeedsLayout();
	}

	get gap(): number {
		return this.#gap;
	}

	set gap(value: number) {
		if (value === this.#gap) return;
		this.#gap = value;
		this.markNeedsLayout();
	}

	protected preformLayout(): void {
		this.size = this.constraints.constrain(Size.infinite);

		const width = Number.isFinite(this.size.width) ? this.size.width : 0;
		const height = Number.isFinite(this.size.height) ? this.size.height : 0;
		const plotSize = new Size({ width, height });

		if (this.children.length === 0) {
			this.size = this.constraints.constrain(Size.zero);
			return;
		}

		const content = this.children[0];
		const looseConstraints = new Constraints({
			maxWidth: width,
			maxHeight: height,
		});

		for (let index = 0; index < this.#angles.length; index += 1) {
			this.labelChild(index)?.layout(looseConstraints);
		}

		const radius = this.resolveRadius(plotSize);
		const diameter = Math.max(0, radius * 2);
		const contentSize = new Size({ width: diameter, height: diameter });

		content.layout(Constraints.tight(contentSize));
		content.offset = new Offset({
			x: (width - diameter) / 2,
			y: (height - diameter) / 2,
		});

		this.positionAngularLabels(plotSize, radius);
	}

	override getIntrinsicWidth(height: number): number {
		return this.children.reduce(
			(maxWidth, child) => Math.max(maxWidth, child.getIntrinsicWidth(height)),
			0,
		);
	}

	override getIntrinsicHeight(width: number): number {
		return this.children.reduce(
			(maxHeight, child) => Math.max(maxHeight, child.getIntrinsicHeight(width)),
			0,
		);
	}

	private labelChild(index: number) {
		return this.children[CONTENT_CHILD_OFFSET + index];
	}

	private resolveRadius(plotSize: Size): number {
		let min = 0;
		let max = Math.max(0, Math.min(plotSize.width, plotSize.height) / 2);

		for (let step = 0; step < 24; step += 1) {
			const candidate = (min + max) / 2;
			if (this.fits(plotSize, candidate)) {
				min = candidate;
			} else {
				max = candidate;
			}
		}

		return min;
	}

	private fits(plotSize: Size, radius: number): boolean {
		const centerX = plotSize.width / 2;
		const centerY = plotSize.height / 2;

		for (let index = 0; index < this.#angles.length; index += 1) {
			const label = this.labelChild(index);
			if (label == null) continue;

			const angle = this.#angles[index] ?? 0;
			const dx = Math.cos(angle);
			const dy = Math.sin(angle);
			const anchorX = centerX + (radius + this.#gap) * dx;
			const anchorY = centerY + (radius + this.#gap) * dy;
			const rect = this.resolveLabelRect(label.size, anchorX, anchorY, dx, dy);
			if (!this.isInside(plotSize, rect)) return false;
		}

		return true;
	}

	private positionAngularLabels(plotSize: Size, radius: number): void {
		const centerX = plotSize.width / 2;
		const centerY = plotSize.height / 2;

		for (let index = 0; index < this.#angles.length; index += 1) {
			const label = this.labelChild(index);
			if (label == null) continue;

			const angle = this.#angles[index] ?? 0;
			const dx = Math.cos(angle);
			const dy = Math.sin(angle);
			const anchorX = centerX + (radius + this.#gap) * dx;
			const anchorY = centerY + (radius + this.#gap) * dy;
			const rect = this.resolveLabelRect(label.size, anchorX, anchorY, dx, dy);

			label.offset = new Offset({
				x: rect.left,
				y: rect.top,
			});
		}
	}

	private resolveLabelRect(
		size: Size,
		anchorX: number,
		anchorY: number,
		dx: number,
		dy: number,
	) {
		const left = Math.abs(dx) <= EPSILON
			? anchorX - size.width / 2
			: dx > 0
				? anchorX
				: anchorX - size.width;
		const top = Math.abs(dy) <= EPSILON
			? anchorY - size.height / 2
			: dy > 0
				? anchorY
				: anchorY - size.height;

		return {
			left,
			top,
			right: left + size.width,
			bottom: top + size.height,
		};
	}

	private isInside(
		plotSize: Size,
		rect: { left: number; top: number; right: number; bottom: number },
	): boolean {
		return (
			rect.left >= -EPSILON &&
			rect.top >= -EPSILON &&
			rect.right <= plotSize.width + EPSILON &&
			rect.bottom <= plotSize.height + EPSILON
		);
	}
}

export function Plot<TConfig extends object = object>(
	{
		dataView,
		tooltipArea,
		web,
		radialAxis,
		angularItems,
		gap = 0,
	}: Parameters<RadarChartCustom<TConfig>["plot"]>[0] & { gap?: number },
): Widget {
	return new RadarPlotLayout({
		angularItems,
		gap: Math.max(0, gap),
		content: Stack({
			fit: StackFit.expand,
			clipped: false,
			children: [web, dataView, radialAxis, tooltipArea],
		}),
	});
}
