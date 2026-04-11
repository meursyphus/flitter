import {
	GestureDetector,
	GlobalKey,
	LayoutBuilder,
	State,
	StatefulWidget,
	StatelessWidget,
	type BuildContext,
	type Widget,
} from "flitter-core";
import type { RadarChartController } from "./controller";
import { RadarChartProvider } from "./provider";
import {
	computeRadarVertices,
	getDistanceToPolygon,
	isPointInPolygon,
	radarVerticesToPoints,
} from "./geometry";
import type { HoveredRadar, HoveredRadarPoint, RadarVertex } from "./types";

class Chart extends StatelessWidget {
	override build(_: BuildContext): Widget {
		return new SizeTracker();
	}
}

class SizeTracker extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = RadarChartProvider.of(context);
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
		const ctx = RadarChartProvider.of(context);
		return ctx.custom.layout(
			{
				title: new Title(),
				legends: ctx.legends.map(
					(name, index) => new Legend({ name, index }),
				),
				plot: new Plot(),
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
		const ctx = RadarChartProvider.of(context);
		const name = this.#name;

		return GestureDetector({
			onClick: () => ctx.toggleSeries(name),
			child: ctx.custom.legend(
				{
					name,
					index: this.#index,
					isVisible: ctx.isSeriesVisible(name),
				},
				ctx,
			),
		});
	}
}

class Title extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = RadarChartProvider.of(context);
		return ctx.custom.title(undefined, ctx);
	}
}

class Plot extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = RadarChartProvider.of(context);
		const { data } = ctx;
		const axisCount = data.labels.length;
		const angleStep = axisCount > 0 ? (2 * Math.PI) / axisCount : 0;
		const startAngle = -Math.PI / 2;

		return ctx.custom.plot(
			{
				dataView: new DataView(),
				tooltipArea: new TooltipOverlay(),
				web: new Web({
					axisCount,
					levels:
						ctx.scale != null
							? Math.round((ctx.scale.max - ctx.scale.min) / ctx.scale.step)
							: 0,
				}),
				radialAxis: new RadialAxis(),
				angularItems: data.labels.map((label, index) => ({
					angle: startAngle + index * angleStep,
					label: new AngularAxisLabel({
						index,
						label,
						angle: startAngle + index * angleStep,
					}),
				})),
			},
			ctx,
		);
	}
}

class AngularAxisLabel extends StatelessWidget {
	#index: number;
	#label: string;
	#angle: number;

	constructor({ index, label, angle }: { index: number; label: string; angle: number }) {
		super();
		this.#index = index;
		this.#label = label;
		this.#angle = angle;
	}

	override build(context: BuildContext): Widget {
		const ctx = RadarChartProvider.of(context);
		return ctx.custom.angularAxisLabel(
			{ index: this.#index, label: this.#label, angle: this.#angle },
			ctx,
		);
	}
}

class Web extends StatelessWidget {
	#axisCount: number;
	#levels: number;

	constructor({ axisCount, levels }: { axisCount: number; levels: number }) {
		super();
		this.#axisCount = axisCount;
		this.#levels = levels;
	}

