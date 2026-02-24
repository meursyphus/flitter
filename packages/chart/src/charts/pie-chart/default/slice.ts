import type { PieChartCustom } from '../types';
import { CustomPaint, Path } from 'flitter-core';

const DEFAULT_COLORS = [
	'#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f',
	'#edc948', '#b07aa1', '#ff9da7', '#9c755f', '#bab0ac',
];

export function Slice(
	...[{ index, startAngle, sweepAngle }, { innerRadius, colors }]: Parameters<PieChartCustom['slice']>
) {
	const color = colors[index % colors.length] ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length];

	return CustomPaint({
		painter: {
			svg: {
				createDefaultSvgEl: (context) => {
					return {
						slice: context.createSvgEl('path'),
					};
				},
				paint: ({ slice }, { width, height }) => {
					const path = createSlicePath({ startAngle, sweepAngle, innerRadius, width, height });
					slice.setAttribute('d', path.getD());
					slice.setAttribute('fill', color);
					slice.setAttribute('stroke', 'white');
					slice.setAttribute('stroke-width', '1');
				},
			},
			canvas: {
				paint: (context, { width, height }) => {
					const path = createSlicePath({ startAngle, sweepAngle, innerRadius, width, height });
					context.canvas.fillStyle = color;
					context.canvas.strokeStyle = 'white';
					context.canvas.lineWidth = 1;
					context.canvas.fill(path.toCanvasPath());
					context.canvas.stroke(path.toCanvasPath());
				},
			},
		},
	});
}

function createSlicePath({
	startAngle,
	sweepAngle,
	innerRadius,
	width,
	height,
}: {
	startAngle: number;
	sweepAngle: number;
	innerRadius: number;
	width: number;
	height: number;
}) {
	const path = new Path();
	const cx = width / 2;
	const cy = height / 2;
	const outerR = Math.min(width, height) / 2;
	const innerR = outerR * innerRadius;

	const endAngle = startAngle + sweepAngle;
	const largeArc = sweepAngle > Math.PI;

	const outerStartX = cx + outerR * Math.cos(startAngle);
	const outerStartY = cy + outerR * Math.sin(startAngle);
	const outerEndX = cx + outerR * Math.cos(endAngle);
	const outerEndY = cy + outerR * Math.sin(endAngle);

	if (innerR > 0) {
		const innerStartX = cx + innerR * Math.cos(startAngle);
		const innerStartY = cy + innerR * Math.sin(startAngle);
		const innerEndX = cx + innerR * Math.cos(endAngle);
		const innerEndY = cy + innerR * Math.sin(endAngle);

		path.moveTo({ x: outerStartX, y: outerStartY });
		path.arcToPoint({
			endPoint: { x: outerEndX, y: outerEndY },
			radius: { x: outerR, y: outerR },
			rotation: 0,
			largeArc,
			clockwise: true,
		});
		path.lineTo({ x: innerEndX, y: innerEndY });
		path.arcToPoint({
			endPoint: { x: innerStartX, y: innerStartY },
			radius: { x: innerR, y: innerR },
			rotation: 0,
			largeArc,
			clockwise: false,
		});
		path.close();
	} else {
		path.moveTo({ x: cx, y: cy });
		path.lineTo({ x: outerStartX, y: outerStartY });
		path.arcToPoint({
			endPoint: { x: outerEndX, y: outerEndY },
			radius: { x: outerR, y: outerR },
			rotation: 0,
			largeArc,
			clockwise: true,
		});
		path.close();
	}

	return path;
}
