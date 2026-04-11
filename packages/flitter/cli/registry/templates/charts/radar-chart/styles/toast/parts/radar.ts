import {
	CustomPaint,
	Offset,
	Path,
	type Widget,
} from "flitter-core";
import type { RadarChartCustom } from "@headless/radar-chart/types";
import type { ToastRadarChartConfig } from "../config";

export function toastRadar(
	...[{ legend, index, vertices, hoveredPointIndex }, ctx]: Parameters<RadarChartCustom<ToastRadarChartConfig>["radar"]>
): Widget {
	const { colors, radar: radarConfig } = ctx.config;
	const colorIndex = ctx.legends.indexOf(legend);
	const color = colors[(colorIndex >= 0 ? colorIndex : index) % colors.length];
	const hoveredPoint = ctx.hoveredPoint;
	const isActiveDataset =
		hoveredPoint?.legend === legend &&
		hoveredPoint?.index === index;
	const hasActiveHover = hoveredPoint != null;
	const hoveredVertex = hoveredPointIndex != null
		? vertices[hoveredPointIndex] ?? null
		: null;
	const fillOpacity = hasActiveHover
		? isActiveDataset
			? radarConfig.fillOpacity
			: Math.max(0.08, radarConfig.fillOpacity * 0.35)
		: radarConfig.fillOpacity;
	const strokeOpacity = hasActiveHover
		? isActiveDataset
			? 1
			: 0.28
		: 1;
	const strokeWidth = isActiveDataset
		? radarConfig.strokeWidth + 1.5
		: radarConfig.strokeWidth;

	return CustomPaint({
		painter: {
			svg: {
				createDefaultSvgEl: (context) => ({
					fill: context.createSvgEl("path"),
					stroke: context.createSvgEl("path"),
					point: context.createSvgEl("circle"),
				}),
				paint: ({ fill, stroke, point }, size) => {
					const path = createDatasetPath(vertices, size.width, size.height);
					const d = path.getD();

					fill.setAttribute("d", d);
					fill.setAttribute("fill", color);
					fill.setAttribute("fill-opacity", String(fillOpacity));
					fill.setAttribute("stroke", "none");

					stroke.setAttribute("d", d);
					stroke.setAttribute("fill", "none");
					stroke.setAttribute("stroke", color);
					stroke.setAttribute("stroke-width", String(strokeWidth));
					stroke.setAttribute("stroke-opacity", String(strokeOpacity));
					if (isActiveDataset) {
						stroke.setAttribute("filter", "drop-shadow(0 0 8px rgba(0,0,0,0.24))");
					} else {
						stroke.removeAttribute("filter");
					}

					if (hoveredVertex != null) {
						point.setAttribute("cx", String(hoveredVertex.nx * size.width));
						point.setAttribute("cy", String(hoveredVertex.ny * size.height));
						point.setAttribute("r", "5");
						point.setAttribute("fill", color);
						point.setAttribute("stroke", "white");
						point.setAttribute("stroke-width", "2");
						point.setAttribute("filter", "drop-shadow(0 0 6px rgba(0,0,0,0.2))");
					} else {
						point.setAttribute("r", "0");
						point.removeAttribute("filter");
					}
				},
			},
			canvas: {
				paint: (context, size) => {
					const path = createDatasetPath(vertices, size.width, size.height);
					const canvasPath = path.toCanvasPath();
					const canvas = context.canvas;

					canvas.globalAlpha = fillOpacity;
					canvas.fillStyle = color;
					canvas.fill(canvasPath);
					canvas.globalAlpha = strokeOpacity;
					canvas.strokeStyle = color;
					canvas.lineWidth = strokeWidth;
					if (isActiveDataset) {
						canvas.shadowColor = "rgba(0,0,0,0.24)";
						canvas.shadowBlur = 8;
					}
					canvas.stroke(canvasPath);
					canvas.shadowBlur = 0;

					if (hoveredVertex != null) {
						const x = hoveredVertex.nx * size.width;
						const y = hoveredVertex.ny * size.height;
						canvas.globalAlpha = 1;
						canvas.shadowColor = "rgba(0,0,0,0.2)";
						canvas.shadowBlur = 6;
						canvas.fillStyle = color;
						canvas.beginPath();
						canvas.arc(x, y, 5, 0, Math.PI * 2);
						canvas.fill();
						canvas.shadowBlur = 0;
						canvas.strokeStyle = "white";
						canvas.lineWidth = 2;
						canvas.beginPath();
						canvas.arc(x, y, 5, 0, Math.PI * 2);
						canvas.stroke();
					}
				},
			},
		},
	});
}

function createDatasetPath(
	vertices: { nx: number; ny: number }[],
	width: number,
	height: number,
): Path {
	const path = new Path();
	if (vertices.length === 0) return path;

	for (let i = 0; i <= vertices.length; i += 1) {
		const vertex = vertices[i % vertices.length];
		const x = vertex.nx * width;
		const y = vertex.ny * height;
		if (i === 0) {
			path.moveTo(new Offset({ x, y }));
		} else {
			path.lineTo(new Offset({ x, y }));
		}
	}

	path.close();
	return path;
}