	override build(context: BuildContext): Widget {
		const ctx = RadarChartProvider.of(context);
		const angleStep = this.#axisCount > 0 ? (2 * Math.PI) / this.#axisCount : 0;
		const startAngle = -Math.PI / 2;

		return ctx.custom.web(
			{
				angularLines: Array.from(
					{ length: this.#levels },
					(_, index) => ({
						ratio: (index + 1) / this.#levels,
						line: new AngularLine({ axisCount: this.#axisCount }),
					}),
				),
				radialLines: Array.from(
					{ length: this.#axisCount },
					(_, index) => ({
						angle: startAngle + index * angleStep,
						line: new RadialLine(),
					}),
				),
			},
			ctx,
		);
	}
}

class AngularLine extends StatelessWidget {
	#axisCount: number;

	constructor({ axisCount }: { axisCount: number }) {
		super();
		this.#axisCount = axisCount;
	}

	override build(context: BuildContext): Widget {
		const ctx = RadarChartProvider.of(context);
		return ctx.custom.angularLine({ axisCount: this.#axisCount }, ctx);
	}
}

class RadialLine extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = RadarChartProvider.of(context);
		return ctx.custom.radialLine(undefined, ctx);
	}
}

class RadialAxis extends StatelessWidget {
	override build(context: BuildContext): Widget {
		const ctx = RadarChartProvider.of(context);
		const { data, scale } = ctx;
		const axisCount = data.labels.length;
		const levels = scale != null ? Math.round((scale.max - scale.min) / scale.step) : 0;

		const items = [];
		if (scale != null) {
			for (let index = 0; index <= levels; index += 1) {
				const value = scale.min + scale.step * index;
				const ratio = scale.max > 0 ? value / scale.max : 0;
				items.push({
					ratio,
					value,
					label: new RadialAxisLabel({ value, index, ratio }),
				});
			}
		}

		return ctx.custom.radialAxis(
			{
				labels: items,
			},
			ctx,
		);
	}
}

class RadialAxisLabel extends StatelessWidget {
	#value: number;
	#index: number;
	#ratio: number;

	constructor({ value, index, ratio }: { value: number; index: number; ratio: number }) {
		super();
		this.#value = value;
		this.#index = index;
		this.#ratio = ratio;
	}

	override build(context: BuildContext): Widget {
		const ctx = RadarChartProvider.of(context);
		return ctx.custom.radialAxisLabel(
			{ value: this.#value, index: this.#index, ratio: this.#ratio },
			ctx,
		);
	}
}

class DataView extends StatefulWidget {
	createState() {
		return new DataViewState();
	}
}

class DataViewState extends State<DataView> {
	dataViewKey = new GlobalKey();
	scheduledPlotMeasurement = false;

	private schedulePlotMeasurement(ctx: RadarChartController): void {
		if (this.scheduledPlotMeasurement) return;
		this.scheduledPlotMeasurement = true;
		this.element.scheduler.addPostFrameCallbacks(() => {
			this.scheduledPlotMeasurement = false;
			const ro = this.dataViewKey.currentContext?.renderObject;
			if (ro == null) return;
			ctx.setPlotSize(ro.size.width, ro.size.height);
		});
	}

	private getLocalPosition(e: MouseEvent): { x: number; y: number } | null {
		const ro = this.dataViewKey.currentContext?.renderObject;
		if (ro == null) return null;
		const view = ro.renderOwner.renderContext.view;
		const rect = view.getBoundingClientRect();
		const flitterGlobalX = e.clientX - rect.left;
		const flitterGlobalY = e.clientY - rect.top;
		const roGlobal = ro.localToGlobal();
		return {
			x: flitterGlobalX - roGlobal.x,
			y: flitterGlobalY - roGlobal.y,
		};
	}

	private handleMouseMove(e: MouseEvent, ctx: RadarChartController): void {
		const local = this.getLocalPosition(e);
		if (local == null) return;

		const ro = this.dataViewKey.currentContext?.renderObject;
		if (ro == null) return;
		const size = ro.size;
		if (size.width <= 0 || size.height <= 0 || ctx.scale == null) return;

			const closest = resolveClosestRadar(
				local,
				size.width,
			size.height,
			ctx.data.datasets.map((dataset, index) => ({
				index,
				legend: dataset.legend,
				vertices: ctx.getRadarVertices(index, dataset.legend) ?? [],
			})),
			);

			const closestPoint = resolveClosestPoint(
				local,
				size.width,
				size.height,
				ctx.data.datasets.map((dataset, index) => ({
					index,
					legend: dataset.legend,
					vertices: ctx.getRadarVertices(index, dataset.legend) ?? [],
				})),
			);

			if (closest == null) {
				ctx.unhoverAllRadars();
			} else {
				ctx.hoverRadar(closest.index, closest.legend);
			}

			if (closestPoint == null) {
				ctx.unhoverAllPoints();
				return;
			}

			ctx.hoverPoint(
				closestPoint.index,
				closestPoint.legend,
				closestPoint.pointIndex,
			);
		}

	override build(context: BuildContext): Widget {
		const ctx = RadarChartProvider.of(context);
		const { data, scale } = ctx;
		const maxValue = scale?.max ?? 0;
		this.schedulePlotMeasurement(ctx);

			return GestureDetector({
				key: this.dataViewKey,
				behavior: "translucent",
				cursor: "default",
				onMouseLeave: () => {
					ctx.unhoverAllRadars();
					ctx.unhoverAllPoints();
				},
				onMouseMove: (e: MouseEvent) => this.handleMouseMove(e, ctx),
			child: ctx.custom.dataView(
				{
					radars: data.datasets.map((dataset, index) => {
						const vertices = computeRadarVertices(
							dataset.values,
							data.labels,
							maxValue,
						);
						return new Radar({
							index,
							legend: dataset.legend,
							vertices,
						});
					}),
				},
				ctx,
			),
		});
	}
}

class Radar extends StatelessWidget {
	#legend: string;
	#index: number;
	#vertices: RadarVertex[];

	constructor({ legend, index, vertices }: { legend: string; index: number; vertices: RadarVertex[] }) {
		super();
		this.#legend = legend;
		this.#index = index;
		this.#vertices = vertices;
	}

		override build(context: BuildContext): Widget {
			const ctx = RadarChartProvider.of(context);
			return ctx.custom.radar(
				{
					legend: this.#legend,
					index: this.#index,
					vertices: this.#vertices,
					isHovered: ctx.isRadarHovered(this.#index, this.#legend),
					hoveredPointIndex:
						ctx.hoveredPoint?.legend === this.#legend &&
						ctx.hoveredPoint?.index === this.#index
							? ctx.hoveredPoint.pointIndex
							: null,
				},
				ctx,
			);
		}
}

	class TooltipOverlay extends StatelessWidget {
		override build(context: BuildContext): Widget {
			const ctx = RadarChartProvider.of(context);
			return ctx.custom.tooltipArea(
				{
					hoveredRadar: ctx.hoveredRadar,
					hoveredPoint: ctx.hoveredPoint,
				},
				ctx,
			);
		}
	}

function resolveClosestRadar(
	point: { x: number; y: number },
	width: number,
	height: number,
	radars: { index: number; legend: string; vertices: RadarVertex[] }[],
): HoveredRadar | null {
	let bestInside: { index: number; legend: string; distance: number } | null = null;
	let bestOverall: { index: number; legend: string; distance: number } | null = null;

	for (const radar of radars) {
		const points = radarVerticesToPoints(radar.vertices, width, height);
		if (points.length === 0) continue;

		const distance = getDistanceToPolygon(point, points);
		if (bestOverall == null || distance < bestOverall.distance) {
			bestOverall = {
				index: radar.index,
				legend: radar.legend,
				distance,
			};
		}

		if (!isPointInPolygon(point, points)) continue;

		if (bestInside == null || distance < bestInside.distance) {
			bestInside = {
				index: radar.index,
				legend: radar.legend,
				distance,
			};
		}
	}

	const hovered = bestInside ?? bestOverall;
	return hovered == null
		? null
		: { index: hovered.index, legend: hovered.legend };
}

function resolveClosestPoint(
	point: { x: number; y: number },
	width: number,
	height: number,
	radars: { index: number; legend: string; vertices: RadarVertex[] }[],
): HoveredRadarPoint | null {
	let best: { index: number; legend: string; pointIndex: number; distance: number } | null = null;

	for (const radar of radars) {
		const points = radarVerticesToPoints(radar.vertices, width, height);
		for (let pointIndex = 0; pointIndex < points.length; pointIndex += 1) {
			const vertex = points[pointIndex];
			const dx = point.x - vertex.x;
			const dy = point.y - vertex.y;
			const distance = dx * dx + dy * dy;
			if (best == null || distance < best.distance) {
				best = {
					index: radar.index,
					legend: radar.legend,
					pointIndex,
					distance,
				};
			}
		}
	}

	return best == null
		? null
		: {
			index: best.index,
			legend: best.legend,
			pointIndex: best.pointIndex,
		};
}
